<template>
  <div class="proMain">
    <ClientOnly>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </ClientOnly>
  </div>
</template>

<style scoped>
  .proMain{ padding: 24px; }
</style>
<script>
export default defineComponent({
  setup() {
    return {}
  }
})
</script>
