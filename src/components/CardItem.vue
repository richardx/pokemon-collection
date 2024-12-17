<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <img :src="card.image" alt="Card Image" class="w-full h-48 object-cover" />
    <div class="p-4">
      <h3 class="text-lg font-semibold">{{ card.name }}</h3>
      <p class="text-gray-600">{{ card.description }}</p>
      <div class="mt-2 flex justify-between items-center">
        <input
          type="number"
          v-model.number="quantity"
          @change="updateQuantity"
          min="1"
          class="w-16 p-1 border rounded"
        />
        <button
          @click="viewDetail"
          class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          View Details
        </button>
        <button
          @click="removeCard"
          class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, defineProps, ref } from 'vue';

  const props = defineProps({
    card: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['update-quantity', 'remove-card', 'view-detail']);

  const quantity = ref(props.card.quantity || 1);

  const updateQuantity = () => {
    emit('update-quantity', {
      cardId: props.card.id,
      newQuantity: quantity.value,
    });
  };

  const removeCard = () => {
    emit('remove-card', props.card.id);
  };

  const viewDetail = () => {
    emit('view-detail', props.card);
  };
</script>

<style scoped>
  /* Tilføj dine stilarter her */
</style>
