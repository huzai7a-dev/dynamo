<template>
    <div class="h-screen w-full flex bg-solid-light overflow-hidden">
      
      <!-- LEFT: Fixed, Non-scrollable Branding Panel -->
      <div class="w-[420px] bg-primary text-white flex flex-col items-center justify-center p-10 space-y-4">
        <h2 class="text-2xl font-bold">Welcome to Dynamo Stitches</h2>
        <p class="text-white/80 text-center text-sm">
          Sign in or create an account to get started.
        </p>
        <img src="/login.svg" alt="Illustration" class="w-40" />
      </div>
  
      <!-- RIGHT: Scrollable Slot Panel -->
      <div class="flex-1 overflow-auto">
        <div class="min-h-full flex items-center justify-center px-6 py-10">
          <div class="w-full max-w-4xl">
            <slot />
          </div>
        </div>
      </div>
  
    </div>
  </template>
  