<template>
  <div class="container mx-auto p-4">
    <!-- Header med Flexbox -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Wishlist</h1>
      <!-- Add Card Button -->
      <button
        @click="router.push({ name: 'AddCard' })"
        class="bg-blue-500 dark:bg-blue-700 text-white dark:text-gray-200 rounded px-4 py-2"
      >
        Add Card
      </button>
    </div>

    <!-- Search og Sort Container -->
    <div
      class="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0"
    >
      <!-- Search Input -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search your wishlist..."
        class="w-full md:flex-grow p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
      />

      <!-- Fjernet Border mellem Search Input og Sort Controls -->

      <!-- Sorteringskontroller -->
      <SortControls @sort-changed="handleSortChange" class="ml-2" />
    </div>

    <!-- Card List -->
    <div v-if="isLoading" class="flex justify-center">
      <span class="text-gray-500 dark:text-gray-400">Loading...</span>
    </div>
    <WishlistCardList
      v-else
      :cards="filteredSortedCards"
      @remove-card="handleRemoveCard"
      @view-detail="handleViewDetail"
    />
  </div>
</template>

<script setup>
  import { getAuth } from 'firebase/auth';
  import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
  import { computed, onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import SortControls from '../components/SortControls.vue';
  import WishlistCardList from '../components/WishlistCardList.vue';
  import useSortable from '../composables/useSortable';
  import { db } from '../firebase';
  import pokemonService from '../services/pokemonService';

  const auth = getAuth();
  const user = ref(auth.currentUser);
  const userId = computed(() => (user.value ? user.value.uid : null));
  const router = useRouter();

  const wishlistCards = ref([]);
  const isLoading = ref(false);
  const searchQuery = ref('');

  // Brug useSortable
  const { sortedResults: sortedWishlistCards, handleSortChange } =
    useSortable(wishlistCards);

  // Filtrerede og sorterede kort baseret på søgning
  const filteredSortedCards = computed(() => {
    if (!searchQuery.value) return sortedWishlistCards.value;
    return sortedWishlistCards.value.filter((card) =>
      card.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  // Hent markedsprisen
  const fetchMarketPrice = async (apiId) => {
    try {
      const apiResponse = await pokemonService.getCard(apiId);
      const apiDetails = apiResponse.data.data;
      if (apiDetails.tcgplayer?.prices?.holofoil?.market !== undefined) {
        return apiDetails.tcgplayer.prices.holofoil.market;
      } else if (apiDetails.tcgplayer?.prices?.normal?.market !== undefined) {
        return apiDetails.tcgplayer.prices.normal.market;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching market price:', error);
      return null;
    }
  };

  // Hent ønskelisten
  const fetchWishlist = async () => {
    if (!userId.value) return;
    isLoading.value = true;
    try {
      const snapshot = await getDocs(
        collection(db, 'users', userId.value, 'wishlist')
      );
      const cards = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const updatedCards = await Promise.all(
        cards.map(async (card) => {
          const marketPrice = await fetchMarketPrice(card.apiId);
          return { ...card, marketPrice: marketPrice || 0 };
        })
      );
      wishlistCards.value = updatedCards;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      wishlistCards.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const removeCardFromWishlist = async (cardId) => {
    if (!userId.value) return;
    try {
      await deleteDoc(doc(db, 'users', userId.value, 'wishlist', cardId));
      wishlistCards.value = wishlistCards.value.filter(
        (card) => card.id !== cardId
      );
    } catch (error) {
      console.error('Error removing card from wishlist:', error);
    }
  };

  const handleRemoveCard = (cardId) => removeCardFromWishlist(cardId);

  const handleViewDetail = ({ card, source }) => {
    router.push({ name: 'CardDetail', params: { id: card.id, source } });
  };

  watch(
    () => auth.currentUser,
    (newUser) => {
      user.value = newUser;
      if (newUser) {
        fetchWishlist();
      } else {
        wishlistCards.value = [];
      }
    }
  );

  onMounted(() => {
    if (user.value) {
      fetchWishlist();
    }
  });
</script>
