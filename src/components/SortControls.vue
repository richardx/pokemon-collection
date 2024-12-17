<template>
  <div class="flex items-center space-x-4">
    <label class="flex items-center">
      <span class="mr-2 text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Sorter efter:
      </span>
      <select
        v-model="selectedField"
        @change="updateSort"
        class="mt-1 py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="name">Name</option>
        <option value="marketPrice">Price</option>
      </select>
    </label>
    <label class="flex items-center">
      <span class="mr-2 text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Orden:
      </span>
      <select
        v-model="selectedOrder"
        @change="updateSort"
        class="mt-1 py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="asc">Asc</option>
        <option value="desc">Des</option>
      </select>
    </label>
  </div>
</template>

<script setup>
  import { defineEmits, ref } from 'vue';

  const emit = defineEmits(['sort-changed']);
  const selectedField = ref('name');
  const selectedOrder = ref('asc');

  const updateSort = () => {
    emit('sort-changed', {
      field: selectedField.value,
      order: selectedOrder.value,
    });
  };
</script>
