<template>
  <div class="proMain">
    <ClientOnly>
      <NuxtLayout>
        <n-config-provider :hljs="hljs">
          <NuxtPage />
        </n-config-provider>
      </NuxtLayout>
    </ClientOnly>
  </div>
</template>

<style scoped>
  .proMain{
    padding: 24px;
  }
</style>
<script>
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import cpp from 'highlight.js/lib/languages/cpp'
import golang from 'highlight.js/lib/languages/go'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('golang', golang)

export default defineComponent({
  setup() {
    return {
      hljs
    }
  }
})
</script>
