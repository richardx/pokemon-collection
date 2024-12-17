<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
  >
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md"
    >
      <h1
        class="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100"
      >
        Login
      </h1>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-gray-700 dark:text-gray-300">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-300"
            >Adgangskode</label
          >
          <input
            v-model="password"
            type="password"
            placeholder="Adgangskode"
            required
            class="w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
        <p class="text-center text-gray-700 dark:text-gray-300">
          Har du ikke en konto?
          <router-link
            to="/registerUser"
            class="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Opret en her
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { auth } from '../firebase';

  export default {
    name: 'LoginUser',
    setup() {
      const email = ref('');
      const password = ref('');
      const router = useRouter();

      const login = async () => {
        try {
          await signInWithEmailAndPassword(auth, email.value, password.value);
          router.push({ name: 'MyCollection' });
        } catch (error) {
          console.error(error);
        }
      };

      return {
        email,
        password,
        login,
      };
    },
  };
</script>
