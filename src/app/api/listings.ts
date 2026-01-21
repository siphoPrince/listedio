import { db } from '@/firebase'
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore'

export interface Listing {
  id?: string
  ownerUid: string
  title: string
  description?: string
  price?: number
  imageUrl?: string
  status?: string
  createdAt?: any
}

export async function createListing(listing: Omit<Listing, 'id' | 'createdAt'>) {
  const col = collection(db, 'listings')
  const docRef = await addDoc(col, { ...listing, createdAt: serverTimestamp() })
  return docRef.id
}

export function listenUserListings(userUid: string, cb: (items: Listing[]) => void) {
  const q = query(
    collection(db, 'listings'),
    where('ownerUid', '==', userUid),
    orderBy('createdAt', 'desc')
  )
  const unsub = onSnapshot(q, (snapshot) => {
    const items: Listing[] = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) }))
    cb(items)
  })
  return unsub
}
