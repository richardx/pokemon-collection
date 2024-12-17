import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const apiClient = axios.create({
  baseURL: 'https://api.pokemontcg.io/v2',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'ca3e5438-19ef-4c4c-a170-c86579da4995',
  },
});

export default {
  getCards(params) {
    return apiClient.get('/cards', { params });
  },
  getCard(id) {
    return apiClient.get(`/cards/${id}`);
  },
  getSets() {
    return apiClient.get('/sets');
  },
  getSet(id) {
    return apiClient.get(`/sets/${id}`);
  },
};

// Ekstra funktioner til at håndtere kortdata
export const fetchCardFromCollection = async (
  userId,
  cardId,
  collectionPath
) => {
  const cardDocRef = doc(db, 'users', userId, collectionPath, cardId);
  const cardDoc = await getDoc(cardDocRef);

  if (cardDoc.exists()) {
    return cardDoc.data();
  } else {
    throw new Error('Card not found in collection.');
  }
};
