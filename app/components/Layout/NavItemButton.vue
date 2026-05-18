<template>
  <!-- Grouped nav item with dropdown -->
  <div v-if="props.children && props.children.length > 0" class="relative">
    <!-- Parent trigger button -->
    <button
      :class="[
        'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group',
        props.extraClasses,
        isChildActive
          ? 'bg-white/20 text-white shadow-sm'
          : 'text-white/80 hover:bg-white/10 hover:text-white',
      ]"
      @click="toggleOpen"
    >
      <div class="flex items-center">
        <Icon
          :name="props.icon"
          :class="[
            'w-5 h-5 mr-3 flex-shrink-0',
            isChildActive ? 'text-white' : 'text-white/70 group-hover:text-white',
          ]"
        />
        <span :class="['text-sm', isChildActive ? 'font-medium' : 'font-normal']">
          {{ props.label }}
        </span>
      </div>
      <Icon
        name="ChevronDown"
        :class="[
          'w-4 h-4 flex-shrink-0 transition-transform duration-200',
          isOpen ? 'rotate-180' : '',
          isChildActive ? 'text-white' : 'text-white/50 group-hover:text-white/80',
        ]"
      />
    </button>

    <!-- Children dropdown -->
    <Transition name="dropdown">
      <ul v-if="isOpen" class="mt-1 ml-4 space-y-1 border-l border-white/10 pl-3">
        <li v-for="child in props.children" :key="child.href">
          <NuxtLink
            :to="child.href"
            :class="[
              'flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-150 group',
              isExactActive(child.href)
                ? 'bg-white/20 text-white font-medium shadow-sm'
                : 'text-white/70 hover:bg-white/10 hover:text-white',
            ]"
          >
            <Icon
              :name="child.icon"
              :class="[
                'w-4 h-4 mr-2.5 flex-shrink-0',
                isExactActive(child.href) ? 'text-white' : 'text-white/50 group-hover:text-white',
              ]"
            />
            {{ child.label }}
          </NuxtLink>
        </li>
      </ul>
    </Transition>
  </div>

  <!-- Simple nav item (original behavior) -->
  <NuxtLink
    v-else
    :to="props.to"
    :class="[
      'flex items-center px-4 py-3 rounded-lg transition-all duration-200 group',
      props.extraClasses,
      props.active
        ? 'bg-white/20 text-white shadow-sm'
        : 'text-white/80 hover:bg-white/10 hover:text-white',
    ]"
  >
    <Icon
      :name="props.icon"
      :class="[
        'w-5 h-5 mr-3 flex-shrink-0',
        props.active ? 'text-white' : 'text-white/70 group-hover:text-white',
      ]"
    />
    <span :class="['text-sm', props.active ? 'font-medium' : 'font-normal']">
      {{ props.label }}
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

interface NavChild {
  label: string;
  href: string;
  icon: string;
}

interface Props {
  to?: string;
  icon: string;
  label: string;
  active?: boolean;
  extraClasses?: string;
  children?: NavChild[];
}

const props = withDefaults(defineProps<Props>(), {
  to: '/',
  active: false,
  extraClasses: '',
  children: undefined,
});

const router = useRouter();
const isOpen = ref(false);

// Auto-open if a child route is currently active
const isChildActive = computed(() => {
  if (!props.children) return false;
  return props.children.some(child =>
    router.currentRoute.value.path.startsWith(child.href)
  );
});

// Initialize open state based on active child
if (isChildActive.value) {
  isOpen.value = true;
}

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};

const isExactActive = (path: string) => {
  return router.currentRoute.value.path === path;
};
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  max-height: 200px;
}
</style>
