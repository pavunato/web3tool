<template>
  <n-card title="Wallets" style="margin-bottom: 16px">
    <n-card :bordered="false">
      <n-input v-model:value="mnemonic" type="text" placeholder="Input Seed phrase"
      >
        <template #prefix>
          <b>Seed Phrase:</b>
        </template>
      </n-input>
      <br/>
      <n-input-number :style="{ width: '33%' }" v-model:value="walletQuantity">
        <template #prefix>
          <b>Wallet Quantity:</b>
        </template>
      </n-input-number>
    </n-card>

    <n-card justify="space-between">
      <n-collapse>
        <n-collapse-item v-for="wallet in []" :title="`${wallet.address}`">
          <div>Address:
            <n-text code>
              {{wallet.address}}
            </n-text>
          </div>
          <div>Address Index: {{wallet.index}}</div>
          <div>Private Key:
            <n-text code>
              {{wallet.pk.replace('0x', '')}}
            </n-text>
          </div>
          <div>Private Key With 0x:
            <n-text code>
              {{wallet.pk}}
            </n-text>
          </div>
        </n-collapse-item>
      </n-collapse>
    </n-card>
  </n-card>
</template>

<script setup lang="ts">
  import {mnemonicNew} from "@ton/crypto/dist/mnemonic/mnemonic";

  const walletQuantity = useState('walletQuantity', () => 15)
  const mnemonic = useState('mnemonic', () => [''])

  onMounted(async () => {
    mnemonic.value =  await mnemonicNew(24)
  })

  // const wallets = computed(() => {
  //   let accounts = []
  //   for (let i = 0; i < walletQuantity.value; i ++ )  {
  //     const w = mnemonicToAccount(mnemonic.value, {addressIndex: i})
  //     accounts.push({address: w.address, pk: bytesToHex(w.getHdKey().privateKey), index: i})
  //   }
  //   return accounts
  // })
</script>

<style scoped>

</style>
