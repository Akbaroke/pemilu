import { addDoc, collection, doc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';
import app from './init';
import bcrypt from 'bcrypt';
import { UserData } from '@/interfaces/auth';

const firestore = getFirestore(app);

export async function retrieveData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

export async function signUp(userData: UserData, callback: Function) {
  const q = query(collection(firestore, 'users'), where('email', '==', userData.email));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (data.length > 0) {
    callback({
      status: false,
      message: 'Email sudah terdaftar',
    });
  } else {
    userData.password = await bcrypt.hash(userData.password, 10);
    await addDoc(collection(firestore, 'users'), userData)
      .then(() => {
        callback({
          status: true,
          message: 'Register Berhasil',
        });
      })
      .catch((error) => {
        callback({
          status: false,
          message: error,
        });
      });
  }
}

export async function signInWithGoogle(userData: any, callback: Function) {
  const q = query(collection(firestore, 'users'), where('email', '==', userData.email));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data.length > 0) {
    await updateDoc(doc(firestore, 'users', data[0].id), userData)
      .then(() => {
        callback({
          status: true,
          message: 'Masuk dengan google berhasil',
          data: userData,
        });
      })
      .catch(() => {
        callback({
          status: false,
          message: 'Masuk dengan google gagal',
        });
      });
  } else {
    await addDoc(collection(firestore, 'users'), userData)
      .then(() => {
        callback({
          status: true,
          message: 'Masuk dengan google berhasil',
          data: userData,
        });
      })
      .catch(() => {
        callback({
          status: false,
          message: 'Masuk dengan google gagal',
        });
      });
  }
}

export async function signIn(userData: { email: string }) {
  const q = query(collection(firestore, 'users'), where('email', '==', userData.email));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (data) {
    return data[0];
  } else {
    return null;
  }
}
