<template>
  <section id="services" class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-4xl md:text-5xl font-extrabold mb-4 text-primary leading-10" style="line-height: 1.2;">
          We Provide <span class="bg-primary text-white px-2"> Best </span> <br /> Designing Services
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div v-for="(service, index) in services" :key="index" class="flex flex-col items-center text-center 
                    bg-gradient-to-br from-white to-gray-50
                    border border-gray-100
                    px-8 py-10 rounded-2xl
                    transition-all duration-500 ease-in-out
                    hover:shadow-2xl hover:-translate-y-3 
                    hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10
                    group cursor-pointer
                    relative overflow-hidden" :class="service.colStart">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 
                      group-hover:from-primary/5 group-hover:to-primary/10 
                      transition-all duration-500"></div>
          <div class="text-center">
            <Icon :name="service.icon" class="w-16 h-16 text-primary mb-6 
                         transition-all duration-500 ease-in-out
                         group-hover:scale-110 group-hover:text-primary/90
                         relative z-10" />
            <h3 class="text-2xl font-bold text-secondary mb-4 
                       transition-colors duration-300
                       group-hover:text-primary
                       relative z-10">{{ service.title }}</h3>
            <p class="text-secondary/80 max-w-xs 
                       transition-colors duration-300
                       group-hover:text-secondary/90
                       relative z-10">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const services = [
  {
    icon: 'Anchor',
    title: 'Embroidery Digitizing',
    description: 'We have designers with nearly years of expertise in this industry who understand the depth of the design and intricacy of the LOGOs.'
  },
  {
    icon: 'PenTool',
    title: 'Vector Artwork',
    description: 'We provide a variety of services, including screen print art. We will always be on your side, no matter how intricate the design or how rough the image is.'
  },
  {
    icon: 'Palette',
    title: 'Logo Designing',
    description: 'Trust the experts to create a logo that perfectly represents your business and connects with your target audience.'
  },
  {
    icon: 'BadgePercent',
    title: 'Custom Patches',
    description: 'We specialize in a variety of custom patches. Our team is equipped with the knowledge and skills necessary to bring your vision to life.'
  },
  {
    icon: 'PenLine',
    title: 'Line Artwork',
    description: 'In our Line Art Services, precision meets creativity. Our trained technicians will provide you with excellent outcomes.',
    colStart: 'md:col-start-2'
  }
]
</script>