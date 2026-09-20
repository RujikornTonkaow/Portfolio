import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { once } from 'node:events'
import test from 'node:test'

// Uses an isolated API fixture; never writes to the real CMS.
test('production page follows CMS additions, edits, removals, and API failures', async () => {
  const requests = []
  let unavailable = false
  let hanging = false
  const content = {
    site_settings: {
      site_title: 'Studio fixture',
      page_title: 'Fixture portfolio',
      meta_description: 'Fixture description',
      footer_tagline: 'Footer from CMS',
      default_theme: 'midnight',
      profile_image: '/portrait.jpg',
      updated_at: '2026-09-20',
    },
    hero: {
      greeting: 'CMS greeting',
      full_name: 'CMS Developer',
      subtitle: 'CMS subtitle',
      cta_primary_text: 'CMS primary',
      cta_primary_link: '#projects',
      cta_secondary_text: 'CMS secondary',
      cta_secondary_link: '#contact',
    },
    about: {
      title: 'CMS about',
      bio_paragraphs: ['CMS biography'],
      personality_tags: ['CMS personality'],
      stats: [{ value: '12', label: 'CMS stat' }],
    },
    projects: [
      {
        id: 'project-1',
        title: 'Original project',
        description: 'CMS project description',
        tags: ['Vue'],
        image: '/project.jpg',
        live_url: 'https://example.com/demo',
        source_url: 'https://example.com/source',
      },
    ],
    skills: [
      {
        id: 'skill-1',
        name: 'CMS skill',
        icon: 'mdi:code-braces',
        category: 'frontend',
      },
    ],
    experiences: [
      {
        id: 'experience-1',
        role: 'CMS role',
        company: 'CMS company',
        period: '2024–2026',
        description: 'CMS experience',
        highlights: ['CMS highlight'],
      },
    ],
    social_links: [
      {
        id: 'social-1',
        name: 'CMS social',
        url: 'https://example.com/social',
        icon: 'mdi:github',
      },
    ],
    nav_items: [{ label: 'CMS navigation', href: '#projects' }],
  }
  const api = createServer((req, res) => {
    requests.push(req.url)
    if (hanging) return
    res.setHeader('Content-Type', 'application/json')
    if (unavailable) {
      res.writeHead(503)
      res.end(JSON.stringify({ error: 'Fixture unavailable' }))
      return
    }
    if (req.url.startsWith('/api/v1/public/sites/by-domain?'))
      res.end(JSON.stringify({ data: { id: 'fixture-site' } }))
    else if (req.url === '/api/v1/public/sites/fixture-site/portfolio')
      res.end(JSON.stringify({ data: content }))
    else {
      res.writeHead(404)
      res.end('{}')
    }
  })
  api.listen(0, '127.0.0.1')
  await once(api, 'listening')
  const portProbe = createServer()
  portProbe.listen(0, '127.0.0.1')
  await once(portProbe, 'listening')
  const port = portProbe.address().port
  await new Promise((resolve) => portProbe.close(resolve))
  const app = spawn(process.execPath, ['.output/server/index.mjs'], {
    env: {
      ...process.env,
      NITRO_HOST: '127.0.0.1',
      NITRO_PORT: String(port),
      NUXT_PUBLIC_API_BASE_URL: `http://127.0.0.1:${api.address().port}`,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  })
  let output = ''
  app.stdout.on('data', (chunk) => {
    output += chunk
  })
  app.stderr.on('data', (chunk) => {
    output += chunk
  })
  const url = `http://127.0.0.1:${port}`
  try {
    let html
    for (let attempt = 0; attempt < 80; attempt++) {
      if (app.exitCode !== null) throw new Error(output)
      try {
        const response = await fetch(url)
        assert.equal(response.status, 200)
        html = await response.text()
        break
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 150))
      }
    }
    assert.ok(html, `Production server did not start: ${output}`)
    for (const text of [
      'CMS Developer',
      'CMS subtitle',
      'CMS primary',
      'CMS secondary',
      'CMS about',
      'CMS biography',
      'CMS personality',
      'CMS stat',
      'Original project',
      'CMS skill',
      'CMS role',
      'CMS company',
      'CMS highlight',
      'CMS social',
      'CMS navigation',
      'Footer from CMS',
    ])
      assert.ok(html.includes(text), `Missing CMS field: ${text}`)
    assert.ok(
      requests.some((path) => {
        const request = new URL(path, 'http://fixture.local')
        return (
          request.pathname.endsWith('/by-domain') &&
          request.searchParams.get('host') === `127.0.0.1:${port}`
        )
      }),
    )
    assert.ok(
      html.includes(`http://127.0.0.1:${api.address().port}/project.jpg`),
    )
    assert.ok(html.includes('https://example.com/demo'))
    for (const section of [
      'hero',
      'about',
      'projects',
      'skills',
      'experience',
      'contact',
    ])
      assert.ok(html.includes(`id="${section}"`))

    content.hero.full_name = 'Updated developer'
    content.projects[0].title = 'Edited project'
    content.projects.push({
      id: 'project-2',
      title: 'Newly added project',
      description: 'Added through CMS',
      tags: ['Nuxt'],
    })
    html = await (await fetch(url)).text()
    assert.ok(html.includes('Updated developer'))
    assert.ok(html.includes('Edited project'))
    assert.ok(html.includes('Newly added project'))
    assert.ok(!html.includes('Original project'))

    content.projects = []
    content.skills = []
    content.experiences = []
    html = await (await fetch(url)).text()
    assert.ok(!html.includes('Edited project'))
    assert.ok(!html.includes('Newly added project'))
    assert.ok(!html.includes('CMS skill'))
    assert.ok(!html.includes('CMS role'))
    assert.ok(html.includes('New work is on the way'))

    hanging = true
    const requestCount = requests.length
    const started = Date.now()
    html = await (
      await fetch(url, { signal: AbortSignal.timeout(9000) })
    ).text()
    assert.ok(
      Date.now() - started < 8000,
      'An unresponsive API must not hold SSR open',
    )
    assert.ok(html.includes('Unable to load the portfolio right now.'))
    assert.equal(
      requests.length - requestCount,
      1,
      'Sections must not each retry the stalled request',
    )
    hanging = false
    html = await (await fetch(url)).text()
    assert.ok(
      html.includes('Updated developer'),
      'A new request must recover when the API is available',
    )

    unavailable = true
    html = await (await fetch(url)).text()
    assert.ok(
      html.includes('Unable to load the portfolio right now.'),
      html
        .match(
          /.{0,80}(data-notice|Loading portfolio|temporarily unavailable).{0,200}/g,
        )
        ?.join('\n') || html.slice(0, 500),
    )
    assert.ok(html.includes('Try again'))
    assert.match(html, /<button[^>]*disabled[^>]*>/)
  } finally {
    app.kill()
    await once(app, 'exit').catch(() => {})
    api.closeAllConnections()
    await new Promise((resolve) => api.close(resolve))
  }
})
