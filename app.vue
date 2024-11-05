<template>
  <div class="proMain">
    <ClientOnly>
      <NuxtLayout>
        <n-config-provider :hljs="hljs">
          <n-notification-provider>
            <NuxtPage />
          </n-notification-provider>
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
import { NConfigProvider, NNotificationProvider } from 'naive-ui'
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
