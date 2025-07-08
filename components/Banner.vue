<template>
    <section class="relative h-[50vh] bg-cover bg-center flex items-center justify-center" :style="{ backgroundImage: `url(${backgroundImage})` }">
        <div class="absolute inset-0 bg-gradient-to-b from-black/80 to-black/50"></div>
        <div class="relative z-10 text-center text-white px-8 md-py-0 pt-12">
            <h1 class="text-3xl md:text-5xl font-bold mb-4">{{ title }}</h1>
            <p class="text-lg md:text-xl max-w-2xl mx-auto">{{ description }}</p>
        </div>
    </section>
</template>

<script setup>
defineProps({
    backgroundImage: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})
</script>