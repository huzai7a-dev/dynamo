<template>
  <div
    class="h-screen w-full flex bg-gray-100 dark:bg-gray-900 overflow-hidden"
  >
    <LayoutPortalSideNav />

    <div class="flex-1 overflow-auto">
        <LayoutPortalTopBar/>
      <div class="min-h-full px-6 sm:px-8 md:px-10 py-10">
        <div class="w-full max-w-6xl">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
