<template>
  <div
    class="card-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
  >
    <div
      v-if="cards.length === 0"
      class="no-cards col-span-full text-center text-gray-500"
    >
      No cards available
    </div>
    <div
      v-else
      v-for="card in cards"
      :key="card.id"
      class="card bg-white border border-gray-200 rounded-lg shadow-md flex flex-col overflow-hidden"
    >
      <img
        :src="card.imageUrl"
        alt="Card Image"
        class="w-full h-48 object-contain bg-gray-100"
      />
      <div class="p-4 flex-1 flex flex-col">
        <h3 class="text-lg font-semibold mb-2">{{ card.name }}</h3>
        <!-- Quantity displayed only if showQuantity is true -->
        <p v-if="showQuantity" class="text-gray-600 mb-2">
          Quantity: {{ card.quantity }}
        </p>
        <!-- Display Price -->
        <p class="text-gray-800 mb-2">
          <strong>Price:</strong>
          {{ card.marketPrice ? `$${card.marketPrice}` : 'N/A' }}
        </p>
        <div class="mt-auto flex justify-center space-x-2">
          <!-- Quantity buttons are conditionally rendered -->
          <button
            v-if="showQuantity"
            @click="updateQuantity(card.id, card.quantity + 1)"
            class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
          >
            Increase
          </button>
          <button
            v-if="showQuantity"
            @click="updateQuantity(card.id, card.quantity - 1)"
            class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
          >
            Decrease
          </button>
          <!-- Remove and Details buttons -->
          <button
            @click="removeCard(card.id)"
            class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
          >
            Remove
          </button>
          <button
            @click="viewDetail(card)"
            class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, defineProps, toRefs } from 'vue';

  const props = defineProps({
    cards: {
      type: Array,
      required: true,
    },
    showQuantity: {
      type: Boolean,
      default: true,
    },
  });

  const { cards, showQuantity } = toRefs(props);

  const emit = defineEmits(['update-quantity', 'remove-card', 'view-detail']);

  const updateQuantity = (cardId, newQuantity) => {
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    emit('update-quantity', { cardId, newQuantity });
  };

  const removeCard = (cardId) => {
    emit('remove-card', cardId);
  };

  const viewDetail = (card) => {
    emit('view-detail', card);
  };
</script>

<style scoped></style>
