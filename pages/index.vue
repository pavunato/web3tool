<template>
  <div class="card bg-base-100 shadow mb-4">
    <div class="card-body">
      <h2 class="card-title">ABI Encoder</h2>
      <div role="tablist" class="tabs tabs-bordered">
        <a role="tab" :class="['tab', activeTab==='function' && 'tab-active']" @click="activeTab='function'">Function</a>
        <a role="tab" :class="['tab', activeTab==='event' && 'tab-active']" @click="activeTab='event'">Event</a>
        <a role="tab" :class="['tab', activeTab==='parse' && 'tab-active']" @click="activeTab='parse'">Parse ABI</a>
      </div>
      <div class="mt-4">
        <div v-if="activeTab==='function'">
          <ManualABI />
        </div>
        <div v-else-if="activeTab==='event'">
          <EventEncode />
        </div>
        <div v-else>
          Hey Jude
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
</style>
<script setup>
import { ref } from 'vue'
import ManualABI from '@/components/ManualABI.vue'
import EventEncode from '@/components/EventEncode.vue'

const activeTab = ref('function')
</script>
