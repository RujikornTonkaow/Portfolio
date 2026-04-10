<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  src: '/images/profile.jpg',
  alt: 'Profile picture',
  size: 'lg',
})

const sizeClasses: Record<string, string> = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-40 h-40',
  xl: 'w-56 h-56',
}

const ringSize: Record<string, string> = {
  sm: 'w-[4.5rem] h-[4.5rem]',
  md: 'w-[6.5rem] h-[6.5rem]',
  lg: 'w-[11rem] h-[11rem]',
  xl: 'w-[15rem] h-[15rem]',
}
</script>

<template>
  <div class="relative inline-flex items-center justify-center">
    <div
      :class="ringSize[props.size]"
      class="absolute rounded-full bg-gradient-to-tr from-th-ring-from via-th-ring-via to-th-ring-to animate-spin-slow opacity-60 blur-sm"
    />
    <div
      :class="ringSize[props.size]"
      class="absolute rounded-full bg-gradient-to-tr from-th-ring-from via-th-ring-via to-th-ring-to"
    />
    <img
      :src="props.src"
      :alt="props.alt"
      :class="sizeClasses[props.size]"
      class="relative rounded-full object-cover border-2 border-th-bg"
    >
  </div>
</template>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
</style>
