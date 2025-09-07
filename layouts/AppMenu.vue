<template>
  <div class="flex gap-4">
    <aside :class="['transition-all', collapsed ? 'w-16' : 'w-64']" aria-label="Sidebar Navigation">
      <div class="mb-2 flex items-center justify-between">
<!--        <span v-if="!collapsed" class="font-semibold">Menu</span>-->
<!--        <button class="btn btn-square btn-ghost btn-xs" @click="collapsed = !collapsed">-->
<!--          <span v-if="collapsed">›</span>-->
<!--          <span v-else>‹</span>-->
<!--        </button>-->
      </div>
      <ul :class="['menu','bg-base-100','rounded-box','shadow','w-full', collapsed ? 'p-1' : 'p-2']">
        <li>
          <details :open="!collapsed">
            <summary class="menu-dropdown-toggle">
              <span class="inline-flex items-center gap-2">
                <span v-if="!collapsed">Pages</span>
              </span>
            </summary>
            <ul>
              <li>
                <RouterLink :to="{ name: 'index' }" :exact-active-class="'active'">
                  <span class="inline-flex items-center gap-2">
                    <span v-if="!collapsed">ABI Encoder</span>
                  </span>
                </RouterLink>
              </li>
              <li>
                <RouterLink :to="{ name: 'signature' }" :exact-active-class="'active'">
                  <span class="inline-flex items-center gap-2">
                    <span v-if="!collapsed">Sign thing</span>
                  </span>
                </RouterLink>
              </li>
              <li>
                <RouterLink :to="{ name: 'wallet' }" :exact-active-class="'active'">
                  <span class="inline-flex items-center gap-2">
                    <span v-if="!collapsed">Wallets</span>
                  </span>
                </RouterLink>
              </li>
              <li>
                <RouterLink :to="{ name: 'units' }" :exact-active-class="'active'">
                  <span class="inline-flex items-center gap-2">
                    <span v-if="!collapsed">Units</span>
                  </span>
                </RouterLink>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </aside>
    <main class="flex-1 min-w-0">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const collapsed = ref(false)
const route = useRoute()
function isActive(name: string) {
  return route.name === name
}
</script>
