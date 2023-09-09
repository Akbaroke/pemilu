import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import app from './init'
import crypto from 'crypto'
import { UserData } from '@/interfaces/auth'

const firestore = getFirestore(app)

export async function getMyPemilu(email: string) {
  const q = query(collection(firestore, 'pemilu'), where('emailUserCreated', '==', email))
  const snapshot = await getDocs(q)
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))

  return data
}
export async function getPemiluBySearch(key: string) {
  const snapshot = await getDocs(collection(firestore, 'pemilu'))
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))

  // Filter data berdasarkan kata kunci
  const filteredData = data.filter((item: any) => {
    const searchData = `${item.name} ${item.slug}`.toLowerCase()
    return searchData.includes(key.toLowerCase())
  })

  return filteredData
}

export async function getPemiluBySlug(slug: string) {
  const q = query(collection(firestore, 'pemilu'), where('slug', '==', slug))
  const snapshot = await getDocs(q)
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))

  return data[0]
}

export async function signUp(userData: UserData, callback: Function) {
  const q = query(collection(firestore, 'users'), where('email', '==', userData.email))
  const snapshot = await getDocs(q)
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
  if (data.length > 0) {
    callback({
      status: false,
      message: 'Email sudah terdaftar',
    })
  } else {
    const salt = process.env.NEXT_PUBLIC_SALT as string
    const hashedPassword = crypto
      .createHmac('sha256', salt)
      .update(userData.password)
      .digest('hex')
    userData.password = hashedPassword
    await addDoc(collection(firestore, 'users'), userData)
      .then(() => {
        callback({
          status: true,
          message: 'Register Berhasil',
        })
      })
      .catch(error => {
        callback({
          status: false,
          message: error,
        })
      })
  }
}

export async function signInWithGoogle(userData: any, callback: Function) {
  const q = query(collection(firestore, 'users'), where('email', '==', userData.email))
  const snapshot = await getDocs(q)
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))

  if (data.length > 0) {
    await updateDoc(doc(firestore, 'users', data[0].id), userData)
      .then(() => {
        callback({
          status: true,
          message: 'Masuk dengan google berhasil',
          data: userData,
        })
      })
      .catch(() => {
        callback({
          status: false,
          message: 'Masuk dengan google gagal',
        })
      })
  } else {
    await addDoc(collection(firestore, 'users'), userData)
      .then(() => {
        callback({
          status: true,
          message: 'Masuk dengan google berhasil',
          data: userData,
        })
      })
      .catch(() => {
        callback({
          status: false,
          message: 'Masuk dengan google gagal',
        })
      })
  }
}

export async function signIn(userData: { email: string }) {
  const q = query(collection(firestore, 'users'), where('email', '==', userData.email))
  const snapshot = await getDocs(q)
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }))
  if (data) {
    return data[0]
  } else {
    return null
  }
}
