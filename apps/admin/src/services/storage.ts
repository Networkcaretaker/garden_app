import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const uploadImage = async (file: Blob, folder: string = 'uploads'): Promise<string> => {
  // Create a unique filename: timestamp-random.webp
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
  const storageRef = ref(storage, `${folder}/${filename}`);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return url;
};