<template>
  <n-input v-model:value="eventString" type="text" placeholder="Event String" style="margin-bottom: 12px"
           :status="!isEventStringValid ? 'error' : ''"
  />
  <pre>{{ keccak }}</pre>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {NDynamicInput, NCheckbox, NInputNumber, NInput, NSelect, NTooltip, NPopover} from 'naive-ui'
import { getEventSelector } from 'viem'
import * as _ from "lodash";

const argsValid = ["address", "string", "uint256", "uint128"]

function isNumber(e:string) {
  const pattern = /^[0-9]$/;
  return pattern.test(e)
}

type argumentType = {
  type: string,
  value: string
}

export default defineComponent({
  components: {
    NDynamicInput, NCheckbox, NInputNumber, NInput, NSelect, NTooltip, NPopover
  },
  methods: {
  },
  computed: {
    isEventStringValid() {
      if (!this.eventString) {
        return false
      }
      const pattern = /\S+\((\S+,?)+\)/;
      const matches = pattern.exec(this.eventString)

      if (!matches || matches.length !== 2) {
        return false
      }
      console.log('matches', matches)
      for (const x of matches[1].toString().split(',')) {
        if (!argsValid.includes(x)) {
          return false
        }
      }
      return true
    },
    keccak() {
      if (!this.isEventStringValid) {
        return ''
      }
      return getEventSelector(this.eventString)
    }
  },
  setup () {
    return {
      eventString: ref<string>(''),
    }
  }
})
</script>
