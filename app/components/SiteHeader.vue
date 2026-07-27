<template>
  <header class="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
      <NuxtLink to="/" class="group flex items-center gap-2 font-semibold text-stone-900">
        <span class="text-lg" aria-hidden="true">🏠</span>
        <span>buildahouse<span class="text-emerald-600">.mu</span></span>
      </NuxtLink>
      <nav class="flex items-center gap-4 text-sm text-stone-600">
        <NuxtLink to="/" class="hover:text-emerald-700">All guides</NuxtLink>
        <a
          href="https://github.com/frontendmu/buildahouse"
          target="_blank"
          rel="noopener"
          class="hover:text-emerald-700"
        >
          Contribute
        </a>
      </nav>
    </div>
  </header>
</template>
