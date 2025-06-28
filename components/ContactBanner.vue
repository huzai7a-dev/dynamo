<template>
  <div class="bg-secondary mt-12">
    <div
      class="relative bg-contact-banner bg-cover bg-center text-white"
    >
      <div class="absolute inset-0 bg-primary opacity-90" />
      <div
        class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div class="flex flex-col items-center justify-between lg:flex-row">
          <div class="text-center lg:text-left">
            <p class="font-display text-lg">Any Queries?</p>
            <h2 class="mt-2 font-display text-4xl font-bold sm:text-5xl">
              We're ready to collaborate with you!
            </h2>
          </div>
          <div class="mt-10 flex shrink-0 flex-col items-center gap-y-8 sm:flex-row sm:gap-x-8 lg:mt-0">
            <NuxtLink
              to="/contact"
              class="flex items-center justify-center rounded-md bg-secondary px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              Contact Us
                <LucideArrowRight/>
            </NuxtLink>
            <div class="flex items-center">
              <div
                class="flex h-14 w-14 items-center justify-center rounded-full bg-white"
              >
                <LucidePhoneCall class="text-primary"/>
              </div>
              <div class="ml-4">
                <p class="font-display text-sm">Hotline</p>
                <p class="font-display text-xl font-bold">
                  +1 469-250-5833
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>