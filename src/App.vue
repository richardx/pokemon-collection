<template>
  <div
    :class="{ dark: isDarkMode }"
    id="app"
    class="min-h-screen flex flex-col"
  >
    <AppNavbar />
    <!-- Main Content Area -->
    <main class="flex-grow bg-white dark:bg-gray-900">
      <!-- Loading Indicator -->
      <div v-if="!isAuthReady" class="flex justify-center items-center h-full">
        <span class="text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
      <!-- Router View -->
      <div v-else>
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
  import AppNavbar from './components/AppNavbar.vue';
  import { useUserStore } from './store';

  export default {
    components: {
      AppNavbar,
    },
    computed: {
      // Access the Pinia store's isAuthReady state
      isAuthReady() {
        const userStore = useUserStore();
        return userStore.isAuthReady;
      },
      isDarkMode() {
        const userStore = useUserStore();
        return userStore.isDarkMode;
      },
    },
  };
</script>
