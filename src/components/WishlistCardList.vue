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
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      <div
        v-for="card in cards"
        :key="card.id"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl relative flex flex-col"
      >
        <!-- Billede -->
        <!-- Image with Top Margin -->
        <img
          :src="card.imageUrl"
          alt="Card Image"
          class="w-full h-48 object-contain cursor-pointer transition-transform duration-300 mt-4"
          @click="viewDetail(card)"
        />
        <div class="p-4 flex flex-col">
          <!-- Kort Navn -->
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {{ card.name }}
          </h3>
          <!-- Pris -->
          <p class="text-gray-800 dark:text-gray-200 mb-2">
            <strong>Price:</strong>
            {{
              card.marketPrice
                ? `$${(card.marketPrice * (card.quantity || 1)).toFixed(2)}`
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
  import { TrashIcon } from '@heroicons/vue/24/solid';
  import { defineEmits, defineProps, toRefs } from 'vue';

  const props = defineProps({
    cards: {
      type: Array,
      required: true,
    },
  });

  const { cards } = toRefs(props);

  const emit = defineEmits(['remove-card', 'view-detail']);

  const removeCard = (cardId) => {
    emit('remove-card', cardId);
  };

  const viewDetail = (card) => {
    emit('view-detail', { card, source: 'wishlist' });
  };
</script>
