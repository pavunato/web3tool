<template>
  <n-input v-if="packType === 'function'" v-model:value="fnName" type="text" placeholder="function name" style="margin-bottom: 12px" />
  <n-dynamic-input v-model:value="fnArgs" :on-create="onCreate">
    <template #default="{ value }">
      <div style="display: flex; align-items: center; width: 100%">
        <n-select
            v-model:value="value.type"
            filterable
            placeholder="Type"
            :options="typesToOptions"
            style="margin-right: 12px; width: 160px"
            :status="!value.type ? 'error' : 'success'"
        />
        <n-input
            v-model:value="value.value"
            type="text"
            :disabled="!value.type"
            placeholder="Value"
            :status="!checkArgValue(value.type, value.value) ? 'error' : 'success'"
        />
      </div>
    </template>
  </n-dynamic-input>
  <pre>{{ fnAbiString }}</pre>
  <div>
    <span style="text-decoration: underline blue">{{ first4bytes }}</span>
    {{packType === 'keccak' ? 'Message Hash: ': ''}}
    <span style="text-decoration: underline darkred">{{lastBytes}}</span>
  </div>
<!--  <div style="display: flex">-->
<!--    <n-popover trigger="manual" :show="true" v-if="first4bytes" width="trigger" :show-arrow="false">-->
<!--      <template #trigger>-->
<!--        <pre>{{first4bytes}}</pre>-->
<!--      </template>-->
<!--      <span>Function Selector</span>-->
<!--    </n-popover>-->
<!--    <n-popover trigger="manual" :show="true" v-if="lastBytes" width="trigger" :show-arrow="false">-->
<!--      <template #trigger>-->
<!--        <pre>{{lastBytes}}</pre>-->
<!--      </template>-->
<!--      <span>Arguments</span>-->
<!--    </n-popover>-->
<!--  </div>-->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {NDynamicInput, NCheckbox, NInputNumber, NInput, NSelect, NTooltip, NPopover} from 'naive-ui'
import { getFunctionSelector, encodePacked, keccak256, isAddress } from 'viem'
import * as _ from "lodash";

function isNumber(e:string) {
  const pattern = /^[0-9]*$/;
  return pattern.test(e)
}

function isByteString(e:string) {
  const pattern = /^(0x)?[A-Fa-f0-9]+$/;
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
  props: {
    packType: { type: String, default: 'function' }
  },
  methods: {
    checkArgValue(type:string, value:string) {
      if (!type || !value) {
        return false
      }
      if (typeof this.typesToOptionsWithCheck[type].checkFn === 'boolean') {
        return true
      }
      return eval(this.typesToOptionsWithCheck[type].checkFn)(value)
    }
  },
  computed: {
    isArgsTypeValid(): boolean {
      if (this.fnArgs.length === 0) {
        return false
      }
      for (const arg of this.fnArgs) {
        if (!arg.type) {
          return false
        }
      }
      return true
    },
    isArgsValid(): boolean {
      for (const arg of this.fnArgs) {
        if (!arg.type) {
          return false
        }
        if (!this.checkArgValue(arg.type, arg.value)) {
          return false
        }
      }
      return true
    },
    fnAbiString(): string {
      if (!this.fnName) {
        return ''
      }
      if (!this.isArgsTypeValid) {
        return `${this.fnName}()`
      }
      console.log('this.fnArgs', this.fnArgs.map((v) => v.type))
      return `${this.fnName}(${this.fnArgs.map((v) => v.type).join(',')})`
    },
    first4bytes(): string {
      if (!this.fnName) {
        return ''
      }
      return getFunctionSelector(this.fnAbiString)
    },
    lastBytes(): string {
      if (!this.isArgsValid) {
        this.$emit('packed', '')
        return ''
      }
      const packed = encodePacked(this.fnArgs.map((v) => v.type), this.fnArgs.map((v) => v.value))
      if (this.packType === 'keccak' && packed.length > 2) {
        const hashPacked = keccak256(packed)
        this.$emit('packed', hashPacked)
        return hashPacked
      }
      return packed.substring(2)
    },
    typesToOptions(): any[] {
      return this.argTypes.map((argType) => {
        return {
          label: argType.label,
          value: argType.value
        }
      })
    },
    typesToOptionsWithCheck(): any {
      return _.reduce(this.argTypes, function(result : any, item, key) {
        result[item.value] = _.omit(item, ['value', 'label']);
        return result;
      }, {});
    }
  },
  setup () {
    return {
      fnName: ref<string>(''),
      fnArgs: ref<argumentType[]>([]),
      argTypes: [
        {
          label: 'address',
          value: 'address',
          checkFn: 'isAddress',
        },
        {
          label: 'string',
          value: 'string',
          checkFn: true,
        },
        {
          label: 'bytes',
          value: 'bytes',
          checkFn: 'isByteString',
        },
        {
          label: "uint256",
          value: 'uint256',
          checkFn: 'isNumber',
        }
      ],
      onCreate () {
        return {
          string: '',
          selectedType: null,
        }
      }
    }
  }
})
</script>
