<template>
  <div class="container mx-auto p-4">
    <!-- Header med Flexbox -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
        My Collection
      </h1>

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
      <!-- Search Input med flex-grow -->
      <input
        v-model="searchQuery"
        @input="debouncedSearch"
        type="text"
        placeholder="Search for cards in collection..."
        class="w-full md:flex-grow p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
      />

      <!-- Sorteringskontroller -->
      <SortControls @sort-changed="handleSortChange" class="ml-2" />
    </div>

    <!-- Total Price -->
    <div class="mb-4 text-left text-gray-800 dark:text-gray-200">
      <strong>Total Collection Price:</strong> ${{ totalPrice }}
    </div>

    <!-- Card List -->
    <div v-if="isLoading" class="flex justify-center">
      <span class="text-gray-500">Loading...</span>
    </div>
    <CollectionCardList
      v-else
      :cards="filteredSortedCards"
      @remove-card="handleRemoveCard"
      @view-detail="handleViewDetail"
      @update-quantity="handleUpdateQuantity"
    />
  </div>
</template>

<script setup>
  import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
  } from 'firebase/firestore';
  import debounce from 'lodash/debounce';
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import CollectionCardList from '../components/CollectionCardList.vue';
  import SortControls from '../components/SortControls.vue';
  import useSortable from '../composables/useSortable'; // Korrekt import
  import { db } from '../firebase';
  import pokemonService from '../services/pokemonService';
  import { useUserStore } from '../store';

  // Reaktive variabler
  const searchQuery = ref('');
  const collectionCards = ref([]);
  const isLoading = ref(false);
  const router = useRouter();

  const userStore = useUserStore(); // Correct usage
  const user = computed(() => userStore.user);

  // Brug useSortable
  const { sortedResults: sortedCollectionCards, handleSortChange } =
    useSortable(collectionCards);

  // Filtrerede og sorterede kort baseret på søgning
  const filteredSortedCards = computed(() => {
    if (!searchQuery.value) return sortedCollectionCards.value;
    return sortedCollectionCards.value.filter((card) =>
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

  // Hent samlingen
  const fetchCollection = async () => {
    isLoading.value = true;
    try {
      const snapshot = await getDocs(
        collection(db, 'users', user.value.uid, 'collection')
      );
      const cards = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const updatedCards = await Promise.all(
        cards.map(async (card) => {
          const marketPrice =
            card.marketPrice || (await fetchMarketPrice(card.apiId)) || 0;
          return {
            ...card,
            marketPrice,
            rarity: card.rarity || 'Unknown',
            setNumber: card.setNumber || 'N/A',
            type: card.type || 'Unknown',
          };
        })
      );
      collectionCards.value = updatedCards;
    } catch (error) {
      console.error('Error fetching collection:', error);
      collectionCards.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // Fjern kort fra samlingen
  const removeCardFromCollection = async (cardId) => {
    if (!user.value) return;
    try {
      await deleteDoc(doc(db, 'users', user.value.uid, 'collection', cardId));
      collectionCards.value = collectionCards.value.filter(
        (card) => card.id !== cardId
      );
    } catch (error) {
      console.error('Error removing card from collection:', error);
    }
  };

  const handleRemoveCard = (cardId) => removeCardFromCollection(cardId);

  const handleViewDetail = ({ card, source }) => {
    router.push({ name: 'CardDetail', params: { id: card.id, source } });
  };

  const handleUpdateQuantity = async ({ cardId, newQuantity }) => {
    if (!user.value || newQuantity < 1) return;
    try {
      await updateDoc(doc(db, 'users', user.value.uid, 'collection', cardId), {
        quantity: newQuantity,
      });
      const card = collectionCards.value.find((c) => c.id === cardId);
      if (card) {
        card.quantity = newQuantity;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Beregn total pris
  const totalPrice = computed(() => {
    return collectionCards.value
      .reduce(
        (total, card) =>
          total +
          (parseFloat(card.marketPrice) || 0) * (parseInt(card.quantity) || 0),
        0
      )
      .toFixed(2);
  });

  // Debounce søgningen
  const debouncedSearch = debounce(() => {
    // Søgelogik håndteres via computed property
  }, 300);

  onMounted(() => {
    if (user.value) {
      fetchCollection();
    }
  });
</script>
