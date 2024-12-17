import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const isAuthReady = ref(false);
  const isDarkMode = ref(
    JSON.parse(localStorage.getItem('isDarkMode')) !== null
      ? JSON.parse(localStorage.getItem('isDarkMode'))
      : true
  );

  const setUser = (newUser) => {
    user.value = newUser;
  };

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode.value));
  };

  return {
    user,
    isAuthReady,
    isDarkMode,
    setUser,
    toggleDarkMode,
  };
});
