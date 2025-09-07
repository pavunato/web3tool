<template>
  <div>
    <div class="navbar bg-base-100 shadow mb-4">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl" href="/">Kit3.vercel.app</a>
        <span class="ml-2 opacity-60">Web3 Devkit for everyone</span>
      </div>
    </div>
    <AppMenuLayout>
      <slot />
    </AppMenuLayout>
  </div>
</template>

<script lang="ts">
import AppMenuLayout from "@/layouts/AppMenu.vue";

export default {
  components: {
    AppMenuLayout
  },
  data() {
    return {
      options: [
        {
          label: 'More episodes',
          key: '1'
        },
        {
          label: 'More episodes',
          key: '2'
        },
        {
          label: 'More episodes',
          key: '3'
        }
      ]
    }
  }
}
</script>

<style scoped>
body {
  padding: 24px;
}
</style>
