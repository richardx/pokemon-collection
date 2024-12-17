<template>
  <nav class="bg-white dark:bg-gray-900 shadow-md">
    <div class="w-full px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <img src="@/assets/pokeball.png" alt="Logo" class="h-8 w-8 mr-2" />
          <span class="text-2xl font-bold text-gray-800 dark:text-white">
            Pokémon Collection
          </span>
        </router-link>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex space-x-8">
          <router-link
            to="/MyCollection"
            class="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-300"
            active-class="font-semibold"
          >
            Collection
          </router-link>
          <router-link
            to="/wishlist"
            class="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-300"
            active-class="font-semibold"
          >
            Wishlist
          </router-link>
          <router-link
            to="/sets"
            class="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-300"
            active-class="font-semibold"
          >
            Sets
          </router-link>
          <router-link
            to="/profile"
            class="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-300"
            active-class="font-semibold"
          >
            Profile
          </router-link>
          <router-link
            to="/scan"
            class="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-300"
            active-class="font-semibold"
          >
            Scan
          </router-link>
        </div>

        <!-- Desktop Dark Mode Toggle and Logout Button -->
        <div class="hidden md:flex items-center space-x-4">
          <button @click="toggleDarkMode" class="focus:outline-none">
            <span v-if="!isDarkMode">🌞</span>
            <span v-else>🌙</span>
          </button>
          <button
            v-if="user"
            @click="logout"
            class="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-300 px-3 py-2 rounded-md"
          >
            Logud
          </button>
        </div>

        <!-- Mobile Dark Mode Toggle and Hamburger Menu -->
        <div class="flex items-center space-x-4 md:hidden">
          <button @click="toggleDarkMode" class="focus:outline-none">
            <span v-if="!isDarkMode">🌞</span>
            <span v-else>🌙</span>
          </button>
          <button
            @click="toggleMenu"
            class="text-gray-600 dark:text-gray-300 focus:outline-none"
            aria-label="Menu"
            :aria-expanded="isMenuOpen.toString()"
          >
            <svg
              v-if="!isMenuOpen"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="md:hidden">
        <router-link
          to="/MyCollection"
          class="block px-2 py-1 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          active-class="font-semibold"
          @click="toggleMenu"
        >
          Collection
        </router-link>
        <router-link
          to="/wishlist"
          class="block px-2 py-1 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          active-class="font-semibold"
          @click="toggleMenu"
        >
          Wishlist
        </router-link>
        <router-link
          to="/sets"
          class="block px-2 py-1 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          active-class="font-semibold"
          @click="toggleMenu"
        >
          Sets
        </router-link>
        <router-link
          to="/profile"
          class="block px-2 py-1 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          active-class="font-semibold"
          @click="toggleMenu"
        >
          Profile
        </router-link>
        <router-link
          to="/scan"
          class="block px-2 py-1 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          active-class="font-semibold"
          @click="toggleMenu"
        >
          Scan
        </router-link>
        <!-- Mobile Logout Button -->
        <button
          v-if="user"
          @click="logout"
          class="w-full text-left px-2 py-1 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Logud
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
  import { auth } from '@/firebase';
  import { useUserStore } from '@/store';
  import { signOut } from 'firebase/auth';

  export default {
    name: 'AppNavbar',
    data() {
      return {
        isMenuOpen: false, // Tilstandsvariabel for mobile menu
      };
    },
    computed: {
      user() {
        const userStore = useUserStore();
        return userStore.user;
      },
      isDarkMode() {
        const userStore = useUserStore();
        return userStore.isDarkMode;
      },
    },
    methods: {
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
      toggleDarkMode() {
        const userStore = useUserStore();
        userStore.toggleDarkMode();
      },
      logout() {
        signOut(auth)
          .then(() => {
            const userStore = useUserStore();
            userStore.setUser(null);
            this.$router.push({ name: 'LoginUser' });
          })
          .catch((error) => {
            console.error('Logout fejlede:', error);
          });
      },
    },
  };
</script>
