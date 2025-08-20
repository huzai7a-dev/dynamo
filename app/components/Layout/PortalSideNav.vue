<template>
  <div class="w-[300px] bg-primary border-r border-primary-dark flex flex-col h-full">
    <!-- Header with logo -->
    <div class="py-3 px-6 border-b border-primary-dark/30 bg-primary-dark/20">
      <UiLogo class="text-xl text-white" />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 overflow-y-auto">
      <ul class="space-y-2">
        <li v-for="item in navItems" :key="item.path">
          <NuxtLink
            :to="item.path"
            :class="[
              'flex items-center px-4 py-3 rounded-lg transition-all duration-200 group',
              isActive(item.path)
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            ]"
          >
            <Icon
              :name="item.icon"
              :class="[
                'w-5 h-5 mr-3 flex-shrink-0',
                isActive(item.path)
                  ? 'text-white'
                  : 'text-white/70 group-hover:text-white'
              ]"
            />
            <span :class="['text-sm', isActive(item.path) ? 'font-medium' : 'font-normal']">
              {{ item.label }}
            </span>
            <span 
              v-if="item.badge"
              :class="[
                'ml-auto px-2 py-0.5 text-xs font-medium rounded-full',
                isActive(item.path)
                  ? 'bg-white/30 text-white'
                  : 'bg-white/20 text-white/90'
              ]"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

// Navigation items with badges
const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "ChartNoAxesCombined" },
  { label: "Orders", path: "/orders", icon: "ShoppingCart", badge: "5" },
  { label: "Invoices", path: "/invoices", icon: "ReceiptText" },
];

const isActive = (path: string) => {
  return router.currentRoute.value.path === path;
};
</script>
