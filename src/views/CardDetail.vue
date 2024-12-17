<template>
  <div class="container mx-auto p-4 bg-white dark:bg-gray-900 min-h-screen">
    <button
      @click="$router.go(-1)"
      class="mb-4 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-200"
    >
      Back
    </button>
    <div v-if="error" class="text-red-500 dark:text-red-400">
      {{ error }}
    </div>
    <CardDetailsDisplay
      v-if="!error"
      :card="card"
      :apiDetails="apiDetails"
      class="bg-white dark:bg-gray-800 p-4 rounded shadow-lg"
    />
  </div>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import CardDetailsDisplay from '../components/CardDetailsDisplay.vue';
  import {
    fetchApiDetails,
    fetchCardFromApi,
    fetchCardFromCollection,
  } from '../services/cardService';
  import { useUserStore } from '../store';

  const route = useRoute();
  const card = ref({});
  const apiDetails = ref({});
  const error = ref('');
  const userStore = useUserStore();

  const fetchCardDetail = async () => {
    const { id: cardId, source } = route.params;

    if (!source) {
      error.value = 'No source provided.';
      return;
    }

    try {
      if (source === 'collection' || source === 'wishlist') {
        if (!userStore.user) {
          error.value = 'You must be logged in to view card details.';
          return;
        }

        const collectionPath =
          source === 'collection' ? 'collection' : 'wishlist';
        card.value = await fetchCardFromCollection(
          userStore.user.uid,
          cardId,
          collectionPath
        );

        if (card.value.apiId) {
          apiDetails.value = await fetchApiDetails(card.value.apiId);
        } else {
          console.warn('No API ID found for this card.');
        }
      } else if (source === 'api') {
        apiDetails.value = await fetchCardFromApi(cardId);
      } else {
        error.value = 'Invalid card source.';
      }
    } catch (err) {
      console.error(err.message);
      error.value = err.message;
    }
  };

  onMounted(() => {
    if (userStore.user || route.params.source === 'api') {
      fetchCardDetail();
    } else {
      watch(
        () => userStore.user,
        (newUser) => {
          if (newUser) {
            fetchCardDetail();
          }
        }
      );
    }
  });
</script>
