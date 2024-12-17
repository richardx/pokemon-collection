import { useUserStore } from '@/store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/main.css';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

// Auth state observer
const auth = getAuth();
const userStore = useUserStore();

onAuthStateChanged(auth, (currentUser) => {
  userStore.setUser(currentUser);
  userStore.isAuthReady = true;
});

// Mount the app only after auth state is known
app.mount('#app');
