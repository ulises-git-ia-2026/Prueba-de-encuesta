/**
 * Servicio de Conexión a Firebase Firestore
 * Compatible con la configuración de Google Cloud y fallback seguro
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';
import { SurveyResponse } from '../types';
import { sanitizeInputText } from './security';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path
  };
  console.warn('Firestore Notice: ', JSON.stringify(errInfo));
}

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

// Inicializa Firebase si existen credenciales o en entorno configurado
export function initializeFirebaseService(): { isConnected: boolean; db: Firestore | null } {
  try {
    if (getApps().length > 0) {
      firebaseApp = getApps()[0];
      firestoreDb = getFirestore(firebaseApp);
      return { isConnected: true, db: firestoreDb };
    }

    // Configuración base de Firebase (inyectable o estándar de Google Cloud)
    const envApiKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY;
    const envProjectId = (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID;

    if (envApiKey && envProjectId) {
      firebaseApp = initializeApp({
        apiKey: envApiKey,
        projectId: envProjectId,
        authDomain: `${envProjectId}.firebaseapp.com`
      });
      firestoreDb = getFirestore(firebaseApp);
      return { isConnected: true, db: firestoreDb };
    }

    return { isConnected: false, db: null };
  } catch (err) {
    console.warn('Firebase en modo local seguro:', err);
    return { isConnected: false, db: null };
  }
}

// Guarda una respuesta en Firebase con sanitización y respaldo local
export async function saveSurveyToFirebase(response: SurveyResponse): Promise<boolean> {
  const sanitizedResponse: SurveyResponse = {
    ...response,
    loMasValioso: sanitizeInputText(response.loMasValioso, 1000),
    sugerenciasParaPablo: sanitizeInputText(response.sugerenciasParaPablo, 1000),
    nombreParticipante: sanitizeInputText(response.nombreParticipante || '', 64)
  };

  const { isConnected, db } = initializeFirebaseService();

  if (isConnected && db) {
    try {
      const docRef = doc(db, 'encuestas_modulo1', sanitizedResponse.id);
      await setDoc(docRef, sanitizedResponse);
      return true;
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `encuestas_modulo1/${sanitizedResponse.id}`);
      return false;
    }
  }

  return false;
}
