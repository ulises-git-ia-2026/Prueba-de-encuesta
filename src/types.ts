export interface SurveyParams {
  empresa: string;
  docente: string;
  capacitacion: string;
  modulo: string;
  tema: string;
  fecha: string;
  horario: string;
  sesionNumero: number;
}

export type NPSCategory = 'promotor' | 'pasivo' | 'detractor';

export interface SurveyResponse {
  id: string;
  timestamp: string; // ISO string
  empresa: string;
  docente: string;
  capacitacion: string;
  modulo: string;
  tema: string;
  fecha: string;
  horario: string;
  sesionNumero: number;

  // NPS principal (0 a 10)
  npsScore: number;
  npsCategory: NPSCategory;

  // Evaluación docente (1 a 5)
  claridadDocente: number;
  dominioTema: number;
  dinamismoRitmo: number;
  predisposicionDudas: number;

  // Contenido y aplicabilidad (1 a 5)
  utilidadLaboral: number;
  calidadMateriales: number;
  nivelDificultad: 'Muy básico' | 'Adecuado y equilibrado' | 'Exigente pero alcanzable' | 'Muy avanzado';

  // Preguntas abiertas
  loMasValioso: string;
  sugerenciasParaPablo: string;

  // Participante
  areaParticipante: string;
  nombreParticipante?: string;
}

export interface DaySession {
  numero: number;
  titulo: string;
  tema: string;
  fecha: string;
  horario: string;
  descripcion: string;
}
