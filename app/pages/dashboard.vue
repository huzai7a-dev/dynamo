<template>
  <div class="p-6 space-y-6">
    <component :is="dashboard[(user as any)?.role as ROLE]" />
  </div>
</template>

<script setup lang="ts">
import Admin from '~/components/dashboards/Admin.vue';
import Client from '~/components/dashboards/Client.vue';
import Salesman from '~/components/dashboards/Salesman.vue';
import { ROLE } from '~~/shared/constants';

const { user } = useUserSession();
const dashboard = {
  [ROLE.User]: Client,
  [ROLE.Admin]: Admin,
  [ROLE.Salesman]: Salesman,
}

definePageMeta({
  layout: "portal",
  // middleware: ["auth"],
});
</script>
