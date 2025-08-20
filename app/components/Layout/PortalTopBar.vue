<template>
  <div
    class="bg-gradient-to-r from-primary to-primary-dark h-20 w-full flex justify-between items-center px-6 text-white shadow-lg border-b border-white/20"
  >
    <h2 class="text-xl font-bold tracking-wide">{{ activeRouteName }}</h2>

    <div class="relative" ref="menuContainer">
      <button
        @click="toggleMenu"
        class="flex justify-between items-center gap-3 cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-all duration-200 ease-in-out group"
        :class="{ 'bg-white/10': isMenuOpen }"
      >
        <NuxtImg
          src="/images/user.png"
          alt="User Avatar"
          class="w-10 h-10 rounded-full border-2 border-white/80 object-cover shadow-md group-hover:border-white transition-colors duration-200"
        />
        <p class="font-medium text-sm">{{ (user as IUser).fullName }}</p>
        <Icon 
          name="ChevronDown" 
          class="transition-transform duration-200 ease-in-out"
          :class="{ 'rotate-180': isMenuOpen }"
        />
      </button>
      
      <!-- Dropdown menu with improved styling -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-2"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-2"
      >
        <div
          v-if="isMenuOpen"
          class="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 text-gray-800 border border-gray-100"
        >
          <!-- User info section -->
          <div class="px-4 py-3 border-b border-gray-100">
            <p class="text-sm font-medium text-gray-900">{{ (user as IUser).fullName }}</p>
            <p class="text-xs text-gray-500">{{ (user as IUser).email }}</p>
          </div>
          
          <ul class="py-1">
            <li>
              <NuxtLink
                to="/profile"
                class="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-150 group"
                @click="closeMenu"
              >
                <Icon name="User" class="mr-3 h-5 w-5 text-gray-600 group-hover:text-primary" />
                <span class="text-gray-700 group-hover:text-gray-900">Profile</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/settings"
                class="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-150 group"
                @click="closeMenu"
              >
                <Icon name="Settings" class="mr-3 h-5 w-5 text-gray-600 group-hover:text-primary" />
                <span class="text-gray-700 group-hover:text-gray-900">Settings</span>
              </NuxtLink>
            </li>
            <li>
              <hr class="my-2 border-gray-100" />
            </li>
            <li>
              <button
                class="w-full text-left flex items-center px-4 py-3 text-sm hover:bg-red-50 transition-colors duration-150 group"
                @click="handleLogOut"
              >
                <Icon name="Logout" class="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
                <span class="text-red-500 group-hover:text-red-600 font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IUser } from "~~/shared/types";

const { user, clear: logout } = useUserSession();
const route = useRoute();
const router = useRouter();

const isMenuOpen = ref(false);
const menuContainer = ref<HTMLElement>();

const activeRouteName = computed(() => {
  return route.name?.toString().toUpperCase();
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleLogOut = async () => {
  await logout();
  router.push("/login");
};

// Click outside functionality
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    if (menuContainer.value && !menuContainer.value.contains(event.target as Node)) {
      closeMenu();
    }
  };

  document.addEventListener('click', handleClickOutside);

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});
</script>
