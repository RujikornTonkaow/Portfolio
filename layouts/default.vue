<script setup lang="ts"></script>

<template>
  <div class="min-h-screen">
    <a href="#main-content" class="skip-link">Skip to content</a>
    <TheNavbar />
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
