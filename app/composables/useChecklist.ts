const STORAGE_KEY = 'buildahouse:progress'

type Progress = Record<string, string[]>

/**
 * Checklist progress, held in localStorage — no accounts, no backend.
 *
 * Items are keyed by their text rather than their index, so editing a guide
 * (inserting a step, reordering) doesn't silently shift someone's ticks onto
 * the wrong items. The cost is that rewording an item loses its tick, which
 * is the safer failure.
 */
export function useChecklist(guide: string) {
  const progress = useState<Progress>('checklist', () => ({}))
  const loaded = useState('checklist-loaded', () => false)

  function read(): Progress {
    if (!import.meta.client) return {}
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      // Corrupt or unavailable storage (private mode, quota) — start clean
      // rather than breaking the page.
      return {}
    }
  }

  onMounted(() => {
    if (!loaded.value) {
      progress.value = read()
      loaded.value = true
    }
  })

  function persist() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value))
    } catch {
      // Out of quota or blocked: ticks stay for this session only.
    }
  }

  const done = computed(() => new Set(progress.value[guide] ?? []))

  function isDone(item: string) {
    return done.value.has(item)
  }

  function toggle(item: string) {
    const current = new Set(progress.value[guide] ?? [])
    current.has(item) ? current.delete(item) : current.add(item)
    progress.value = { ...progress.value, [guide]: [...current] }
    persist()
  }

  function reset() {
    const { [guide]: _dropped, ...rest } = progress.value
    progress.value = rest
    persist()
  }

  return { isDone, toggle, reset, done, loaded }
}

/** Completed counts across all guides, for the homepage. */
export function useAllProgress() {
  const progress = useState<Progress>('checklist', () => ({}))
  const loaded = useState('checklist-loaded', () => false)

  onMounted(() => {
    if (loaded.value) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      progress.value = raw ? JSON.parse(raw) : {}
    } catch {
      progress.value = {}
    }
    loaded.value = true
  })

  return {
    loaded,
    countFor: (guide: string) => computed(() => (progress.value[guide] ?? []).length),
  }
}
