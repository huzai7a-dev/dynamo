<script setup>
const processSteps = [
  {
    icon: 'Users',
    title: 'Registration',
  },
  {
    icon: 'Quote',
    title: 'Quote',
  },
  {
    icon: 'ShoppingCart',
    title: 'Order Placement',
  },
  {
    icon: 'Handshake',
    title: 'Delivery',
  },
  {
    icon: 'HandCoins',
    title: 'Payment',
  },
]
</script>

<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-4xl md:text-5xl font-extrabold mb-4 text-primary leading-10">
          Our Working <span class="bg-primary text-white px-2">Process</span>
        </h2>
      </div>

      <div class="relative flex flex-col md:flex-row justify-between items-start pt-16 pb-8 lg:px-16">
        <!-- Wavy Line SVG: Vertical on mobile, horizontal on md+ -->
        <!-- Horizontal Wavy Line for md+ -->
        <svg class="hidden md:block absolute top-[100px] left-0 right-0 w-full h-8 z-0" viewBox="0 0 1000 20">
          <path fill="none" stroke="#008080" stroke-width="3" 
                d="M0,10 C100,20 200,0 300,10 S400,20 500,10 S600,0 700,10 S800,20 900,10 S1000,0 1100,10" />
        </svg>
        <!-- Vertical Wavy Line for mobile -->
        <svg class="block md:hidden absolute left-1/2 -translate-x-1/2 top-0 bottom-0 h-full w-8 z-0" viewBox="0 0 20 1000">
          <path fill="none" stroke="#008080" stroke-width="3" 
                d="M10,0 C20,100 0,200 10,300 S20,400 10,500 S0,600 10,700 S20,800 10,900 S0,1000 10,1100" />
        </svg>

        <div v-for="(step, index) in processSteps" :key="index" 
             class="flex flex-col items-center text-center relative z-10 w-full md:w-1/5 px-2 group mb-12 md:mb-0">
          <!-- Icon Circle -->
          <div class="w-24 h-24 rounded-full bg-white flex items-center justify-center 
                      shadow-lg border-2 border-primary/20 mb-6
                      transition-all duration-300 ease-in-out
                      hover:shadow-2xl hover:scale-110 hover:border-primary/40 ">
            <Icon :name="step.icon" class="w-12 h-12 text-primary
                                         transition-colors duration-300 group-hover:text-primary/80" />
          </div>
          <h3 class="text-xl font-bold text-secondary px-3 bg-white
                     transition-all duration-300 group-hover:text-primary group-hover:scale-105">{{ step.title }}</h3>
        </div>
      </div>
    </div>
  </section>
</template> 