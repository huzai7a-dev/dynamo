<template>
  <div class="p-6 space-y-6">
    <component :is="dashboard[user?.role as ROLE]" />
  </div>
</template>

<script setup lang="ts">
import Admin from '~/components/dashboards/Admin.vue';
import Client from '~/components/dashboards/Client.vue';
import { ROLE } from '~~/shared/constants';

const { user } = useUserSession();
const dashboard = {
  [ROLE.User]: Client,
  [ROLE.Admin]: Admin,
}

definePageMeta({
  layout: "portal",
  middleware: ["auth"],
});
</script>
