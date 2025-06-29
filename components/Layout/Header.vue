<template>
  <!-- Contact Info Bar (scrolls away) -->
  <div class="bg-[#212529] text-white py-3 hidden md:block">
    <div class="container mx-auto flex justify-between items-center text-sm">
      <div class="flex items-center gap-4 flex-wrap">
        <a href="mailto:order@dynamostitches.com" class="flex items-center gap-2 hover:text-primary">
          <Mail size="16" />
          <span>order@dynamostitches.com</span>
        </a>
        <span class="text-gray-500">•</span>
        <a href="mailto:accounts@dynamostitches.com" class="flex items-center gap-2 hover:text-primary">
          <Mail size="16" />
          <span>accounts@dynamostitches.com</span>
        </a>
        <span class="text-gray-500">•</span>
        <a href="tel:+13038006078" class="flex items-center gap-2 hover:text-primary">
          <Phone size="16" />
          <span>+1 (303)-800-6078</span>
        </a>
        <span class="text-gray-500">•</span>
        <div class="flex items-center gap-2">
          <Clock size="16" />
          <span>Working Hours: Monday-Friday, 09 am to 5pm</span>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <a href="https://www.instagram.com/dynamostitches/" target="_blank" rel="noopener" class="hover:text-primary"><Instagram size="16" /></a>
        <a href="https://www.facebook.com/share/1F4ALyjdsc/?mibextid=wwXIfr" target="_blank" rel="noopener" class="hover:text-primary"><Facebook size="16" /></a>
        <a href="https://www.linkedin.com/company/dynamo-stitches/" target="_blank" rel="noopener" class="hover:text-primary"><Linkedin size="16" /></a>
        <a href="https://x.com/dynamo_stitches?s=21&t=Yicfow9aDy2i9X737PPplA" target="_blank" rel="noopener" class="hover:text-primary"><Twitter size="16" /></a>
        <a href="https://www.behance.net/dynamostitches" target="_blank" rel="noopener" class="hover:text-primary">
          <img src="/images/icons/behance.svg" alt="Behance" width="20" height="20" class="inline align-middle invert" />
        </a>
      </div>
    </div>
  </div>

  <!-- Fixed Header (always visible) -->
  <header  :class="[
    'fixed w-full z-50 bg-[#033c39] shadow-md md:py-5 py-2 transition-all duration-300',
    isScrolled ? 'top-0' : 'top-10'
  ]">
    <div class="container mx-auto flex items-center justify-between">
      <NuxtLink to="/">
        <div class="flex items-center gap-4">
          <img src="/images/logo.png" alt="Logo" class="w-14 h-14 invert" />
          <h1 class="text-2xl font-display text-white">Dynamo Stitches</h1>
        </div>
      </NuxtLink>

      <DesktopNav :nav-items="navItems" />

      <!-- Mobile Toggle -->
      <button class="md:hidden text-white" @click="isMenuOpen = true">
        <Menu class="text-white" size="32" />
      </button>
    </div>
  </header>

  <!-- Mobile Navigation -->
  <MobileNav :nav-items="navItems" :is-menu-open="isMenuOpen" @close="isMenuOpen = false" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, Mail, Phone, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-vue-next'
import DesktopNav from './DesktopNav.vue'
import MobileNav from './MobileNav.vue'

const isMenuOpen = ref(false)
const isScrolled = ref(false)

const handleScroll = () => {
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
