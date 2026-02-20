<template>
  <div class="w-[300px] bg-primary border-r border-primary-dark flex flex-col h-full">
    <!-- Header with logo -->
    <div class="py-3 px-6 border-b border-primary-dark/30 bg-primary-dark/20">
      <UiLogo class="text-xl text-white" />
    </div>

    <!-- Navigation -->
    <nav v-if="navItems.length" class="flex-1 px-4 py-6 overflow-y-auto">
      <ul class="space-y-2">
        <li v-for="item in navItems" :key="item?.href">
          <NuxtLink v-if="item" :to="item.href" :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200 group',
            isActive(item.href)
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          ]">
            <Icon :name="item.icon" :class="[
              'w-5 h-5 mr-3 flex-shrink-0',
              isActive(item.href)
                ? 'text-white'
                : 'text-white/70 group-hover:text-white'
            ]" />
            <span :class="['text-sm', isActive(item.href) ? 'font-medium' : 'font-normal']">
              {{ item.title }}
            </span>

          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ROLE } from '~~/shared/constants';

const router = useRouter();
const { user } = useUserSession();

// Navigation items with badges
const navItems = getNavItems(user.value?.role as ROLE);

const isActive = (path: string) => {
  return router.currentRoute.value.path === path;
};
</script>
