<template>
  <footer class="bg-primary text-white pt-16 pb-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Company Info -->
        <div>
          <h3 class="text-xl font-bold mb-6">
            <span class="text-secondary">Dynamo</span>Stitches
          </h3>
          <p class="mb-6 text-gray-300">
            Professional embroidery services for businesses, organizations, and individuals.
            Delivering quality craftsmanship since 2010.
          </p>
          <div class="flex space-x-4">
            <a href="https://www.instagram.com/dynamostitches/" target="_blank" rel="noopener"
              class="text-white hover:text-secondary transition-colors">
              <Icon name="Instagram" class="w-5 h-5" />
            </a>
            <a href="https://www.facebook.com/share/1F4ALyjdsc/?mibextid=wwXIfr" target="_blank" rel="noopener"
              class="text-white hover:text-secondary transition-colors">
              <Icon name="Facebook" class="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/company/dynamo-stitches/" target="_blank" rel="noopener"
              class="text-white hover:text-secondary transition-colors">
              <Icon name="Linkedin" class="w-5 h-5" />
            </a>
            <a href="https://x.com/dynamo_stitches?s=21&t=Yicfow9aDy2i9X737PPplA" target="_blank" rel="noopener"
              class="text-white hover:text-secondary transition-colors">
              <Icon name="Twitter" class="w-5 h-5" />
            </a>
            <a href="https://www.behance.net/dynamostitches" target="_blank" rel="noopener"
              class="text-white hover:text-secondary transition-colors">
              <img src="/images/icons/behance.svg" alt="Behance" width="18" height="18"
                class="inline align-middle invert" />
            </a>
          </div>
        </div>

        <!-- Services -->
        <div>
          <h3 class="text-lg font-bold mb-6">Services</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink key="/services/digitizing" to="/services/digitizing"
                class="text-gray-300 hover:text-secondary transition-colors">Digitizing</NuxtLink>
            </li>
            <li>
              <NuxtLink key="/services/vector-artwork" to="/services/vector-artwork"
                class="text-gray-300 hover:text-secondary transition-colors">Vector Artwork</NuxtLink>
            </li>
            <li>
              <NuxtLink key="/services/line-artwork" to="/services/line-artwork"
                class="text-gray-300 hover:text-secondary transition-colors">Line Artwork</NuxtLink>
            </li>
            <li>
              <NuxtLink key="/services/logo-designing" to="/services/logo-designing"
                class="text-gray-300 hover:text-secondary transition-colors">Logo Designing</NuxtLink>
            </li>
            <li>
              <NuxtLink key="/services/custom-patches" to="/services/custom-patches"
                class="text-gray-300 hover:text-secondary transition-colors">Custom Patches</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-bold mb-6">Quick Links</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/" class="text-gray-300 hover:text-secondary transition-colors">Home</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="text-gray-300 hover:text-secondary transition-colors">About Us</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="text-gray-300 hover:text-secondary transition-colors">Contact</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/privacy-terms" class="text-gray-300 hover:text-secondary transition-colors">Privacy and
                Terms</NuxtLink>
            </li>

          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-bold mb-6">Contact Us</h3>
          <ul class="space-y-4">
            <li class="flex items-center">
              <Icon name="Phone" class="mr-2" />
              <a href="tel:+15551234567" class="text-gray-300 hover:text-secondary transition-colors">{{ CONTACT_NUMBER
                }}</a>
            </li>
            <li class="flex items-center">
              <Icon name="Mail" class="mr-2" />
              <a href="mailto:order@dynamostitches.com "
                class="text-gray-300 hover:text-secondary transition-colors">order@dynamostitches.com</a>
            </li>
            <li class="flex items-center">
              <Icon name="Mail" class="mr-2" />
              <a href="mailto:accounts@dynamostitches.com "
                class="text-gray-300 hover:text-secondary transition-colors">accounts@dynamostitches.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400 text-sm mb-4 md:mb-0">
          © {{ currentYear }} Dynamo Stitches. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>
