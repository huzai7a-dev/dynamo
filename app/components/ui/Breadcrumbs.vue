<template>
    <nav v-if="breadcrumbs.length > 1" class="flex items-center text-sm text-gray-500 mb-6 bg-transparent"
        aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-2">
            <li class="inline-flex items-center" v-for="(crumb, index) in breadcrumbs" :key="crumb.path">

                <span v-if="index > 0" class="mx-1 text-gray-400">
                    <Icon name="ChevronRight" class="w-4 h-4" />
                </span>

                <template v-if="index < breadcrumbs.length - 1">
                    <NuxtLink :to="crumb.path"
                        class="inline-flex items-center font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                        <Icon v-if="index === 0" name="Home" class="w-4 h-4 mr-1.5" />
                        {{ crumb.label }}
                    </NuxtLink>
                </template>

                <!-- Current page -->
                <span v-else class="inline-flex items-center font-semibold text-gray-900 dark:text-gray-100">
                    <Icon v-if="index === 0" name="Home" class="w-4 h-4 mr-1.5" />
                    {{ crumb.label }}
                </span>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
    const path = route.path;
    const segments = path.split('/').filter(Boolean);

    const crumbs = [];

    // Always add Dashboard as the root if we are in portal pages
    crumbs.push({
        label: 'Dashboard',
        path: '/dashboard'
    });

    let currentPath = '';

    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        if (!segment) continue;

        // Skip 'dashboard' if it's already in the path to avoid duplicate root
        if (segment.toLowerCase() === 'dashboard' && i === 0) continue;

        currentPath += `/${segment}`;

        // Format the label
        let label = segment.charAt(0).toUpperCase() + segment.slice(1);

        // Replace hyphens with spaces
        label = label.replace(/-/g, ' ');

        // Handle numeric IDs or special cases
        if (!isNaN(Number(segment))) {
            label = `${segment}`;
        }

        // Skip unclickable functional segments entirely so they don't even appear in breadcrumbs
        const isFunctionalSegment = ['edit', 'edits', 'create', 'new', 'update'].includes(segment.toLowerCase());

        if (!isFunctionalSegment) {
            crumbs.push({
                label,
                path: currentPath
            });
        }
    }

    return crumbs;
});
</script>
