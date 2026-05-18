<template>
  <div
    class="w-[300px] bg-primary border-r border-primary-dark flex flex-col h-full"
  >
    <!-- Header with logo -->
    <div class="py-3 px-6 border-b border-primary-dark/30 bg-primary-dark/20">
      <UiLogo class="text-xl text-white" />
    </div>

    <!-- Navigation -->
    <nav v-if="navItems.length" class="flex-1 px-4 py-6 overflow-y-auto">
      <NavItemButton
        to="/dashboard"
        icon="LayoutDashboard"
        label="Dashboard"
        :active="isActive('/dashboard')"
        extra-classes="mb-4"
      />

      <p
        class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2"
      >
        Actions
      </p>

      <ul class="space-y-2">
        <li v-for="item in CREATE_NAV_ITEMS" :key="item?.href">
          <NavItemButton
            v-if="item"
            :to="item.href"
            :icon="item.icon"
            :label="item.title"
            :active="isActive(item.href)"
          />
        </li>
      </ul>

      <p
        class="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 mt-4"
      >
        Records
      </p>

      <ul class="space-y-2">
        <li v-for="item in navItems" :key="item?.href">
          <NavItemButton
            v-if="item"
            :to="item.href"
            :icon="item.icon"
            :label="item.title"
            :active="isActive(item.href)"
            :children="item.children?.map(c => ({ label: c.title, href: c.href, icon: c.icon }))"
          />
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ROLE } from "~~/shared/constants";
import NavItemButton from "./NavItemButton.vue";

const router = useRouter();
const { user } = useUserSession();

// Navigation items with badges
const navItems = getNavItems(user.value?.role as ROLE);

const isActive = (path: string) => {
  return router.currentRoute.value.path === path;
};
</script>
