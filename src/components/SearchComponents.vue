<template>
  <div>
    <!-- Loading Indicator -->
    <div v-if="isLoading" class="flex justify-center mt-4">
      <span class="text-gray-500 dark:text-gray-400">Loading...</span>
    </div>

    <!-- Search Results -->
    <div
      v-else-if="paginatedResults.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      <div
        v-for="card in paginatedResults"
        :key="card.id"
        class="card-item bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 flex flex-col hover:scale-105 hover:shadow-xl transition-transform duration-300"
      >
        <!-- Card Image -->
        <img
          v-if="card.images?.small"
          :src="card.images.small"
          alt="Card Image"
          class="w-full h-40 object-contain rounded cursor-pointer"
          @click="viewDetail(card)"
          @error="onImageError($event)"
        />
        <!-- Card Name -->
        <h3 class="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-200">
          {{ card.name }}
        </h3>
        <!-- Market Price -->
        <p class="text-gray-800 dark:text-gray-200 mt-2">
          <strong>Price:</strong>
          {{ card.marketPrice ? `$${card.marketPrice.toFixed(2)}` : 'N/A' }}
        </p>
        <!-- Action Buttons -->
        <div class="mt-auto flex items-center space-x-2">
          <button
            @click="addToCollection(card)"
            class="bg-blue-500 dark:bg-blue-700 text-white dark:text-gray-200 px-3 py-1 rounded hover:bg-blue-600 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            Add to Collection
          </button>
          <!-- Wishlist Heart Icon -->
          <button @click="toggleWishlist(card)" class="focus:outline-none">
            <component
              :is="wishlist[card.id] ? HeartSolid : HeartOutline"
              class="h-6 w-6 transition-colors duration-200"
              :class="
                wishlist[card.id]
                  ? 'text-red-500'
                  : 'text-gray-500 dark:text-gray-300'
              "
            />
          </button>
        </div>
        <!-- Confirmation Message -->
        <div
          v-if="successMessages[card.id]"
          class="mt-2 text-green-500 dark:text-green-400"
        >
          {{ successMessages[card.id] }}
        </div>
      </div>
    </div>

    <!-- No Results Found -->
    <div
      v-else-if="searchQuery"
      class="text-center text-gray-500 dark:text-gray-400 mt-4"
    >
      <p>No cards found.</p>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center mt-4 space-x-2" v-if="totalPages > 1">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded disabled:opacity-50 transition-colors duration-200"
      >
        Previous
      </button>
      <span class="text-gray-800 dark:text-gray-200">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded disabled:opacity-50 transition-colors duration-200"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
  import { HeartIcon as HeartOutline } from '@heroicons/vue/24/outline';
  import { HeartIcon as HeartSolid } from '@heroicons/vue/24/solid';
  import debounce from 'lodash/debounce';
  import {
    computed,
    defineEmits,
    defineProps,
    reactive,
    ref,
    toRefs,
    watch,
  } from 'vue';
  import pokemonService from '../services/pokemonService';

  // Define props
  const props = defineProps({
    searchQuery: {
      type: String,
      default: '',
    },
    wishlistIds: {
      type: Array,
      default: () => [],
    },
    sortField: {
      type: String,
      default: 'name',
    },
    sortOrder: {
      type: String,
      default: 'asc',
    },
  });

  // Destructure props with toRefs to maintain reactivity
  const { searchQuery, wishlistIds, sortField, sortOrder } = toRefs(props);

  // Define emit events
  const emit = defineEmits([
    'add-to-collection',
    'add-to-wishlist',
    'remove-from-wishlist',
    'view-detail',
  ]);

  const searchResults = ref([]);
  const isLoading = ref(false);
  const currentPage = ref(1);
  const pageSize = ref(20);
  const successMessages = ref({});

  // Reactive wishlist object
  const wishlist = reactive({});

  // Initialize wishlist based on wishlistIds prop
  const initializeWishlist = () => {
    wishlistIds.value.forEach((id) => {
      wishlist[id] = true;
    });
  };

  // Watch for changes in wishlistIds prop
  watch(
    wishlistIds,
    () => {
      // Reset wishlist
      Object.keys(wishlist).forEach((key) => {
        wishlist[key] = false;
      });
      // Initialize with new wishlistIds
      initializeWishlist();
    },
    { immediate: true }
  );

  // Computed property for sorted search results
  const sortedSearchResults = computed(() => {
    return [...searchResults.value].sort((a, b) => {
      let aField = a[sortField.value];
      let bField = b[sortField.value];

      if (sortField.value === 'marketPrice') {
        aField = parseFloat(aField) || 0;
        bField = parseFloat(bField) || 0;
      } else {
        aField = (aField || '').toString().toLowerCase();
        bField = (bField || '').toString().toLowerCase();
      }

      if (aField < bField) return sortOrder.value === 'asc' ? -1 : 1;
      if (aField > bField) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  });

  // Computed property for paginated results
  const paginatedResults = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    return sortedSearchResults.value.slice(startIndex, endIndex);
  });

  // Calculate total pages
  const totalPages = computed(() => {
    return Math.ceil(sortedSearchResults.value.length / pageSize.value);
  });

  // Pagination methods
  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  // Toggle Wishlist status
  const toggleWishlist = async (card) => {
    if (wishlist[card.id]) {
      // Emit event to remove from wishlist
      emit('remove-from-wishlist', card);
      successMessages.value[card.id] = 'Card removed from wishlist!';
      wishlist[card.id] = false;
    } else {
      // Emit event to add to wishlist
      emit('add-to-wishlist', card);
      successMessages.value[card.id] = 'Card added to wishlist!';
      wishlist[card.id] = true;
    }

    // Remove the message after 3 seconds
    setTimeout(() => {
      delete successMessages.value[card.id];
    }, 3000);
  };

  // Add to Collection
  const addToCollection = async (card) => {
    emit('add-to-collection', card);
    successMessages.value[card.id] = 'Card added to collection!';
    // Remove the message after 3 seconds
    setTimeout(() => {
      delete successMessages.value[card.id];
    }, 3000);
  };

  // Handle view detail
  const viewDetail = (card) => {
    emit('view-detail', { card, source: 'api' });
  };

  // Handle image error
  const onImageError = (event) => {
    // Hide the image if it fails to load
    event.target.style.display = 'none';
  };

  // Search functionality
  const debouncedSearch = debounce(async () => {
    if (searchQuery.value.trim() === '') {
      searchResults.value = [];
      return;
    }
    isLoading.value = true;
    try {
      const response = await pokemonService.getCards({
        q: `name:*${searchQuery.value}*`,
        pageSize: 250, // Adjust the number as needed
        page: 1,
      });
      const cards = response.data.data;

      // Attach marketPrice to each card
      const cardsWithPrice = cards.map((card) => {
        const marketPrice =
          card.cardmarket?.prices?.averageSellPrice ||
          card.tcgplayer?.prices?.normal?.market ||
          card.tcgplayer?.prices?.holofoil?.market ||
          0;
        return {
          ...card,
          marketPrice,
        };
      });

      searchResults.value = cardsWithPrice;
      currentPage.value = 1; // Reset to first page after new search
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      isLoading.value = false;
    }
  }, 300);

  // Watch for changes in searchQuery prop
  watch(searchQuery, debouncedSearch, { immediate: true });

  // Watch for changes in sortField and sortOrder
  watch(
    [sortField, sortOrder],
    () => {
      // Recompute sorted results when sorting options change
    },
    { immediate: true }
  );
</script>
