<template>
  <n-card title="Sign Thing" style="margin-bottom: 16px">
    <n-space vertical>
      <n-input v-model:value="randomAddress"
               type="text" placeholder="Input Private Key">
        <template #prefix>
          <b>Address:</b>
        </template>
      </n-input>
      <n-input v-model:value="privateKey" type="text" placeholder="Input Private Key"
               :status="!isValidPrivateKey ? 'error' : ''"
      >
        <template #prefix>
          <b>Private Key:</b>
        </template>
      </n-input>
    </n-space>

    <n-space justify="space-between">
      <n-tabs type="line" animated>
        <n-tab-pane name="manual" tab="Message">
          <n-space vertical>
            <n-input v-model:value="messageInput" type="text" placeholder="Message to sign" />
            <div>Signature: {{signature}}</div>
          </n-space>
        </n-tab-pane>
        <n-tab-pane name="parse" tab="Typed Data">
          Sign Typed Data
        </n-tab-pane>
      </n-tabs>
      <n-card title="Code Example" style="margin-bottom: 16px">
        <n-tabs type="line" animated>
          <n-tab-pane name="golang" tab="Golang">
            <div style="overflow: auto">
              <n-code :code="gocode" :hljs=hljs language="golang" show-line-numbers />
            </div>
          </n-tab-pane>
          <n-tab-pane name="cpp" tab="C++">
            <div style="overflow: auto">
              <n-code :code="code" :hljs=hljs language="cpp" show-line-numbers />
            </div>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-space>
  </n-card>
</template>

<style scoped>
.card-tabs .n-tabs-nav--bar-type {
  padding-left: 4px;
}
</style>
<script setup lang="ts">
import {NCard, NInput, NSpace, NTabPane, NTabs, NCode} from 'naive-ui'
import {ref} from 'vue'

import {generatePrivateKey, privateKeyToAccount} from 'viem/accounts'
import {createWalletClient, http, toBytes} from 'viem'
import {mainnet} from 'viem/chains'
import hljs from "highlight.js/lib/core";

  const client = createWalletClient({
    chain: mainnet,
    transport: http(),
  })

  const privateKey = useState('privateKey', generatePrivateKey)
  const messageInput = ref('')
  const signature = ref('')
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
      return
    }
    if (!messageInput.value) {
      return
    }
    signature.value = await privateKeyToAccount(privateKey.value).signMessage({message:{raw: toBytes(messageInput.value)}})
  })
</script>
