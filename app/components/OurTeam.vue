<template>
  <section class="py-16 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
    <!-- Background Pattern - Adjusting color for better visibility with blue gradient -->
    <div class="absolute inset-0 z-0 opacity-10 animate-pulse-subtle text-primary/50">
      <svg class="w-full h-full" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <pattern id="team-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1" fill="currentColor" /> <!-- Changed fill to currentColor -->
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#team-pattern)" />
      </svg>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
        <h2 class="text-4xl md:text-5xl font-extrabold mb-4 text-primary leading-10 relative inline-block">
          Meet Our <span class="bg-primary text-white px-2">Team</span>
        </h2>
        <p class="text-xl text-gray-600 mt-4">
          Dedicated professionals passionate about bringing your vision to life.
        </p>
      </div>

      <CustomSwiper :items="teamMembers">
        <template #card="{ item }">
          <div
            class="bg-white border border-primary/10 rounded-2xl flex flex-col min-h-[250px] py-6 px-4 items-center justify-between transition-all duration-300 hover:shadow-2xl">
            <div class="flex flex-col items-center w-full">
              <div
                class="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-blue-100 border-4 border-primary/20 mb-4 flex items-center justify-center overflow-hidden">
                <NuxtImg format="webp" :src="item.image" :alt="item.name" class="w-full h-full object-cover"
                  loading="lazy" />
              </div>
              <h3 class="text-lg font-bold text-primary mb-1">{{ item.name }}</h3>
              <p class="text-secondary text-xs font-medium mb-2">{{ item.position }}</p>
            </div>
            <div class="flex justify-center gap-3 mt-4 w-full">
              <a v-if="item.social?.instagram" :href="item.social.instagram" target="_blank"
                class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-pink-500 hover:bg-pink-50 transition-colors">
                <Icon name="Instagram" class="w-5 h-5" />
              </a>
              <a v-if="item.social?.facebook" :href="item.social.facebook" target="_blank"
                class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors">
                <Icon name="Facebook" class="w-5 h-5" />
              </a>
              <a v-if="item.social?.linkedin" :href="item.social.linkedin" target="_blank"
                class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-secondary hover:bg-secondary/10 transition-colors">
                <Icon name="Linkedin" class="w-5 h-5" />
              </a>
              <a v-if="item.social?.x" :href="item.social.x" target="_blank"
                class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-black hover:bg-gray-100 transition-colors">
                <Icon name="X" class="w-5 h-5" />
              </a>
              <a v-if="item.email" :href="`mailto:${item.email}`"
                class="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-primary hover:bg-primary/10 transition-colors">
                <Icon name="Mail" class="w-5 h-5" />
              </a>
            </div>
          </div>
        </template>
      </CustomSwiper>
    </div>
    <ContactBanner />
  </section>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
const ContactBanner = defineAsyncComponent(() => import('./ContactBanner.vue'));

const CustomSwiper = defineAsyncComponent(() => import('@/components/CustomSwiper.vue'));

const teamMembers = [
  {
    name: 'Dynamo Stitches',
    position: 'Social Media Team',
    email: 'order@dynamostitches.com',
    image: '/images/user.png',
    social: {
      instagram: 'https://www.instagram.com/dynamostitches/',
      facebook: 'https://www.facebook.com/share/1F4ALyjdsc/?mibextid=wwXIfr',
      linkedin: 'https://www.linkedin.com/company/dynamo-stitches/'
    }
  },
  {
    name: 'Sam Khan',
    position: 'Administrator',
    email: 'sam.dynamostitches@gmail.com',
    image: '/images/user.png',
    social: {}
  },
  {
    name: 'Richard Steven',
    position: 'Accounts Department',
    email: 'accounts@dynamostitches.com',
    image: '/images/user.png',
    social: {}
  },
  {
    name: 'Jack Smith',
    position: 'Sales Manager',
    email: 'jack.dynamostitches@gmail.com',
    image: '/images/user.png',
    social: {
      instagram: 'https://www.instagram.com/jack.smith7477/'
    }
  },
  {
    name: 'Kevin Anthony',
    position: 'Sales Executive',
    email: 'kevin.dynamostitches@gmail.com',
    image: '/images/user.png',
    social: {
      instagram: 'https://www.instagram.com/kevinanthony5358/'
    }
  },
  {
    name: 'Frank Robert',
    position: 'Sales Executive',
    email: 'frank.dynamostitches@gmail.com',
    image: '/images/user.png',
    social: {
      instagram: 'https://www.instagram.com/frankrobert_2/'
    }
  },
  {
    name: 'Jonathan Henry',
    position: 'Sales Executive',
    email: 'jonathan.dynamostitches@gmail.com',
    image: '/images/user.png',
    social: {
      instagram: 'https://www.instagram.com/jonathanhenry185/'
    }
  },
  {
    name: 'James Carter',
    position: 'Sales Executive',
    email: 'james.dynamostitches@gmail.com',
    image: '/images/user.png',
    social: {
      instagram: 'https://www.instagram.com/james.carter987?igsh=NW8wMjQwaTB1dGpk'
    }
  },
  {
    name: 'Calvin Mateo',
    position: 'Sales Executive',
    email: 'calvin.dynamostitches@gmail.com',
    image: '/images/user.png',
    social: {
      instagram: 'https://www.instagram.com/calvinmateo_?igsh=MWhybTlodzdsbTIwdg=='
    }
  }
];
</script>

<style scoped>
.animate-pulse-subtle {
  animation: pulse-subtle 4s infinite alternate;
}

@keyframes pulse-subtle {
  0% {
    opacity: 0.05;
  }

  100% {
    opacity: 0.15;
  }
}
</style>