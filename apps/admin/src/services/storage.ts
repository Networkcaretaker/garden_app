import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

// Update return type to include path
export const uploadImage = async (file: Blob, folder: string = 'uploads', customName?: string): Promise<{ url: string; path: string }> => {
  const filename = customName || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;
  // Construct the full path (e.g. project-images/123/abc.webp)
  const fullPath = `${folder}/${filename}`;
  
  const storageRef = ref(storage, fullPath);

  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  // Return both
  return { url, path: fullPath };
};