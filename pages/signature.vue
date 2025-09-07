<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <h2 class="card-title">Sign Thing</h2>

      <div class="flex flex-col gap-3">
        <label class="form-control">
          <div class="label"><span class="label-text font-semibold">Address</span></div>
          <input v-model="randomAddress" type="text" class="input input-bordered w-full" placeholder="Input Address" disabled />
        </label>
        <label class="form-control">
          <div class="label"><span class="label-text font-semibold">Private Key</span></div>
          <input v-model="privateKey" type="text"
                 class="input input-bordered w-full"
                 :class="!isValidPrivateKey ? 'input-error' : ''"
                 placeholder="Input Private Key" />
        </label>
      </div>

      <div class="mt-4">
        <div role="tablist" class="tabs tabs-bordered max-w-[800px]">
          <a role="tab" :class="['tab', activeTab==='manual' && 'tab-active']" @click="activeTab='manual'">Message</a>
          <a role="tab" :class="['tab', activeTab==='pack' && 'tab-active']" @click="activeTab='pack'">EncodePacked</a>
        </div>
        <div class="mt-3">
          <div v-if="activeTab==='manual'" class="flex flex-col gap-2">
            <input v-model="messageInput" type="text" class="input input-bordered w-full" placeholder="Message to sign" />
          </div>
          <div v-else>
            packedKeccak256
            <manual-a-b-i :pack-type="'keccak'" @packed="(msg: string) => messageInput = msg" />
          </div>
        </div>
      </div>

      <div class="mt-4">
        <div class="font-semibold mb-1">Signature:</div>
        <code class="block bg-base-200 p-2 rounded break-all">{{ signature }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
</style>
<script setup lang="ts">
import {ref} from 'vue'

import {generatePrivateKey, privateKeyToAccount} from 'viem/accounts'
import {createWalletClient, http, toBytes} from 'viem'
import {mainnet} from 'viem/chains'

  const client = createWalletClient({
    chain: mainnet,
    transport: http(),
  })

  const privateKey = useState('privateKey', generatePrivateKey)
  const messageInput = ref('')
  const signature = ref('')
  const activeTab = ref<'manual' | 'pack'>('manual')
  const code = ref(`#include <bits/stdc++.h>
using namespace std;

int main() {
  cout <<"\\n" <<endl;
  cout <<"\\n" <<endl;
  cout <<"\\n" <<endl;
  cout <<"\\n" <<endl;
  cout <<"\\n" <<endl;
  cout <<"\\n" <<endl;
  cout <<"\\n" <<endl;
  cout <<"\\n" <<endl;
  cout <<"\\n" <<endl;
  cout <<"\\n" <<endl;
  return 0;
}`)
  const gocode = ref(`package main

import (
	"crypto/ecdsa"
	"encoding/hex"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/pkg/errors"
)

func SignHash(data []byte) common.Hash {
	msg := fmt.Sprintf("\\x19Ethereum Signed Message:\\n%d%s", len(data), data)
	return crypto.Keccak256Hash([]byte(msg))
}

func main() {
	message := ""
	privateKey := ""
	key, err := crypto.HexToECDSA(privateKey)
	if err != nil {
		panic(err)
	}
	publicKey := key.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		panic(errors.New("cannot assert type: publicKey is not of type *ecdsa.PublicKey"))
	}
	address := crypto.PubkeyToAddress(*publicKeyECDSA).Hex()
	fmt.Println("Address:", address)
	hashBytes, err := hex.DecodeString(message[2:])
	if err != nil {
		panic(err)
	}
	signature, err := crypto.Sign(SignHash(hashBytes).Bytes(), key)
	if err != nil {
		panic(errors.Wrapf(err, "sign message"))
	}

	// We need this to correct v = 0,1 to v = 27,28 - or else all will break
	if signature[64] == 0 || signature[64] == 1 {
		signature[64] += 27
	}
	fmt.Printf("0x%s", hex.EncodeToString(signature))
}
`)
  const randomAddress = computed(() => {
    if (privateKey.value === '0x') {
      return ''
    }
    try {
      return privateKeyToAccount(privateKey.value).address
    } catch (e) {
      console.log(e)
      return 'error address'
    }
  })

  const isValidPrivateKey = computed(() => {
    return !randomAddress.value.includes('error')
  })

  watchEffect(async () => {
    if (!isValidPrivateKey.value) {
      signature.value = ''
      return
    }
    if (!messageInput.value) {
      signature.value = ''
      return
    }
    console.log('messageInput', messageInput)
    signature.value = await privateKeyToAccount(privateKey.value).signMessage({message:{raw: toBytes(messageInput.value)}})
  })
</script>
