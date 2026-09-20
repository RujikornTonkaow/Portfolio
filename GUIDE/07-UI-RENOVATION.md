# Portfolio UI renovation

The public portfolio now uses an editorial layout with charcoal / ivory themes,
lime accents, responsive project cards, project-tag filters, a skills grid,
an experience list, and a two-column contact section.

## CMS compatibility

- The existing domain-to-site lookup and site-scoped portfolio endpoints remain unchanged.
- Hero copy and CTAs, profile photo, about content, stats, skills, projects,
  experiences, social links, navigation, metadata, default theme, and footer
  content still come from `usePortfolioData`.
- Collection items are rendered from the API without a fixed item limit.
- Project filters are generated from API tags. Missing or failed project images
  get a decorative placeholder instead of a broken image.
- Contact uses the same site-scoped POST endpoint and payload as before.
- `usePortfolioData` exposes its existing async request as `ready` so the page
  can await it during SSR and render the correct success/error state.
- Domain resolution and content loading share a five-second deadline with
  automatic HTTP retries disabled. A request-scoped initialization flag prevents
  each section from restarting a failed request; the retry button still explicitly
  refreshes data. An unavailable API therefore cannot hold SSR open indefinitely.
- The admin application and backend are separate from this repository. No CMS
  schema migration or new admin field is required. The decorative sculpture is
  presentation code, not a new CMS-managed field.

## Three.js

`components/HeroSculpture.client.vue` is lazy-loaded on the client. It renders
a torus-knot sculpture with pointer response, a wireframe shell, and an orbit.
It caps pixel density, pauses when outside the viewport or in a hidden tab,
respects reduced-motion preferences, and offers a manual pause button.
WebGL failure uses a CSS fallback. Geometry, materials, observers, listeners,
and the renderer are released on unmount.

Renderer lifecycle reference: [Three.js WebGLRenderer documentation](https://threejs.org/docs/pages/WebGLRenderer.html).

## Verification

```sh
npm run build
npm run typecheck
npm run test:render
```

The render test needs a current production build. It starts an isolated API
fixture and production server on temporary localhost ports. It checks CMS
fields, domain resolution, asset URLs, collection additions/edits/removals,
empty states, and API failure handling. It never modifies real CMS records.

Browser visual review, WebGL interaction, mobile navigation, and live admin
CRUD/contact submission still need a connected browser and running backend;
the render test does not replace those checks.
