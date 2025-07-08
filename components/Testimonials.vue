<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-4xl md:text-5xl font-extrabold mb-4 text-primary leading-10">
          What Our <span class="bg-primary text-white px-2">Clients</span> Say
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(testimonial, index) in testimonials" :key="index" 
             class="bg-gradient-to-br from-white to-gray-50
                    border border-primary-100
                    p-8 rounded-2xl
                    transition-all duration-500 ease-in-out
                    hover:shadow-2xl hover:-translate-y-2
                    hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10
                    group cursor-pointer
                    relative overflow-hidden
                    flex flex-col h-full min-h-[420px]">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 
                      group-hover:from-primary/5 group-hover:to-primary/10 
                      transition-all duration-500"></div>
          
          <!-- Quote Icon -->
          <div class="absolute top-6 right-6 text-primary/10 group-hover:text-primary/20 transition-colors duration-300">
            <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          <!-- Stars -->
          <div class="flex items-center mb-6 relative z-10">
            <div v-for="star in 5" :key="star" class="text-primary">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
          </div>

          <!-- Testimonial Text -->
          <p class="text-gray-600 mb-8 italic text-lg leading-relaxed relative z-10
                     group-hover:text-gray-700 transition-colors duration-300">
            "{{ testimonial.text }}"
          </p>

          <!-- Author Info at Bottom -->
          <div class="flex items-center relative z-10 mt-auto pt-4">
            <NuxtImg format="webp" :src="testimonial.avatar" :alt="testimonial.name" 
                 class="w-14 h-14 rounded-full mr-4 border-2 border-primary/20
                        transition-transform duration-300
                        group-hover:scale-110 group-hover:border-primary/40"
                 loading="lazy"/>
            <div>
              <p class="font-semibold text-lg text-primary group-hover:text-primary/90 transition-colors duration-300">
                {{ testimonial.name }}
              </p>
              <p class="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                {{ testimonial.position }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    text: "So, I was in a pinch needing some custom embroidery for my Etsy shop, and Dynamo Stitches came through big time. I sent them this super intricate design, and they nailed it. Like, the detail was spot-on, and they got it done faster than I expected. They really listened to what I wanted. Honestly, if you need killer embroidery digitizing, these guys are where it's at.",
    name: "Jordan Rivera",
    position: "Etsy Shop Owner",
    avatar: "/images/user.png"
  },
  {
    text: "I had this last-minute project and desperately needed some clean vector art. Dynamo Stitches brought my super rough ideas to life better than I imagined. They even tweaked the design based on my feedback without any hassle. And the price is totally reasonable. I'll definitely be back for more.",
    name: "Riley Greene",
    position: "Designer",
    avatar: "/images/user.png"
  },
  {
    text: "I'm always very satisfied with your work! You're one of the best digitizers. You're very friendly, fast, and deliver high-quality results. I'll always come back to you for digitization needs.",
    name: "Celine Radtke",
    position: "Embroidery Business Owner",
    avatar: "/images/user.png"
  }
]
</script>
