<template>
  <n-card title="ABI Encoder" style="margin-bottom: 16px">
    <n-tabs type="line" animated>
      <n-tab-pane name="function" tab="Function">
        <ManualABI />
      </n-tab-pane>
      <n-tab-pane name="event" tab="Event">
        <EventEncode />
      </n-tab-pane>
      <n-tab-pane name="parse" tab="Parse ABI">
        Hey Jude
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<style scoped>
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
</style>
<script>
import {
  NCard, NTabs, NTabPane, NForm, NFormItemRow, NInput, NButton,
    NDynamicInput, NCheckbox, NInputNumber, NSpace

} from 'naive-ui'
export default {
  name: "index",
  components: {
    NCard, NTabs, NTabPane, NForm, NFormItemRow, NInput, NButton, NDynamicInput, NCheckbox, NInputNumber, NSpace
  },
  data() {
    return {
      customValue: ref([
        {
          isCheck: true,
          num: 1,
          string: 'A String'
        }
      ]),
      onCreate () {
        return {
          isCheck: false,
          num: 1,
          string: 'A String'
        }
      }
    }
  }
}
</script>
