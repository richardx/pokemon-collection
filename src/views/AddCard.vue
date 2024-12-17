<template>
  <div class="container mx-auto p-4 bg-white dark:bg-gray-900">
    <h1 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
      Add Card
    </h1>
    <!-- Flex Container til Søgefelt og Sorteringsknapper -->
    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 space-y-4 md:space-y-0"
    >
      <!-- Søgefelt -->
      <div class="flex-1">
        <input
          v-model="searchQuery"
          @input="updateRouteQuery"
          placeholder="Search card"
          class="p-2 border rounded w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Sorteringskontroller -->
      <SortControls @sort-changed="handleSortChange" class="flex-none ml-2" />
    </div>

    <!-- Søgeresultater -->
    <SearchComponent
      :search-query="searchQuery"
      :wishlist-ids="wishlistIds"
      @add-to-collection="addCardToCollection"
      @add-to-wishlist="addCardToWishlist"
      @remove-from-wishlist="removeCardFromWishlist"
      @view-detail="handleViewDetail"
      :sort-field="sortField"
      :sort-order="sortOrder"
    />
  </div>
</template>

<script setup>
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
  } from 'firebase/firestore';
  import { computed, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import SearchComponent from '../components/SearchComponents.vue';
  import SortControls from '../components/SortControls.vue';
  import { db } from '../firebase';

  const auth = getAuth();
  const user = ref(auth.currentUser);
  const userId = computed(() => (user.value ? user.value.uid : null));
  const route = useRoute();
  const router = useRouter();

  // Search query and sorting parameters
  const searchQuery = ref('');
  const sortField = ref('name');
  const sortOrder = ref('asc');

  const handleSortChange = ({ field, order }) => {
    sortField.value = field;
    sortOrder.value = order;
  };

  // Initialize searchQuery from route query params
  onMounted(() => {
    if (route.query.search) {
      searchQuery.value = route.query.search;
    }
  });

  const updateRouteQuery = () => {
    router.replace({
      name: 'AddCard',
      query: { ...route.query, search: searchQuery.value || undefined },
    });
  };

  // Wishlist IDs
  const wishlistIds = ref([]);

  // Fetch wishlist IDs
  const fetchWishlistIds = async () => {
    if (!userId.value) {
      wishlistIds.value = [];
      return;
    }

    try {
      const wishlistRef = collection(db, 'users', userId.value, 'wishlist');
      const snapshot = await getDocs(wishlistRef);
      wishlistIds.value = snapshot.docs.map((doc) => doc.id);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      wishlistIds.value = [];
    }
  };

  // On mount, listen for authentication state
  onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
      if (currentUser) {
        fetchWishlistIds();
      } else {
        wishlistIds.value = [];
      }
    });
  });

  // Add to collection
  const addCardToCollection = async (card) => {
    if (!userId.value) return;
    try {
      await setDoc(doc(db, 'users', userId.value, 'collection', card.id), {
        name: card.name,
        imageUrl: card.images.small,
        quantity: 1,
        addedAt: new Date(),
        apiId: card.id,
        rarity: card.rarity || 'Unknown',
        setNumber: card.number || 'N/A',
        marketPrice: card.marketPrice || 0,
      });
    } catch (error) {
      console.error('Error adding card to collection:', error);
    }
  };

  // Add to wishlist
  const addCardToWishlist = async (card) => {
    if (!userId.value) return;
    try {
      await setDoc(doc(db, 'users', userId.value, 'wishlist', card.id), {
        name: card.name,
        imageUrl: card.images.small,
        addedAt: new Date(),
        apiId: card.id,
      });
      // Update wishlistIds after adding
      wishlistIds.value.push(card.id);
    } catch (error) {
      console.error('Error adding card to wishlist:', error);
    }
  };

  // Remove from wishlist
  const removeCardFromWishlist = async (card) => {
    if (!userId.value) return;
    try {
      await deleteDoc(doc(db, 'users', userId.value, 'wishlist', card.id));
      // Update wishlistIds after removing
      const index = wishlistIds.value.indexOf(card.id);
      if (index > -1) {
        wishlistIds.value.splice(index, 1);
      }
    } catch (error) {
      console.error('Error removing card from wishlist:', error);
    }
  };

  const handleViewDetail = ({ card, source }) => {
    router.push({ name: 'CardDetail', params: { id: card.id, source } });
  };
</script>
