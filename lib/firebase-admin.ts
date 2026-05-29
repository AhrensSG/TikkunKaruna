import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

let _storage: ReturnType<typeof getStorage> | null = null

export function getAdminStorage() {
  if (_storage) return _storage

  const projectId   = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Faltan variables de entorno del Admin SDK de Firebase. ' +
      'Añade FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL y FIREBASE_ADMIN_PRIVATE_KEY en .env.local'
    )
  }

  const app =
    getApps().find((a) => a.name === 'admin') ??
    initializeApp(
      {
        credential: cert({ projectId, clientEmail, privateKey }),
        storageBucket: 'tikkun-karuna.firebasestorage.app',
      },
      'admin'
    )

  _storage = getStorage(app)
  return _storage
}
