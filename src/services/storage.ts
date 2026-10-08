import { SurveyResponse, SurveyParams } from '../types';
import { INITIAL_RESPONSES_MODULO_1, CAPACITACION_INFO } from '../data/mockData';
import { sanitizeInputText } from './security';
import { saveSurveyToFirebase } from './firebase';

// Clave limpia para producción (sin datos falsos de prueba)
const STORAGE_KEY = 'lacelada_respuestas_reales_v2';

export function getStoredResponses(): SurveyResponse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return parsed;
  } catch (e) {
    console.error('Error reading responses from localStorage', e);
    return [];
  }
}

export function saveResponse(newResponse: SurveyResponse): SurveyResponse[] {
  // Aplicar sanitización estricta para evitar inyecciones XSS y código malicioso
  const sanitized: SurveyResponse = {
    ...newResponse,
    loMasValioso: sanitizeInputText(newResponse.loMasValioso, 1000),
    sugerenciasParaPablo: sanitizeInputText(newResponse.sugerenciasParaPablo, 1000),
    nombreParticipante: sanitizeInputText(newResponse.nombreParticipante || '', 64)
  };

  const current = getStoredResponses();
  const updated = [sanitized, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Sincronizar en segundo plano con Firebase Firestore
  saveSurveyToFirebase(sanitized).catch((err) => {
    console.warn('Sincronización Firebase en segundo plano:', err);
  });

  return updated;
}

export function resetResponsesToDefault(): SurveyResponse[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  return [];
}

export function parseUrlSurveyParams(): SurveyParams {
  const searchParams = new URLSearchParams(window.location.search);

  return {
    empresa: searchParams.get('empresa') || CAPACITACION_INFO.empresa,
    docente: searchParams.get('docente') || searchParams.get('capacitador') || CAPACITACION_INFO.docente,
    capacitacion: searchParams.get('capacitacion') || CAPACITACION_INFO.titulo,
    modulo: searchParams.get('modulo') || CAPACITACION_INFO.moduloTitulo,
    tema: searchParams.get('tema') || CAPACITACION_INFO.copeteResumido,
    fecha: searchParams.get('fecha') || CAPACITACION_INFO.fecha,
    horario: searchParams.get('horario') || CAPACITACION_INFO.horario,
    sesionNumero: 1
  };
}

export const DEV_APP_URL = 'https://ais-dev-mcog3srqcrsjueaqxmesl5-854018073830.us-east1.run.app';
export const PREVIEW_SHARED_URL = 'https://ais-pre-mcog3srqcrsjueaqxmesl5-854018073830.us-east1.run.app';

export function getEffectiveBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin;
    if (origin && origin !== 'null' && origin !== 'about:blank') {
      return origin;
    }
  }
  return DEV_APP_URL;
}

// Genera el enlace ultra-corto para que sea fácil de pasar por WhatsApp
export function buildOfficialSurveyUrl(overrideBaseUrl?: string, isStudentOnly = true): string {
  const base = overrideBaseUrl?.trim() || getEffectiveBaseUrl();
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const cleanBase = base.replace(/\/+$/, '');
  const cleanPath = path && path !== '/' ? path : '';

  // Enlace ultra-corto: ?m1 (Módulo 1)
  const shortQuery = isStudentOnly ? 'm1' : 'admin';

  return `${cleanBase}${cleanPath}?${shortQuery}`;
}

export function exportResponsesToCSV(responses: SurveyResponse[]) {
  if (responses.length === 0) return;

  const headers = [
    'ID',
    'Fecha_Hora_Envio',
    'Empresa',
    'Capacitador',
    'Programa',
    'Modulo',
    'Tema',
    'Fecha_Clase',
    'Horario',
    'Participante',
    'Area_La_Celada',
    'NPS_Score_0_10',
    'NPS_Categoria',
    'Docente_Claridad_1_5',
    'Docente_Dominio_1_5',
    'Docente_Ritmo_1_5',
    'Docente_Predisposicion_1_5',
    'Contenido_Utilidad_1_5',
    'Contenido_Materiales_1_5',
    'Nivel_Dificultad',
    'Lo_Mas_Valioso',
    'Sugerencias_Para_Pablo'
  ];

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = responses.map(r => [
    escapeCSV(r.id),
    escapeCSV(r.timestamp),
    escapeCSV(r.empresa),
    escapeCSV(r.docente),
    escapeCSV(r.capacitacion),
    escapeCSV(r.modulo),
    escapeCSV(r.tema),
    escapeCSV(r.fecha),
    escapeCSV(r.horario),
    escapeCSV(r.nombreParticipante || 'Anónimo'),
    escapeCSV(r.areaParticipante),
    r.npsScore,
    escapeCSV(r.npsCategory),
    r.claridadDocente,
    r.dominioTema,
    r.dinamismoRitmo,
    r.predisposicionDudas,
    r.utilidadLaboral,
    r.calidadMateriales,
    escapeCSV(r.nivelDificultad),
    escapeCSV(r.loMasValioso),
    escapeCSV(r.sugerenciasParaPablo)
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `encuesta_la_celada_modulo1_pablo_santoro_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
