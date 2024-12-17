import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import pokemonService from './pokemonService';

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

export const fetchApiDetails = async (apiId) => {
  const apiResponse = await pokemonService.getCard(apiId);
  if (apiResponse.data && apiResponse.data.data) {
    return apiResponse.data.data;
  } else {
    throw new Error('Card details not found in API.');
  }
};

export const fetchCardFromApi = async (cardId) => {
  const apiResponse = await pokemonService.getCard(cardId);
  if (apiResponse.data && apiResponse.data.data) {
    return apiResponse.data.data;
  } else {
    throw new Error('Card details not found in API.');
  }
};
