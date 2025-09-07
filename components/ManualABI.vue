<template>
  <input v-if="packType === 'function'" v-model="fnName" type="text" placeholder="function name"
         class="input input-bordered w-full mb-3" />
  <div class="space-y-2">
    <div v-for="(value, idx) in fnArgs" :key="idx" class="flex items-center w-full gap-2">
      <select v-model="value.type" class="select select-bordered w-40"
              :class="!value.type ? 'select-error' : ''">
        <option disabled value="">Type</option>
        <option v-for="opt in typesToOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <input v-model="value.value" type="text" placeholder="Value" :disabled="!value.type"
             class="input input-bordered flex-1"
             :class="!checkArgValue(value.type, value.value) ? 'input-error' : ''" />
      <button class="btn btn-ghost btn-square" @click="removeArg(idx)">✕</button>
    </div>
    <button class="btn btn-sm" @click="addArg">+ Add arg</button>
  </div>
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
  props: {
    packType: { type: String, default: 'function' }
  },
  methods: {
    addArg() {
      this.fnArgs.push({ type: '', value: '' })
    },
    removeArg(index: number) {
      this.fnArgs.splice(index, 1)
    },
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
