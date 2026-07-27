<script setup lang="ts">
const PHASES: Record<number, string> = {
  1: 'Land',
  2: 'Money',
  3: 'Design',
  4: 'Permits & contractor',
  5: 'Building',
  6: 'Utilities',
  7: 'After completion',
}

// Select only the card fields: fetching bodies here would ship every guide's
// full AST in the homepage payload.
const { data: guides } = await useAsyncData('guide-index', () =>
  queryCollection('guides')
    .select('path', 'title', 'description', 'phase')
    .order('order', 'ASC')
    .all(),
)

const grouped = computed(() => {
  const byPhase = new Map<number, typeof guides.value>()
  for (const g of guides.value ?? []) {
    if (!byPhase.has(g.phase)) byPhase.set(g.phase, [])
    byPhase.get(g.phase)!.push(g)
  }
  return [...byPhase.entries()].sort(([a], [b]) => a - b)
})


const { countFor, loaded } = useAllProgress()

useSeoMeta({
  title: 'buildahouse.mu — the checklist for building a house in Mauritius',
  description:
    'A free, step-by-step checklist for building a house in Mauritius: land, financing, government schemes, permits, contractors, utilities, and the occupation certificate.',
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-5">
    <section class="py-14 sm:py-20">
      <h1 class="max-w-3xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
        Building a house in Mauritius?
        <span class="text-emerald-600">Don't miss a step.</span>
      </h1>
      <p class="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
        From buying the land to the occupation certificate — the permits, the government schemes you
        can claim, the questions to ask your architect, and what to check on site before it gets
        covered in concrete.
      </p>
      <p class="mt-4 max-w-2xl text-[15px] text-stone-500">
        Tick items off as you go. Your progress is saved in your browser — no account needed.
      </p>
    </section>

    <section v-for="[phase, items] in grouped" :key="phase" class="mb-12">
      <div class="mb-4 flex items-baseline gap-3">
        <span
          class="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white"
        >
          {{ phase }}
        </span>
        <h2 class="text-xl font-semibold text-stone-900">{{ PHASES[phase] ?? 'More' }}</h2>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <NuxtLink
          v-for="guide in items"
          :key="guide.path"
          :to="guide.path"
          class="group rounded-xl border border-stone-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <h3 class="font-semibold text-stone-900 group-hover:text-emerald-700">
              {{ guide.title }}
            </h3>
            <span
              v-if="loaded && countFor(guide.path.slice(1)).value > 0"
              class="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
            >
              {{ countFor(guide.path.slice(1)).value }} done
            </span>
          </div>
          <p class="mt-1.5 text-sm text-stone-500">
            {{ guide.description }}
          </p>
        </NuxtLink>
      </div>
    </section>

    <section class="mb-10 rounded-xl border border-amber-200 bg-amber-50 p-6">
      <h2 class="font-semibold text-amber-950">Before you rely on any figure here</h2>
      <p class="mt-2 max-w-2xl text-[15px] leading-relaxed text-amber-900">
        Government schemes in Mauritius change with every annual Budget, and out-of-date advice is
        everywhere. Each guide shows when its facts were last checked against official sources, and
        flags anything we could not confirm. Always verify with the authority itself before
        committing money.
      </p>
    </section>
  </div>
</template>
