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
          <span class="absolute -bottom-2 left-0 w-full h-1 bg-teal-gradient rounded-full"></span>
        </h2>
        <p class="text-xl text-gray-600 mt-4">
          Dedicated professionals passionate about bringing your vision to life.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 [perspective:1000px]">
        <div v-for="(member, index) in teamMembers" :key="index"
             class="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-6 text-center
                    shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out hover:-translate-y-4 
                    hover:bg-gradient-to-br hover:from-primary/15 hover:to-primary/25
                    group cursor-pointer relative overflow-hidden animate-fade-in transform-gpu preserve-3d 
                    hover:rotate-x-5 hover:rotate-y-5 group-hover:shadow-3xl-primary
                    before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:border-4 before:border-transparent before:transition-all before:duration-500 before:ease-in-out
                    group-hover:before:border-t-primary/50 group-hover:before:border-r-secondary/50 group-hover:before:border-b-primary/50 group-hover:before:border-l-secondary/50 group-hover:before:scale-105">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 
                      group-hover:from-primary/15 group-hover:to-primary/25 
                      transition-all duration-500"></div>
          <div class="relative mb-6 w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20
                      group-hover:border-primary/40 transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:rotate-3 group-hover:translate-z-10">
            <!-- Decorative background circle for image -->
            <div class="absolute inset-0 bg-primary/10 rounded-full transform scale-0 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500 z-0"></div>
            <img :src="member.image" :alt="member.name" class="w-full h-full object-cover relative z-10 transition-all duration-300 group-hover:brightness-110 group-hover:saturate-150 filter grayscale sepia-30 group-hover:filter-none group-hover:-translate-y-1" />
          </div>
          <h3 class="text-xl font-bold text-secondary mb-1 group-hover:text-primary transition-colors duration-300 transform group-hover:scale-105 group-hover:rotate-1 group-hover:drop-shadow-md"> {{ member.name }}</h3>
          <p class="text-primary text-sm font-medium mb-4 group-hover:text-primary/90 transition-colors duration-300 transform group-hover:scale-105 group-hover:rotate-1 group-hover:drop-shadow-md">{{ member.position }}</p>
          <p class="text-gray-600 text-sm italic relative z-10 group-hover:text-gray-700 transition-all duration-300 transform group-hover:scale-[1.02] group-hover:-translate-y-2 group-hover:drop-shadow-md">"{{ member.quote }}"</p>
          
          <!-- Social Media Icons -->
          <div class="flex justify-center gap-3 mt-6 relative z-10 opacity-0 group-hover:opacity-100 
                      transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
            <a :href="member.social.twitter" target="_blank" v-if="member.social?.twitter"
               class="relative w-9 h-9 flex items-center justify-center rounded-full border border-transparent
                      text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-140 hover:-translate-y-1 hover:shadow-xl group-hover:translate-z-10
                      before:content-[''] before:absolute before:inset-0 before:bg-primary before:rounded-full before:scale-0 before:opacity-0 before:origin-center before:transition-all before:duration-300 before:ease-out before:z-[-1] group-hover:before:scale-130 group-hover:before:opacity-100 hover:border-primary/50 group-hover:before:rotate-12">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.176-1.555-3.594-1.555-3.379 0-6.122 2.91-6.122 6.492 0 .509.058 1.002.164 1.474-5.09-2.57-9.608-5.732-12.677-9.068-.524.896-.827 1.934-.827 3.004 0 2.243 1.144 4.212 2.892 5.378-.26-.006-.525-.084-.79-.228v.081c0 3.141 2.378 5.756 5.514 6.341-.58.158-1.196.236-1.834.236-.448 0-.883-.04-1.304-.124.874 2.686 3.424 4.654 6.44 4.708-2.478 1.946-5.594 3.111-8.986 3.111-.585 0-1.16-.036-1.725-.104C2.933 22.454 6.452 24 10.129 24c12.115 0 18.75-10.089 18.75-18.847 0-.285-.009-.568-.027-.847A13.083 13.083 0 0024 4.557z" />
              </svg>
            </a>
            <a :href="member.social.linkedin" target="_blank" v-if="member.social?.linkedin"
               class="relative w-9 h-9 flex items-center justify-center rounded-full border border-transparent
                      text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-140 hover:-translate-y-1 hover:shadow-xl group-hover:translate-z-10
                      before:content-[''] before:absolute before:inset-0 before:bg-secondary before:rounded-full before:scale-0 before:opacity-0 before:origin-center before:transition-all before:duration-300 before:ease-out before:z-[-1] group-hover:before:scale-130 group-hover:before:opacity-100 hover:border-secondary/50 group-hover:before:rotate-12">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.568c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.955v5.65h-3.554V9h3.414v1.561h.047c.447-.852 1.54-1.852 3.382-1.852 3.422 0 4.053 2.265 4.053 6.57v7.182zm-11.833-11.391c-.727 0-1.201-.481-1.201-1.096c0-.616.484-1.096 1.201-1.096c.729 0 1.202.481 1.202 1.096c0 .615-.473 1.096-1.202 1.096zm1.754 11.391H6.602V9h3.555v11.452zM22.227 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.456c.98 0 1.773-.773 1.773-1.729V1.729C24 .774 23.207 0 22.227 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    <ContactBanner/>
  </section>
</template>

<script setup>
const teamMembers = [
  {
    name: 'John Doe',
    position: 'Lead Digitizer',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    quote: 'Transforming designs into perfect stitches.',
    social: {
      twitter: '#',
      linkedin: '#'
    }
  },
  {
    name: 'Jane Smith',
    position: 'Vector Artist',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop&crop=face',
    quote: 'Bringing creativity to life with precision.',
    social: {
      twitter: '#',
      linkedin: '#'
    }
  },
  {
    name: 'David Lee',
    position: 'Production Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop&crop=face',
    quote: 'Ensuring quality and timely delivery.',
    social: {
      twitter: '#',
      linkedin: '#'
    }
  },
  {
    name: 'Emily White',
    position: 'Client Relations',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    quote: 'Your vision is our top priority.',
    social: {
      twitter: '#',
      linkedin: '#'
    }
  }
]
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