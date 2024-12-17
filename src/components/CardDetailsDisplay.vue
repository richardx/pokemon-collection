<template>
  <div
    class="card-details bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-md"
  >
    <div class="flex flex-col md:flex-row">
      <img
        :src="apiDetails.images?.large || card.imageUrl"
        alt="Card Image"
        class="w-full md:w-1/3 h-auto object-contain mb-4 md:mb-0 md:mr-6 rounded"
      />
      <div class="flex-1">
        <h1 class="text-2xl font-bold mb-2">
          {{ apiDetails.name || card.name }}
        </h1>
        <p class="mb-2"><strong>Price:</strong> {{ marketPrice }}</p>
        <p class="mb-2"><strong>HP:</strong> {{ apiDetails.hp || 'N/A' }}</p>
        <p class="mb-2">
          <strong>Evolves From:</strong> {{ apiDetails.evolvesFrom || 'N/A' }}
        </p>
        <p class="mb-2">
          <strong>Set:</strong>
          {{ apiDetails.set?.name || card.setName || 'N/A' }}
        </p>
        <p class="mb-2">
          <strong>Type:</strong>
          {{ apiDetails.types ? apiDetails.types.join(', ') : 'N/A' }}
        </p>
        <p class="mb-2">
          <strong>Rarity:</strong>
          {{ apiDetails.rarity || 'N/A' }}
        </p>
        <p class="mb-2">
          <strong>Description:</strong>
          {{ apiDetails.flavorText || card.description || 'N/A' }}
        </p>

        <!-- Abilities -->
        <div class="mb-2">
          <strong>Abilities:</strong>
          <ul
            v-if="apiDetails.abilities && apiDetails.abilities.length"
            class="list-disc list-inside"
          >
            <li v-for="(ability, index) in apiDetails.abilities" :key="index">
              <strong>{{ ability.name }}</strong
              >: {{ ability.text }}
            </li>
          </ul>
          <span v-else>N/A</span>
        </div>

        <!-- Attacks -->
        <div class="mb-2">
          <strong>Attacks:</strong>
          <ul
            v-if="apiDetails.attacks && apiDetails.attacks.length"
            class="list-disc list-inside"
          >
            <li v-for="(attack, index) in apiDetails.attacks" :key="index">
              {{ attack.name }}: {{ attack.text }} (Damage:
              {{ attack.damage || 'N/A' }})
            </li>
          </ul>
          <span v-else>N/A</span>
        </div>

        <!-- Weaknesses -->
        <div class="mb-2">
          <strong>Weaknesses:</strong>
          <ul
            v-if="apiDetails.weaknesses && apiDetails.weaknesses.length"
            class="list-disc list-inside"
          >
            <li v-for="(weakness, index) in apiDetails.weaknesses" :key="index">
              Type: {{ weakness.type }}, Value: {{ weakness.value }}
            </li>
          </ul>
          <span v-else>N/A</span>
        </div>

        <!-- Error Handling -->
        <div v-if="error" class="text-red-500 mt-2">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, defineProps, toRefs } from 'vue';

  const props = defineProps({
    card: {
      type: Object,
      required: true,
    },
    apiDetails: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  });

  const { card, apiDetails } = toRefs(props);

  const marketPrice = computed(() => {
    if (apiDetails.value.tcgplayer?.prices?.holofoil?.market !== undefined) {
      return `$${apiDetails.value.tcgplayer.prices.holofoil.market.toFixed(2)}`;
    } else if (
      apiDetails.value.tcgplayer?.prices?.normal?.market !== undefined
    ) {
      return `$${apiDetails.value.tcgplayer.prices.normal.market.toFixed(2)}`;
    } else {
      return 'N/A';
    }
  });
</script>
