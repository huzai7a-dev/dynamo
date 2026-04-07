<template>
  <div class="h-screen w-full flex overflow-hidden" style="background: linear-gradient(135deg, #f0f9f9 0%, #e8f5f5 50%, #f5fafa 100%)">
    <LayoutPortalSideNav />

    <div class="flex-1 flex flex-col">
      <LayoutPortalTopBar class="flex-shrink-0" />
      <div class="flex-1 overflow-auto px-6 sm:px-8 md:px-10 py-10">
        <div class="w-full">
          <UiBreadcrumbs />
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
