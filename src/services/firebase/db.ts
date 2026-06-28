import { seedCampusDrives, seedCandidates, seedInterviews, seedJobs, seedNotifications } from '@/data/seed';
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { firestore, hasFirebaseConfig } from '@/services/firebase/app';

type CollectionName = 'jobs' | 'candidates' | 'interviews' | 'campusDrives' | 'notifications' | 'recruiterProfiles';

const seedData: Record<CollectionName, unknown[]> = {
  jobs: seedJobs,
  candidates: seedCandidates,
  interviews: seedInterviews,
  campusDrives: seedCampusDrives,
  notifications: seedNotifications,
  recruiterProfiles: [],
};

const storageKey = (key: string) => `recruiter_app_${key}`;

export const ensureSeedData = () => {
  if (hasFirebaseConfig) {
    return;
  }

  (Object.keys(seedData) as CollectionName[]).forEach((key) => {
    if (!localStorage.getItem(storageKey(key))) {
      localStorage.setItem(storageKey(key), JSON.stringify(seedData[key]));
    }
  });
};

const getStorage = (key: string) => {
  ensureSeedData();
  const data = localStorage.getItem(storageKey(key));
  return data ? JSON.parse(data) : [];
};

const setStorage = <T,>(key: string, data: T[]) => {
  localStorage.setItem(storageKey(key), JSON.stringify(data));
};

export const db = {
  collection: (name: string) => ({
    getDocs: async () => {
      if (firestore) {
        const snapshot = await getDocs(collection(firestore, name));
        return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      }

      return getStorage(name);
    },
    addDoc: async <T extends object>(data: T) => {
      if (firestore) {
        const created = await addDoc(collection(firestore, name), data);
        return { id: created.id, ...data };
      }

      const items = getStorage(name);
      const newItem = { id: Math.random().toString(36).substr(2, 9), ...data };
      setStorage(name, [...items, newItem]);
      return newItem;
    },
    updateDoc: async <T extends object>(id: string, data: Partial<T>) => {
      if (firestore) {
        await setDoc(doc(firestore, name, id), data, { merge: true });
        return;
      }

      const items = getStorage(name);
      const index = items.findIndex((item: { id: string }) => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...data };
        setStorage(name, items);
      }
    },
    deleteDoc: async (id: string) => {
      if (firestore) {
        await deleteDoc(doc(firestore, name, id));
        return;
      }

      const items = getStorage(name);
      setStorage(name, items.filter((item: { id: string }) => item.id !== id));
    }
  })
};

export const seedFirestoreData = async () => {
  const activeFirestore = firestore;

  if (!activeFirestore) {
    ensureSeedData();
    return;
  }

  await Promise.all(
    (Object.keys(seedData) as CollectionName[]).flatMap((collectionName) =>
      seedData[collectionName].map((item) => {
        const record = item as { id: string };
        return setDoc(doc(activeFirestore, collectionName, record.id), record, { merge: true });
      }),
    ),
  );
};
