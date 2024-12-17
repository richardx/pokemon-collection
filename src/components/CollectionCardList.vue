<template>
  <div>
    <!-- Ingen kort tilgængelige -->
    <div
      v-if="!cards || cards.length === 0"
      class="text-center text-gray-500 dark:text-gray-400"
    >
      No cards available
    </div>
    <!-- Kort Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
    >
      <div
        v-for="card in cards"
        :key="card.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl relative flex flex-col"
      >
        <!-- Billede -->
        <img
          :src="card.imageUrl"
          alt="Card Image"
          class="w-full h-48 object-contain cursor-pointer transition-transform duration-300 mt-4"
          @click="viewDetail(card)"
        />
        <div class="p-4 flex flex-col flex-grow">
          <!-- Kort Navn -->
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {{ card.name }}
          </h3>
          <!-- Mængdekontrol -->
          <div class="flex items-center space-x-2 mb-2">
            <span class="text-gray-600 dark:text-gray-300">Quantity:</span>
            <button
              @click="decreaseQuantity(card)"
              class="btn-icon text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              aria-label="Decrease Quantity"
            >
              <MinusIcon class="h-5 w-5" />
            </button>
            <span class="text-gray-800 dark:text-white">{{
              card.quantity
            }}</span>
            <button
              @click="increaseQuantity(card)"
              class="btn-icon text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              aria-label="Increase Quantity"
            >
              <PlusIcon class="h-5 w-5" />
            </button>
          </div>
          <!-- Pris -->
          <p class="text-gray-800 dark:text-gray-200 mb-4">
            <strong>Price:</strong>
            {{
              card.marketPrice
                ? `$${(card.marketPrice * card.quantity).toFixed(2)}`
                : 'N/A'
            }}
          </p>
          <!-- Handling Knapper -->
          <div class="mt-auto flex justify-center space-x-2">
            <!-- Fjern knap -->
            <button
              @click="removeCard(card.id)"
              class="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 focus:outline-none"
              aria-label="Remove Card"
              title="Remove Card"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/solid';
  import { defineEmits, defineProps, toRefs } from 'vue';

  const props = defineProps({
    cards: {
      type: Array,
      required: true,
    },
  });

  const { cards } = toRefs(props);

  const emit = defineEmits(['remove-card', 'view-detail', 'update-quantity']);

  const increaseQuantity = (card) => {
    card.quantity += 1;
    emit('update-quantity', {
      cardId: card.id,
      newQuantity: card.quantity,
    });
  };

  const decreaseQuantity = (card) => {
    if (card.quantity > 1) {
      card.quantity -= 1;
      emit('update-quantity', {
        cardId: card.id,
        newQuantity: card.quantity,
      });
    }
  };

  const removeCard = (cardId) => {
    emit('remove-card', cardId);
  };

  const viewDetail = (card) => {
    emit('view-detail', { card, source: 'collection' });
  };
</script>
