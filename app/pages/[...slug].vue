<script setup lang="ts">
const route = useRoute()
const path = computed(() => route.path.replace(/\/$/, '') || '/')

const { data: guide } = await useAsyncData(`guide-${path.value}`, () =>
  queryCollection('guides').path(path.value).first(),
)

if (!guide.value) {
  throw createError({ statusCode: 404, statusMessage: 'Guide not found', fatal: true })
}

const slug = computed(() => path.value.slice(1))

// ProseLi reads this to key checklist progress per guide.
provide('guide-slug', slug.value)

const { data: siblings } = await useAsyncData(`nav-${path.value}`, () =>
  queryCollection('guides').order('order', 'ASC').all(),
)

const position = computed(() => siblings.value?.findIndex((g) => g.path === path.value) ?? -1)
const prev = computed(() => (position.value > 0 ? siblings.value?.[position.value - 1] : null))
const next = computed(() => siblings.value?.[position.value + 1] ?? null)

const { reset, done } = useChecklist(slug.value)

// A guide's checklist items are its markdown task-list entries. Counting from
// the parsed body keeps the total honest as guides are edited.
//
// Content v3 stores the body as a "minimal" AST where each element node is an
// array of the form [tag, props, ...children] — not an object with .tag — so
// this walks that shape looking for the input it generates for `- [ ]`.
function countTasks(node: any): number {
  if (Array.isArray(node)) {
    const [tag, props] = node
    const isCheckbox = tag === 'input' && props?.type === 'checkbox'
    return (
      (isCheckbox ? 1 : 0) + node.slice(2).reduce((n: number, c: any) => n + countTasks(c), 0)
    )
  }
  if (node && typeof node === 'object') return countTasks(node.value ?? node.children)
  return 0
}

const totalTasks = computed(() => countTasks(guide.value?.body))
const doneCount = computed(() => done.value.size)

const verified = computed(() => {
  const raw = guide.value?.lastVerified
  if (!raw) return null
  const d = new Date(raw)
  return Number.isNaN(d.getTime())
    ? raw
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
})

useSeoMeta({
  title: () => `${guide.value?.title} — buildahouse.mu`,
  description: () => guide.value?.description,
})
</script>

<template>
  <div v-if="guide" class="mx-auto max-w-3xl px-5 py-10">
    <NuxtLink to="/" class="text-sm text-stone-500 hover:text-emerald-700">
      &larr; All guides
    </NuxtLink>

    <header class="mt-4 border-b border-stone-200 pb-6">
      <p class="text-sm font-medium text-emerald-700">Phase {{ guide.phase }}</p>
      <h1 class="mt-1 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        {{ guide.title }}
      </h1>

      <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-stone-500">
        <span v-if="verified">
          Facts last checked
          <time :datetime="guide.lastVerified" class="font-medium text-stone-700">
            {{ verified }}
          </time>
        </span>
        <span v-if="totalTasks">
          <span class="font-medium text-stone-700">{{ doneCount }}</span> of
          {{ totalTasks }} checklist items done
          <button
            v-if="doneCount"
            class="ml-2 text-stone-400 underline hover:text-stone-600"
            @click="reset"
          >
            reset
          </button>
        </span>
      </div>
    </header>

    <article class="guide-body prose prose-stone mt-8 max-w-none prose-headings:font-semibold prose-a:text-emerald-700 prose-a:underline-offset-2">
      <ContentRenderer :value="guide" />
    </article>

    <nav class="mt-14 flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row">
      <NuxtLink
        v-if="prev"
        :to="prev.path"
        class="flex-1 rounded-lg border border-stone-200 bg-white p-4 transition hover:border-emerald-300"
      >
        <span class="text-xs text-stone-500">Previous</span>
        <span class="mt-0.5 block font-medium text-stone-800">{{ prev.title }}</span>
      </NuxtLink>
      <NuxtLink
        v-if="next"
        :to="next.path"
        class="flex-1 rounded-lg border border-stone-200 bg-white p-4 text-right transition hover:border-emerald-300"
      >
        <span class="text-xs text-stone-500">Next</span>
        <span class="mt-0.5 block font-medium text-stone-800">{{ next.title }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>
