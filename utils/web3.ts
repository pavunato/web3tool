// Lightweight web3 helpers for common dev tasks (Viem-based)
// All functions are tree-shakeable and typed.

import {
  Hex,
  bytesToHex,
  encodePacked,
  formatEther,
  getAddress,
  isAddress,
  keccak256,
  parseEther,
  toBytes,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// 1) Validate Ethereum-style address (EIP-55 safe)
export function isAddressValid(address: string): boolean {
  try {
    return isAddress(address)
  } catch {
    return false
  }
}

// 2) Normalize to EIP-55 checksum address (throws if invalid)
export function toChecksumAddress(address: string): Hex {
  // viem's getAddress validates and returns checksummed address
  return getAddress(address)
}

// 3) Unit helpers: wei <-> ether
export function weiToEther(value: bigint | string): string {
  const wei = typeof value === 'bigint' ? value : BigInt(value)
  return formatEther(wei)
}

export function etherToWei(value: string | number): bigint {
  return parseEther(String(value))
}

// 4) Keccak256 helpers
// Hash a utf-8 string or raw bytes to 0x-prefixed hex
export function keccak256Hex(input: string | Uint8Array): Hex {
  const bytes = typeof input === 'string' ? toBytes(input) : input
  return keccak256(bytes)
}

// Solidity-like packed keccak (useful for function/event selectors and encoding)
export function keccak256Packed(types: string[], values: unknown[]): Hex {
  const packed = encodePacked(types as any, values as any)
  return keccak256(packed)
}

// 5) Sign a message with a private key (EIP-191 personal_sign)
export async function signMessageWithPrivateKey(privateKey: Hex, message: string): Promise<Hex> {
  const account = privateKeyToAccount(privateKey)
  const sig = await account.signMessage({ message: { raw: toBytes(message) } })
  return sig
}

// Optional: quick encodePacked without hashing, returns 0x-prefixed hex
export function encodePackedHex(types: string[], values: unknown[]): Hex {
  return bytesToHex(encodePacked(types as any, values as any))
}

// Grouped export (optional convenience)
export default {
  isAddressValid,
  toChecksumAddress,
  weiToEther,
  etherToWei,
  keccak256Hex,
  keccak256Packed,
  encodePackedHex,
  signMessageWithPrivateKey,
}

