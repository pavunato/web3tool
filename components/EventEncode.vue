<template>
  <input v-model="eventString" type="text" placeholder="Event String"
         class="input input-bordered w-full mb-3"
         :class="!isEventStringValid ? 'input-error' : ''"
  />
  <pre>{{ keccak }}</pre>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
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
