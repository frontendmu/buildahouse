<script setup lang="ts">
/**
 * Makes markdown task-list items (`- [ ]`) tickable and persistent.
 *
 * Content renders task items as a disabled checkbox plus text. We detect that
 * shape, pull the label out of the slot, and swap in a real control bound to
 * useChecklist. Ordinary list items pass straight through untouched.
 */
const slots = useSlots()
const guide = inject<string>('guide-slug', 'unknown')
const { isDone, toggle } = useChecklist(guide)

// Flatten the slot's rendered text so an item containing links, bold, or
// italics still produces a stable storage key. Children arrive as a string, an
// array, or a slots object whose default() must be called — prose components
// like ProseEm use the last form, and skipping it silently drops their text
// from the key.
function textOf(nodes: any): string {
  if (nodes == null || typeof nodes === 'boolean') return ''
  if (typeof nodes === 'string' || typeof nodes === 'number') return String(nodes)
  if (Array.isArray(nodes)) return nodes.map(textOf).join('')

  const children = nodes.children
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return textOf(children)
  if (children && typeof children.default === 'function') {
    try {
      return textOf(children.default())
    } catch {
      return ''
    }
  }
  return ''
}

const nodes = computed(() => slots.default?.() ?? [])

function isCheckbox(n: any) {
  return n?.type === 'input' || n?.props?.type === 'checkbox' || n?.type?.name === 'ProseInput'
}

const isTask = computed(() => nodes.value.some(isCheckbox))

// Render everything except the markdown's own checkbox. Hiding it with CSS
// instead would leave a second, disabled control in the accessibility tree
// for every checklist item.
const labelNodes = computed(() => nodes.value.filter((n: any) => !isCheckbox(n)))

const label = computed(() => textOf(labelNodes.value).trim())

// Label text contains slashes, quotes and punctuation, so it can't be used as
// a DOM id. The storage key stays the text; only the id is synthetic.
const inputId = useId()

// Rendering the filtered vnodes needs a functional component: returning the
// array from `<component :is>` yields a null child and breaks hydration.
const LabelContent = () => labelNodes.value
</script>

<template>
  <li v-if="isTask" class="not-prose my-1 flex items-start gap-3">
    <input
      :id="inputId"
      type="checkbox"
      class="mt-1 size-4 shrink-0 cursor-pointer accent-emerald-600"
      :checked="isDone(label)"
      @change="toggle(label)"
    />
    <label
      :for="inputId"
      class="cursor-pointer text-[15px] leading-relaxed transition-colors"
      :class="isDone(label) ? 'text-stone-400 line-through decoration-stone-300' : 'text-stone-700'"
    >
      <LabelContent />
    </label>
  </li>
  <li v-else>
    <slot />
  </li>
</template>
