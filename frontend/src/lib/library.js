import { useSyncExternalStore } from 'react'

// "My Library": ids of games bought in this browser. Stored in localStorage only (no accounts).
const KEY = 'teks-library'
const listeners = new Set()
let lastRaw = null
let lastIds = []

const readRaw = () => {
  try {
    return localStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}

function snapshot() {
  const raw = readRaw()
  if (raw !== lastRaw) {
    lastRaw = raw
    try {
      const parsed = JSON.parse(raw || '[]')
      lastIds = Array.isArray(parsed) ? parsed.filter(Number.isInteger) : []
    } catch {
      lastIds = []
    }
  }
  return lastIds
}

const subscribe = (fn) => {
  listeners.add(fn)
  window.addEventListener('storage', fn)
  return () => {
    listeners.delete(fn)
    window.removeEventListener('storage', fn)
  }
}

export function addToLibrary(gameIds) {
  const next = [...new Set([...snapshot(), ...gameIds])]
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable: library only lasts for this tab */
    lastRaw = null
    lastIds = next
  }
  listeners.forEach((fn) => fn())
}

export const useLibrary = () => useSyncExternalStore(subscribe, snapshot, () => [])
