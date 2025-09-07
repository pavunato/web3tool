<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body">
      <h2 class="card-title">Units Conversion</h2>

      <div class="grid gap-3">
        <label class="form-control">
          <div class="label"><span class="label-text">Ether (ETH)</span></div>
          <div class="join w-full">
            <input v-model="ethField" type="text" class="input input-bordered join-item w-full" :class="ethError && 'input-error'" placeholder="e.g. 0.1" @input="active='eth'" />
            <button class="btn join-item" @click="copyToClipboard(ethField, 'eth')">{{ clicked['eth'] ? 'Copied' : 'Copy' }}</button>
          </div>
          <div v-if="ethError" class="text-error text-sm mt-1">Invalid ether amount</div>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">Gwei</span></div>
          <div class="join w-full">
            <input v-model="gweiField" type="text" class="input input-bordered join-item w-full" :class="gweiError && 'input-error'" placeholder="e.g. 100000000" @input="active='gwei'" />
            <button class="btn join-item" @click="copyToClipboard(gweiField, 'gwei')">{{ clicked['gwei'] ? 'Copied' : 'Copy' }}</button>
          </div>
          <div v-if="gweiError" class="text-error text-sm mt-1">Invalid gwei amount</div>
        </label>

        <label class="form-control">
          <div class="label"><span class="label-text">Wei</span></div>
          <div class="join w-full">
            <input v-model="weiField" type="text" class="input input-bordered join-item w-full" :class="weiError && 'input-error'" placeholder="e.g. 1000000000000000000" @input="active='wei'" />
            <button class="btn join-item" @click="copyToClipboard(weiField, 'wei')">{{ clicked['wei'] ? 'Copied' : 'Copy' }}</button>
          </div>
          <div v-if="weiError" class="text-error text-sm mt-1">Invalid wei amount</div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue'
import { formatEther, parseEther } from 'viem'

const active = ref<'eth'|'gwei'|'wei'>('eth')
const clicked = reactive<Record<string, boolean>>({})

// base value is always in wei (bigint), or null if invalid
const weiBase = ref<bigint | null>(0n)

// helpers for gwei
const GWEI = 1_000_000_000n
function parseGwei(s: string): bigint | null {
  if (s == null) return null
  s = s.trim()
  if (s === '') return null
  // up to 9 decimal places
  const m = s.match(/^([0-9]+)(?:\.([0-9]{0,9}))?$/)
  if (!m) return null
  const intPart = m[1]
  const fracPart = m[2] || ''
  try {
    const intWei = BigInt(intPart) * GWEI
    const fracPadded = (fracPart + '000000000').slice(0, 9)
    const fracWei = BigInt(fracPadded)
    return intWei + fracWei
  } catch {
    return null
  }
}
function formatGwei(wei: bigint): string {
  const intPart = wei / GWEI
  const frac = wei % GWEI
  if (frac === 0n) return intPart.toString()
  let fracStr = frac.toString().padStart(9, '0')
  // remove trailing zeros
  fracStr = fracStr.replace(/0+$/, '')
  return `${intPart.toString()}.${fracStr}`
}

// three computed fields with setters
const ethField = computed<string>({
  get() {
    return weiBase.value == null ? '' : formatEther(weiBase.value)
  },
  set(v: string) {
    try {
      weiBase.value = parseEther(v)
    } catch {
      weiBase.value = null
    }
  }
})

const gweiField = computed<string>({
  get() {
    return weiBase.value == null ? '' : formatGwei(weiBase.value)
  },
  set(v: string) {
    weiBase.value = parseGwei(v)
  }
})

const weiField = computed<string>({
  get() {
    return weiBase.value == null ? '' : weiBase.value.toString()
  },
  set(v: string) {
    if (!v || /[^0-9]/.test(v)) { weiBase.value = null; return }
    try { weiBase.value = BigInt(v) } catch { weiBase.value = null }
  }
})

// track error states
const ethError = computed(() => active.value === 'eth' && weiBase.value == null)
const gweiError = computed(() => active.value === 'gwei' && weiBase.value == null)
const weiError = computed(() => active.value === 'wei' && weiBase.value == null)

// copy helper
async function copyToClipboard(text: string, key: string) {
  try {
    await navigator.clipboard.writeText(text || '')
    clicked[key] = true
    setTimeout(() => { clicked[key] = false }, 1200)
  } catch (e) { console.error(e) }
}

// initialize defaults
weiBase.value = 0n
</script>
