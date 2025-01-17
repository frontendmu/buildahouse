<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
console.log('Route params:', route.params.slug[0])

const { data: pageContent } = await useAsyncData(() => 
    queryCollection('content').all()
)
console.log('Page content:', pageContent)
</script>

<template>
  <ContentRenderer v-if="pageContent" :value="pageContent" />
</template>