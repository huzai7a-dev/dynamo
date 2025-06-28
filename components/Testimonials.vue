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
                    border border-gray-100
                    p-8 rounded-2xl
                    transition-all duration-500 ease-in-out
                    hover:shadow-2xl hover:-translate-y-2
                    hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10
                    group cursor-pointer
                    relative overflow-hidden">
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

          <!-- Author Info -->
          <div class="flex items-center relative z-10">
            <img :src="testimonial.avatar" :alt="testimonial.name" 
                 class="w-14 h-14 rounded-full mr-4 border-2 border-primary/20
                        transition-transform duration-300
                        group-hover:scale-110 group-hover:border-primary/40">
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
    text: "Dynamo Stitches transformed our company uniforms with exceptional quality embroidery. The attention to detail and professional service exceeded our expectations.",
    name: "Sarah Johnson",
    position: "HR Manager, Tech Corp",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    text: "Outstanding work on our team jerseys! The embroidery quality is top-notch and the turnaround time was incredibly fast. Highly recommended!",
    name: "Mike Chen",
    position: "Coach, City Basketball Team",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop&crop=face"
  },
  {
    text: "Professional service from start to finish. They helped digitize our logo and the embroidered polo shirts look fantastic. Will definitely use them again.",
    name: "Emily Rodriguez",
    position: "Marketing Director, Local Business",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop&crop=face"
  }
]
</script>
