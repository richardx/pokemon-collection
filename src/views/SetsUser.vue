<template>
  <div class="container mx-auto p-4 bg-white dark:bg-gray-900">
    <h1 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
      Pokémon Sets
    </h1>
    <div v-for="(sets, series) in groupedSets" :key="series" class="mb-6">
      <!-- Serie-Header -->
      <h2 class="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
        {{ series }}
      </h2>
      <!-- Sets Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="set in sets"
          :key="set.id"
          class="set-item border border-gray-300 dark:border-gray-700 p-4 rounded cursor-pointer flex flex-col items-center bg-gray-100 dark:bg-gray-800 transition transform hover:scale-105 hover:shadow-lg"
          @click="viewSet(set.id)"
        >
          <img
            :src="set.images.logo"
            alt="Set Logo"
            class="w-32 h-32 object-contain mb-2"
          />
          <h3
            class="text-lg font-semibold text-center text-gray-800 dark:text-gray-100"
          >
            {{ set.name }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import pokemonService from '../services/pokemonService';

  const sets = ref([]);
  const router = useRouter();

  // Hent alle sets fra API'en
  const fetchSets = async () => {
    try {
      const response = await pokemonService.getSets();
      sets.value = response.data.data;
    } catch (error) {
      console.error('Error fetching sets:', error);
    }
  };

  // Computed property til at sortere og gruppere sets
  const groupedSets = computed(() => {
    if (!sets.value.length) return {};

    // Sorter sets efter releaseDate fra nyeste til ældste
    const sortedSets = [...sets.value].sort((a, b) => {
      const dateA = new Date(a.releaseDate);
      const dateB = new Date(b.releaseDate);
      return dateB - dateA;
    });

    // Gruppér sets efter series
    return sortedSets.reduce((groups, set) => {
      const series = set.series || 'Other';
      if (!groups[series]) {
        groups[series] = [];
      }
      groups[series].push(set);
      return groups;
    }, {});
  });

  // Naviger til SetDetail når et set klikkes
  const viewSet = (setId) => {
    router.push({ name: 'SetDetail', params: { setId } });
  };

  onMounted(fetchSets);
</script>

<style scoped>
  .set-item {
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .set-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
