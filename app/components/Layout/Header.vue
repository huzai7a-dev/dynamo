<template>
  <!-- Contact Info Bar (scrolls away) -->
  <HeaderTopBar />
  
  <!-- Fixed Header (always visible) -->
  <header  :class="[
    'fixed w-full z-50 bg-[#033c39] shadow-md md:py-5 py-2 transition-all duration-300',
    'top-0',
    isScrolled ? 'md:top-0' : 'md:top-10'
  ]">
    <div class="container mx-auto flex items-center justify-between">
      <NuxtLink key="/" to="/">
        <div class="flex items-center gap-4">
          <NuxtImg format="webp"src="/images/logo.png"  alt="Logo" class="w-14 h-14 invert" />
          <h1 class="text-2xl font-display text-white">Dynamo Stitches</h1>
        </div>
      </NuxtLink>

      <DesktopNav :nav-items="navItems" />

      <div>
        <NuxtLink to="/login" class="btn btn-primary">
          <UiButton rounded size="lg">Login</UiButton>
        </NuxtLink>
        <NuxtLink to="/register" class="btn btn-primary ml-4">
          <UiButton rounded size="lg">Register</UiButton>
        </NuxtLink>
      </div>

      <!-- Mobile Toggle -->
      <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-white">
        <Icon name="Menu" size="24" />
      </button>
    </div>
  </header>

  <!-- Mobile Navigation -->
  <MobileNav :nav-items="navItems" :is-menu-open="isMenuOpen" @close="isMenuOpen = false" />
</template>

<script setup>
import { UiButton } from '#components'
import { ref, onMounted, onUnmounted } from 'vue'
import { defineAsyncComponent } from 'vue'

const DesktopNav = defineAsyncComponent(() => import('./DesktopNav.vue'))
const MobileNav = defineAsyncComponent(() => import('./MobileNav.vue'))
const HeaderTopBar = defineAsyncComponent(() => import('./HeaderTopBar.vue'))

const isMenuOpen = ref(false)
const isScrolled = ref(false)

const handleScroll = () => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return;
  }
  
  if (window.scrollY > 0) {
    isScrolled.value = true
  } else {
    isScrolled.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
const navItems = [
  {
    label: 'Home',
    url: '/'
  },
  {
    label: 'Services',
    url: '/services',
    subNav: [
      {
        label: 'Digitizing',
        url: '/services/digitizing'
      },
      {
        label: 'Vector Artwork',
        url: '/services/vector-artwork'
      },
      {
        label: 'Logo Designing',
        url: '/services/logo-designing'
      },
      {
        label: 'Line Artwork',
        url: '/services/line-artwork'
      },
      {
        label: 'Custom Patches',
        url: '/services/custom-patches'
      },
    ]
  },
  {
    label: 'About Us',
    url: '/about'
  },
  {
    label: 'Contact',
    url: '/contact'
  },
  {
    label: 'Privacy & Terms',
    url: '/privacy-terms'
  },
]
</script>
