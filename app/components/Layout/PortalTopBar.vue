<template>
  <div
    class="bg-primary h-24 w-full flex justify-between items-center px-6 text-white border border-white"
  >
    <h2 class="text-lg font-bold">{{ activeRouteName }}</h2>

    <div class="relative">
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="flex justify-between items-center gap-2 cursor-pointer hover:bg-primary-dark/50 p-2"
      >
        <NuxtImg
          src="/images/user.png"
          alt="Logo"
          class="w-10 h-10 rounded-full border-2 border-white object-cover"
        />
        <p>{{ (user as IUser).fullName }}</p>
        <Icon name="ChevronDown" />
      </button>
      <!--drop down menu start-->
      <div
        v-if="isMenuOpen"
        class="absolute top-full right-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-gray-800"
      >
        <ul>
          <li>
            <NuxtLink
              to="/profile"
              class="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-200"
            >
              <Icon name="User" class="mr-3 h-5 w-5" />
              <span>Profile</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/settings"
              class="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-200"
            >
              <Icon name="Settings" class="mr-3 h-5 w-5" />
              <span>Settings</span>
            </NuxtLink>
          </li>
          <li>
            <hr class="my-1 border-gray-200" />
          </li>
          <li>
            <button
              class="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-200"
            >
              <Icon color="red" name="Logout" class="mr-3 h-5 w-5" />
              <span class="text-red-500">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IUser } from "~~/shared/types";


const { user } = useUserSession();
const route = useRoute();

const isMenuOpen = ref(false);

const activeRouteName = computed(() => {
  return route.name?.toString().toUpperCase();
});

</script>
