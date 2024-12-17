<template>
  <div
    class="container mx-auto p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200"
  >
    <h1 class="text-3xl font-bold mb-6">Settings</h1>

    <!-- Logout Section -->
    <section class="mt-12">
      <h2 class="text-xl font-semibold mb-2">Logout</h2>
      <button
        @click="logout"
        class="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </section>

    <!-- Email Address Section -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Email Address</h2>
      <p class="mb-4">
        Your email address is <span class="font-medium">{{ user.email }}</span>
      </p>
      <button
        @click="openEmailModal"
        class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
      >
        Change Email
      </button>

      <!-- Change Email Modal -->
      <div
        v-if="isEmailModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
          <h3 class="text-xl font-semibold mb-4">Change Email</h3>
          <form @submit.prevent="updateEmail">
            <div class="mb-4">
              <label class="block mb-1" for="newEmail">New Email Address</label>
              <input
                v-model="newEmail"
                type="email"
                id="newEmail"
                required
                class="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div class="flex justify-end">
              <button
                type="button"
                @click="closeEmailModal"
                class="px-4 py-2 mr-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
          <div v-if="emailError" class="mt-4 text-red-500">
            {{ emailError }}
          </div>
          <div v-if="emailSuccess" class="mt-4 text-green-500">
            {{ emailSuccess }}
          </div>
        </div>
      </div>
    </section>

    <!-- Password Section -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Password</h2>
      <form @submit.prevent="handleUpdatePassword">
        <div class="mb-4">
          <label class="block mb-1" for="currentPassword"
            >Current Password</label
          >
          <input
            v-model="currentPassword"
            type="password"
            id="currentPassword"
            required
            class="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1" for="newPassword">New Password</label>
          <input
            v-model="newPassword"
            type="password"
            id="newPassword"
            required
            class="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          Update Password
        </button>
      </form>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Can't remember your current password?
        <router-link
          to="/recover"
          class="text-blue-500 dark:text-blue-400 hover:underline"
        >
          Recover Account
        </router-link>
      </p>
      <div v-if="passwordError" class="mt-4 text-red-500">
        {{ passwordError }}
      </div>
      <div v-if="passwordSuccess" class="mt-4 text-green-500">
        {{ passwordSuccess }}
      </div>
    </section>

    <!-- Delete Account Section -->
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-2 text-red-500">Delete Account</h2>
      <p class="mb-4 text-gray-700 dark:text-gray-300">
        Proceed with caution. Make sure you have taken a backup of your account
        in case you ever need to get access to your data. We will completely
        wipe your data. There is no way to access your account after this
        action.
      </p>
      <button
        @click="openDeleteModal"
        class="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
      >
        Delete Account
      </button>

      <!-- Delete Account Modal -->
      <div
        v-if="isDeleteModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
          <h3 class="text-xl font-semibold mb-4 text-red-500">
            Confirm Account Deletion
          </h3>
          <p class="mb-4">
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <div class="flex justify-end">
            <button
              type="button"
              @click="closeDeleteModal"
              class="px-4 py-2 mr-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="deleteAccount"
              class="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>
          </div>
          <div v-if="deleteError" class="mt-4 text-red-500">
            {{ deleteError }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
  import {
    deleteUser,
    EmailAuthProvider,
    updateEmail as firebaseUpdateEmail,
    reauthenticateWithCredential,
    signOut, // Imported with an alias to prevent conflicts
    updatePassword,
  } from 'firebase/auth';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { auth } from '../firebase'; // Ensure this path is correct
  import { useUserStore } from '../store';

  // State Management
  const userStore = useUserStore();
  const user = userStore.user;

  // Router
  const router = useRouter();

  // Email Management
  const isEmailModalOpen = ref(false);
  const newEmail = ref('');
  const emailError = ref('');
  const emailSuccess = ref('');

  const openEmailModal = () => {
    isEmailModalOpen.value = true;
    newEmail.value = '';
    emailError.value = '';
    emailSuccess.value = '';
  };

  const closeEmailModal = () => {
    isEmailModalOpen.value = false;
  };

  // Password Management
  const currentPassword = ref('');
  const newPassword = ref('');
  const passwordError = ref('');
  const passwordSuccess = ref('');

  const handleUpdatePassword = async () => {
    passwordError.value = '';
    passwordSuccess.value = '';

    if (!currentPassword.value || !newPassword.value) {
      passwordError.value = 'Both current and new passwords are required.';
      return;
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword.value
    );

    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword.value);
      passwordSuccess.value = 'Password updated successfully.';
      currentPassword.value = '';
      newPassword.value = '';
    } catch (error) {
      console.error('Error updating password:', error);
      passwordError.value = error.message || 'Failed to update password.';
    }
  };

  // Email Update
  const updateEmail = async () => {
    // Renamed from updateEmailAddress to avoid conflict
    emailError.value = '';
    emailSuccess.value = '';

    if (!newEmail.value) {
      emailError.value = 'New email is required.';
      return;
    }

    try {
      await firebaseUpdateEmail(auth.currentUser, newEmail.value);
      userStore.setUser({ ...user, email: newEmail.value });
      emailSuccess.value = 'Email updated successfully.';
      closeEmailModal();
    } catch (error) {
      console.error('Error updating email:', error);
      emailError.value = error.message || 'Failed to update email.';
    }
  };

  // Delete Account Management
  const isDeleteModalOpen = ref(false);
  const deleteError = ref('');

  const openDeleteModal = () => {
    isDeleteModalOpen.value = true;
    deleteError.value = '';
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
  };

  const deleteAccount = async () => {
    deleteError.value = '';

    try {
      await deleteUser(auth.currentUser);
      userStore.setUser(null);
      router.push({ name: 'RegisterUser' });
    } catch (error) {
      console.error('Error deleting account:', error);
      deleteError.value = error.message || 'Failed to delete account.';
    }
  };

  // Logout Functionality
  const logout = async () => {
    try {
      await signOut(auth);
      userStore.setUser(null);
      router.push({ name: 'LoginUser' }); // Sørg for, at rutenavn matcher din router-konfiguration
    } catch (error) {
      console.error('Logout error:', error);
      // Valgfrit: Håndter fejlen, fx ved at vise en notifikation
    }
  };

  // Close modals when route changes (optional)
  router.afterEach(() => {
    isEmailModalOpen.value = false;
    isDeleteModalOpen.value = false;
  });
</script>
