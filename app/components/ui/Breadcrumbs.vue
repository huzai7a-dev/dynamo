<template>
  <nav
    v-if="breadcrumbs.length > 1"
    class="flex items-center text-sm text-gray-500 mb-6 bg-transparent"
    aria-label="Breadcrumb"
  >
    <ol class="inline-flex items-center space-x-1 md:space-x-2">
      <li
        class="inline-flex items-center"
        v-for="(crumb, index) in breadcrumbs"
        :key="crumb.path"
      >
        <span v-if="index > 0" class="mx-1 text-gray-400">
          <Icon name="ChevronRight" class="w-4 h-4" />
        </span>

        <template v-if="index < breadcrumbs.length - 1">
          <NuxtLink
            :to="crumb.path"
            class="inline-flex items-center font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <Icon v-if="index === 0" name="Home" class="w-4 h-4 mr-1.5" />
            {{ crumb.label }}
          </NuxtLink>
        </template>

        <!-- Current page -->
        <span
          v-else
          class="inline-flex items-center font-semibold text-gray-900 dark:text-gray-100"
        >
          <Icon v-if="index === 0" name="Home" class="w-4 h-4 mr-1.5" />
          {{
            isCreateQuoteRoute
              ? quoteCrumbs[route.query.type as keyof typeof quoteCrumbs]
              : crumb.label
          }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const FUNCTIONAL_SEGMENTS = ["edit", "edits", "create", "new", "update"];

const isCreateQuoteRoute = computed(() => {
  const segments = route.path.split("/").filter(Boolean);
  return (
    segments.length >= 2 &&
    segments[0]!.toLowerCase() === "quotes" &&
    ["create", "new"].includes(segments[1]!.toLowerCase())
  );
});
const quoteCrumbs = {
  order: "Digitizing Quote",
  vector: "Vector Quote",
};

function formatSegmentLabel(segment: string): string {
  // Numeric IDs are shown as-is
  if (!isNaN(Number(segment))) return segment;

  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

const breadcrumbs = computed(() => {
  const segments = route.path.split("/").filter(Boolean);

  const crumbs = [{ label: "Dashboard", path: "/dashboard" }];

  // On the dashboard itself there's nothing else to add
  if (
    segments.length === 0 ||
    (segments.length === 1 && segments[0]!.toLowerCase() === "dashboard")
  ) {
    return crumbs;
  }

  // Ancestor crumbs: every segment except the current page, derived from the URL as before
  const ancestorSegments = segments.slice(0, -1);
  let currentPath = "";
  for (const segment of ancestorSegments) {
    currentPath += `/${segment}`;

    // Skip unclickable functional segments entirely so they don't even appear in breadcrumbs
    if (FUNCTIONAL_SEGMENTS.includes(segment.toLowerCase())) continue;

    crumbs.push({
      label: formatSegmentLabel(segment),
      path: currentPath,
    });
  }

  // Current page crumb: use the page's own title (definePageMeta name) when available
  const lastSegment = segments[segments.length - 1]!;
  const pageName = route.name ? String(route.name) : null;

  crumbs.push({
    label: pageName || formatSegmentLabel(lastSegment),
    path: route.path,
  });

  return crumbs;
});
</script>
