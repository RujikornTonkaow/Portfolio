<script setup lang="ts">
const { theme, toggleTheme } = useTheme()

const label = computed(() =>
  theme.value === 'midnight' ? 'Switch to sunshine theme' : 'Switch to midnight theme',
)
</script>

<template>
  <button
    class="p-2 rounded-lg text-th-muted hover:text-th-accent hover:bg-th-overlay/5 transition-colors duration-200"
    :aria-label="label"
    @click="toggleTheme"
  >
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 rotate-[-90deg] scale-0"
      enter-to-class="opacity-100 rotate-0 scale-100"
      leave-active-class="transition-all duration-300 absolute"
      leave-from-class="opacity-100 rotate-0 scale-100"
      leave-to-class="opacity-0 rotate-90 scale-0"
      mode="out-in"
    >
      <Icon
        v-if="theme === 'midnight'"
        key="sun"
        name="mdi:white-balance-sunny"
        size="20"
      />
      <Icon
        v-else
        key="moon"
        name="mdi:weather-night"
        size="20"
      />
    </Transition>
  </button>
</template>
