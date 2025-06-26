<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import Layout from '../layout/layout.vue'
import { defineOptions, defineProps } from 'vue'
defineOptions({ layout: Layout })
defineProps<{
  menus: any[]
}>()
</script>

<template>
  <Head title="Homepage" />

  <div class="pt-4 h-full flex flex-col">
    
    <ul v-for="(item, index) in menus" :key="index">
      <li>{{ item.title }}</li>
    </ul>

    <div
      class="text-sm text-center [&>code]:font-medium [&>code]:text-[#a599ff] bg-sand-12 text-sand-1 fixed bottom-0 left-0 right-0 py-2"
    >
      Route for this page is registered in <code>start/routes.ts</code> file, rendering
      <code>inertia/pages/home.vue</code> template
    </div>
  </div>
</template>
