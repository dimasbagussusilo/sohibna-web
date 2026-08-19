import { useEffect, useRef } from 'react'

// Tiny hotkey dispatcher for the desktop PWA. Sequences ("g h") are supported:
// a key that starts a sequence arms a short window in which the next key
// completes it. Typing contexts (input/textarea/select/contentEditable) never
// trigger shortcuts, and modifiers (ctrl/meta/alt) are left to the browser.

export type HotkeyHandler = () => void

type Binding = {
  /** Key or sequence, e.g. "/" or "g h". Letters lowercase; digits/symbols literal. */
  keys: string
  handler: HotkeyHandler
}

const isTyping = (el: EventTarget | null): boolean => {
  const node = el as HTMLElement | null
  if (!node || !node.tagName) return false
  const tag = node.tagName.toLowerCase()
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    node.isContentEditable === true
  )
}

export function useHotkeys(bindings: Binding[], enabled = true): void {
  // Keep the latest handlers without re-attaching the listener.
  const ref = useRef(bindings)
  ref.current = bindings

  useEffect(() => {
    if (!enabled) return
    // Armed sequence prefix ("g") + expiry timestamp.
    let armed: string | null = null
    let armTimer: ReturnType<typeof setTimeout> | null = null

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (isTyping(e.target)) {
        armed = null
        return
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key

      // Complete an armed sequence.
      if (armed) {
        const seq = `${armed} ${key}`
        const hit = ref.current.find((b) => b.keys === seq)
        clearTimeout(armTimer!)
        armed = null
        if (hit) {
          e.preventDefault()
          hit.handler()
          return
        }
        // Not a sequence completion — fall through as a fresh single key.
      }

      // Arm potential sequence starters ("g …").
      const starter = ref.current.find((b) => b.keys.startsWith(`${key} `))
      if (starter) {
        armed = key
        armTimer = setTimeout(() => (armed = null), 1200)
        e.preventDefault()
        return
      }

      const hit = ref.current.find((b) => b.keys === key)
      if (hit) {
        e.preventDefault()
        hit.handler()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      if (armTimer) clearTimeout(armTimer)
    }
  }, [enabled])
}
