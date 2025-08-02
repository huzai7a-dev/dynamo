<template>
  <div class="w-[300px] bg-primary text-white flex flex-col h-full">
    <div class="p-6">
      <UiLogo class="text-xl" />
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center px-4 py-3 rounded-lg transition-colors duration-200"
        :class="
          isActive(item.path)
            ? 'bg-primary-dark/70 font-display'
            : 'hover:bg-primary-dark/40'
        "
      >
        <Icon :name="item.icon" class="w-6 h-6 mr-3 flex-shrink-0" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "ChartNoAxesCombined" },
  { label: "Orders", path: "/orders", icon: "ShoppingCart" },
  { label: "Invoice", path: "/invoices", icon: "ReceiptText" },
];

const isActive = (path: string) => {
  return router.currentRoute.value.path === path;
};
</script>
