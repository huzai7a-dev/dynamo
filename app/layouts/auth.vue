<template>
  <div class="h-screen w-full flex overflow-hidden bg-white">

    <!-- LEFT: Teal branding panel with rounded right edge -->
    <div class="hidden md:flex flex-col justify-center items-start text-white px-12 py-16 space-y-6 flex-shrink-0"
      style="width: 42%; background-color: #077270; border-radius: 0 40% 40% 0 / 0 50% 50% 0;">
      <!-- Brand name -->
      <div class="space-y-1">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Platform</p>
        <h1 class="text-4xl font-extrabold leading-tight tracking-tight">Dynamo<br />Stitches</h1>
      </div>

      <!-- Tagline -->
      <p class="text-white/75 text-sm leading-relaxed max-w-[260px]">
        Streamline your orders, quotes, and client management — all in one place.
      </p>

      <!-- Version badge -->
      <div class="border border-white/30 rounded-lg px-4 py-2 text-xs text-white/70 backdrop-blur-sm">
        Login &bull; Secure &bull; Trusted
      </div>
    </div>

    <!-- RIGHT: Scrollable form panel -->
    <div class="flex-1 overflow-auto flex items-center justify-center px-6 py-12">
      <div class="w-full">
        <slot />
      </div>
    </div>

  </div>
</template>