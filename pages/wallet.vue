<template>
  <div class="card bg-base-100 shadow mb-4">
    <div class="card-body">
      <h2 class="card-title">Wallets</h2>

      <label class="form-control">
        <div class="label"><span class="label-text font-semibold">Seed Phrase</span></div>
        <div class="join w-full">
          <input v-model="seedphrase" type="text" placeholder="Input Seed phrase" class="input input-bordered join-item w-full"
                 :class="!isValidSeedPhrase ? 'input-error' : ''" />
          <button class="btn join-item"
                  @click="copyToClipboard(seedphrase, 'seedphrase')"
                  :class="{ 'btn-active': clickedButtons.seedphrase }">
            {{ clickedButtons.seedphrase ? 'Copied' : 'Copy' }}
          </button>
        </div>
      </label>

      <div class="mt-4 space-y-2">
        <div v-for="wallet in wallets" :key="wallet.index" class="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div class="collapse-title text-sm sm:text-base font-medium flex items-center gap-2">
            <span class="truncate">{{ wallet.address }}</span>
          </div>
          <div class="collapse-content">
            <div class="flex items-center gap-2">
              <span>Address:</span>
              <code class="bg-base-300 px-2 py-1 rounded break-all">{{ wallet.address }}</code>
              <button class="btn btn-ghost btn-xs"
                      @click.stop="copyToClipboard(wallet.address, `address-${wallet.index}`)"
                      :class="{ 'btn-active': clickedButtons[`address-${wallet.index}`] }">
                {{ clickedButtons[`address-${wallet.index}`] ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <span>Private Key:</span>
              <code class="bg-base-300 px-2 py-1 rounded break-all">{{ wallet.pk.replace('0x', '') }}</code>
              <button class="btn btn-ghost btn-xs"
                      @click="copyToClipboard(wallet.pk.replace('0x', ''), `pk-${wallet.index}`)"
                      :class="{ 'btn-active': clickedButtons[`pk-${wallet.index}`] }">
                {{ clickedButtons[`pk-${wallet.index}`] ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <span>Private Key With 0x:</span>
              <code class="bg-base-300 px-2 py-1 rounded break-all">{{ wallet.pk }}</code>
              <button class="btn btn-ghost btn-xs"
                      @click="copyToClipboard(wallet.pk, `pk-0x-${wallet.index}`)"
                      :class="{ 'btn-active': clickedButtons[`pk-0x-${wallet.index}`] }">
                {{ clickedButtons[`pk-0x-${wallet.index}`] ? 'Copied' : 'Copy' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}

.copy-button-inverted {
  filter: invert(1);
  transition: filter 0.1s ease-in-out;
}
</style>
<script setup lang="ts">
import { ref } from 'vue'

import { generatePrivateKey, privateKeyToAccount, mnemonicToAccount, generateMnemonic, english } from 'viem/accounts'
import { bytesToHex, createWalletClient, hexToString, http, toBytes } from 'viem'
import { mainnet } from 'viem/chains'

const client = createWalletClient({
  chain: mainnet,
  transport: http(),
})

const mnemonic = () => generateMnemonic(english)

const seedphrase = useState('seedphrase', mnemonic)
const clickedButtons = ref<Record<string, boolean>>({})

const randomAddress = computed(() => {
  if (seedphrase.value === '0x') {
    return ''
  }
  try {
    return mnemonicToAccount(seedphrase.value).address
  } catch (e) {
    console.log(e)
    return 'error address'
  }
})

const isValidSeedPhrase = computed(() => {
  return !randomAddress.value.includes('error')
})

const wallets = computed(() => {
  let accounts = []
  for (let i = 0; i < 15; i++) {
    const w = mnemonicToAccount(seedphrase.value, { addressIndex: i })
    accounts.push({ address: w.address, pk: bytesToHex(w.getHdKey().privateKey), index: i })
  }
  return accounts
})

const copyToClipboard = async (text: string, buttonId: string) => {
  try {
    await navigator.clipboard.writeText(text)

    // Trigger the inversion effect
    clickedButtons.value[buttonId] = true

    // Reset the effect after ~1.2 seconds
    setTimeout(() => {
      clickedButtons.value[buttonId] = false
    }, 1200)

  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>
