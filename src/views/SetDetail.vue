<template>
  <div class="container mx-auto p-4 bg-white dark:bg-gray-900">
    <h1 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
      {{ setDetails.name }}
    </h1>

    <!-- Sort Controls -->
    <SortControls @sort-changed="handleSortChange" class="mb-4" />

    <!-- Cards Grid -->
    <div v-if="isLoading" class="flex justify-center">
      <span class="text-gray-500 dark:text-gray-400">Loading...</span>
    </div>
    <div
      v-else-if="paginatedCards.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      <div
        v-for="card in paginatedCards"
        :key="card.id"
        class="card-item bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 flex flex-col hover:scale-105 hover:shadow-xl transition-transform duration-300"
      >
        <!-- Card Image -->
        <img
          v-if="card.images?.small"
          :src="card.images.small"
          alt="Card Image"
          class="w-full h-40 object-contain rounded cursor-pointer"
          @click="viewCardDetail(card.id)"
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
            class="bg-blue-500 dark:bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-600 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            Add to Collection
          </button>
          <button @click="toggleWishlist(card)" class="focus:outline-none">
            <component
              :is="wishlist[card.id] ? HeartSolid : HeartOutline"
              class="h-6 w-6 transition-colors duration-200"
              :class="
                wishlist[card.id]
                  ? 'text-red-500'
                  : 'text-gray-500 dark:text-gray-400'
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
      v-else-if="!isLoading && paginatedCards.length === 0"
      class="text-center text-gray-500 dark:text-gray-400"
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
      <span class="text-gray-800 dark:text-gray-100">
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
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import SortControls from '../components/SortControls.vue';
  import { db } from '../firebase';
  import pokemonService from '../services/pokemonService';

  // Router og Route
  const route = useRoute();
  const router = useRouter();
  const setId = route.params.setId;

  // Reactive tilstand
  const setDetails = ref({});
  const setCards = ref([]);
  const isLoading = ref(false);
  const successMessages = ref({});

  // Wishlist objekt for at holde styr på hver enkelt korts wishlist-status
  const wishlist = reactive({});

  // Pagination og sortering
  const currentPage = ref(1);
  const pageSize = ref(20);
  const sortField = ref('name');
  const sortOrder = ref('asc');

  // Hent sæt detaljer og kort
  const fetchSetDetails = async () => {
    isLoading.value = true;
    try {
      // Hent sæt detaljer
      const response = await pokemonService.getSet(setId);
      setDetails.value = response.data.data;

      // Hent alle kort i sættet
      const cardsResponse = await pokemonService.getCards({
        q: `set.id:${setId}`,
        pageSize: 250, // Juster efter behov
        page: 1,
      });
      const cards = cardsResponse.data.data;

      // Tilføj marketPrice til hvert kort
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

      setCards.value = cardsWithPrice;

      // Check wishlist status for hver kort
      if (userId.value) {
        await Promise.all(
          setCards.value.map(async (card) => {
            const docRef = doc(db, 'users', userId.value, 'wishlist', card.id);
            const docSnap = await getDoc(docRef);
            wishlist[card.id] = docSnap.exists();
          })
        );
      }
    } catch (error) {
      console.error('Error fetching set details or cards:', error);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchSetDetails);

  // Sorting og Pagination
  const sortedSetCards = computed(() => {
    return [...setCards.value].sort((a, b) => {
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

  const paginatedCards = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    return sortedSetCards.value.slice(startIndex, endIndex);
  });

  const totalPages = computed(() => {
    return Math.ceil(sortedSetCards.value.length / pageSize.value);
  });

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

  const handleSortChange = ({ field, order }) => {
    sortField.value = field;
    sortOrder.value = order;
    currentPage.value = 1; // Nulstil til første side ved ændring af sortering
  };

  // User Authentication
  const auth = getAuth();
  const user = ref(auth.currentUser);
  const userId = computed(() => (user.value ? user.value.uid : null));

  onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
      if (currentUser) {
        // Opdater wishlist status når brugeren ændres
        setCards.value.forEach(async (card) => {
          const docRef = doc(db, 'users', user.value.uid, 'wishlist', card.id);
          const docSnap = await getDoc(docRef);
          wishlist[card.id] = docSnap.exists();
        });
      } else {
        // Fjern alle wishlist status hvis ingen bruger er logget ind
        Object.keys(wishlist).forEach((key) => {
          delete wishlist[key];
        });
      }
    });
  });

  // Add to Collection
  const addToCollection = async (card) => {
    if (!userId.value) return;
    try {
      await setDoc(doc(db, 'users', userId.value, 'collection', card.id), {
        name: card.name,
        imageUrl: card.images.small,
        quantity: 1,
        addedAt: new Date(),
        apiId: card.id,
        marketPrice: card.marketPrice || 0,
      });
      successMessages.value[card.id] = 'Kortet er tilføjet til din samling!';
      // Fjern beskeden efter 3 sekunder
      setTimeout(() => {
        delete successMessages.value[card.id];
      }, 3000);
    } catch (error) {
      console.error('Error adding card to collection:', error);
    }
  };

  // Toggle Wishlist
  const toggleWishlist = async (card) => {
    if (!userId.value) return;
    if (wishlist[card.id]) {
      // Fjern fra wishlist
      try {
        await deleteDoc(doc(db, 'users', userId.value, 'wishlist', card.id));
        successMessages.value[card.id] =
          'Kortet er fjernet fra din ønskeliste!';
        wishlist[card.id] = false;
        setTimeout(() => {
          delete successMessages.value[card.id];
        }, 3000);
      } catch (error) {
        console.error('Error removing card from wishlist:', error);
      }
    } else {
      // Tilføj til wishlist
      try {
        await setDoc(doc(db, 'users', userId.value, 'wishlist', card.id), {
          name: card.name,
          imageUrl: card.images.small,
          addedAt: new Date(),
          apiId: card.id,
          marketPrice: card.marketPrice || 0,
        });
        successMessages.value[card.id] =
          'Kortet er tilføjet til din ønskeliste!';
        wishlist[card.id] = true;
        setTimeout(() => {
          delete successMessages.value[card.id];
        }, 3000);
      } catch (error) {
        console.error('Error adding card to wishlist:', error);
      }
    }
  };

  // View Card Detail
  const viewCardDetail = (cardId) => {
    router.push({ name: 'CardDetail', params: { id: cardId, source: 'api' } });
  };

  // Handle image error
  const onImageError = (event) => {
    event.target.style.display = 'none';
  };
</script>
