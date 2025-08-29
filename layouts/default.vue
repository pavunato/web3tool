<template>
  <n-page-header subtitle="Web3 Devkit for everyone">
    <AppMenuLayout>
      <slot/>
    </AppMenuLayout>
    <template #title>
      <a
          href="/"
          style="text-decoration: none; color: inherit"
      >
        Kit3.vercel.app
      </a>
    </template>
    <template #avatar>
      <!-- <n-avatar
          src="https://i.postimg.cc/QtH920mS/Web3-Utils-Logo-Texture-1.png"
      /> -->
    </template>
  </n-page-header>
</template>

<script lang="ts">
import {NPageHeader, NAvatar} from 'naive-ui'
import AppMenuLayout from "@/layouts/AppMenu.vue";

export default {
  components: {
    AppMenuLayout,
    NPageHeader, NAvatar
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
