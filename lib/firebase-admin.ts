import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

let serviceAccount: Record<string, unknown> | undefined
try {
  serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined
} catch {
  console.error('[firebase-admin] Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON')
  serviceAccount = undefined
}

const app =
  getApps().length === 0
    ? initializeApp(
        Object.assign(
          { storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET },
          serviceAccount ? { credential: cert(serviceAccount) } : {},
        ),
      )
    : getApps()[0]

export const adminBucket = getStorage(app).bucket()
