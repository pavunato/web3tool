<template>
  <n-card title="Sign Thing" style="margin-bottom: 16px">
    <div>Address     : {{randomAddress}}</div>
    <div>Private Key : <span style="color: darkred; font-style: italic">{{privateKey}}</span></div>
    <n-tabs type="line" animated>
      <n-tab-pane name="manual" tab="Message">
        <n-input v-model:value="messageInput" type="text" placeholder="Message to sign" />
        <pre>{{messageSignature()}}</pre>
      </n-tab-pane>
      <n-tab-pane name="parse" tab="Typed Data">
        Sign Typed Data
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<style scoped>
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
</style>
<script lang="ts">
import {
  NCard, NTabs, NTabPane, NForm, NFormItemRow, NInput, NButton,
  NDynamicInput, NCheckbox, NInputNumber, NSpace

} from 'naive-ui'
import { defineComponent, ref } from 'vue'

import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import {createWalletClient, http} from 'viem'
import { mainnet } from 'viem/chains'


const client = createWalletClient({
  chain: mainnet,
  transport: http(),
})
export default defineComponent({
  name: "signature",
  components: {
    NCard, NTabs, NTabPane, NForm, NFormItemRow, NInput, NButton, NDynamicInput, NCheckbox, NInputNumber, NSpace
  },
  methods: {
    async messageSignature(): Promise<string> {
      if (!this.privateKey) {
        return ''
      }
      if (this.messageInput === '') {
        return ''
      }
      console.log('message', this.messageInput)
      return (await privateKeyToAccount(this.privateKey).signMessage({message: this.messageInput}))
    }
  },
  computed: {
    randomAddress(): string {
      if (this.privateKey === '0x') {
        return ''
      }
      return privateKeyToAccount(this.privateKey).address
    }
  },
  mounted() {
    this.privateKey = generatePrivateKey()
  },
  setup () {
    return {
      messageInput: ref<string>(''),
      privateKey: ref<`0x${string}`>('0x'),
    }
  }
})
</script>
