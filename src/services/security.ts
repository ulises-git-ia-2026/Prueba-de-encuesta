/**
 * Módulo de Seguridad Informática y Protección de Datos
 * Basado en las directrices de Pablo Santoro (Sysadmin) - Plan de Capacitación en IA (Pág. 8)
 */

// Sanitiza texto para evitar inyecciones XSS, scripts y código malicioso
export function sanitizeInputText(input: string, maxLength = 1000): string {
  if (!input || typeof input !== 'string') return '';

  let cleaned = input.trim();

  // Eliminar etiquetas HTML peligrosas (script, iframe, style, object, embed, etc.)
  cleaned = cleaned.replace(/<[^>]*>?/gm, '');

  // Truncar longitud para evitar ataques de desbordamiento o agotamiento de recursos (DoS)
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }

  // Sanitizar caracteres de control o inyecciones
  cleaned = cleaned.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '');

  return cleaned;
}

// Filtro de Protección de Datos Confidenciales (Regla "NUNCA" de la página 8 del plan)
export interface SecurityAuditResult {
  isSafe: boolean;
  warning?: string;
}

export function auditConfidentialData(text: string): SecurityAuditResult {
  if (!text) return { isSafe: true };

  const lower = text.toLowerCase();

  // Detección de posibles contraseñas o tokens
  if (/\b(password|contraseña|clave|token|secret|jwt)\s*[:=]\s*\S+/i.test(text)) {
    return {
      isSafe: false,
      warning: '⚠️ Por seguridad de La Celada, no incluyas contraseñas ni claves de acceso en las respuestas.'
    };
  }

  // Detección de números de tarjeta de crédito (patrones de 16 dígitos)
  if (/\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/.test(text)) {
    return {
      isSafe: false,
      warning: '⚠️ Se detectó información numérica sensible. No ingreses números de tarjetas ni cuentas bancarias.'
    };
  }

  return { isSafe: true };
}

// Rate limiter en cliente para prevenir spam o flood
const SUBMISSION_COOLDOWN_KEY = 'lacelada_last_submission_ts';
const MIN_COOLDOWN_SECONDS = 15;

export function checkSubmissionRateLimit(): { allowed: boolean; waitSeconds?: number } {
  try {
    const last = localStorage.getItem(SUBMISSION_COOLDOWN_KEY);
    if (!last) return { allowed: true };

    const lastTs = parseInt(last, 10);
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - lastTs) / 1000);

    if (elapsedSeconds < MIN_COOLDOWN_SECONDS) {
      return {
        allowed: false,
        waitSeconds: MIN_COOLDOWN_SECONDS - elapsedSeconds
      };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

export function recordSubmissionTimestamp() {
  try {
    localStorage.setItem(SUBMISSION_COOLDOWN_KEY, Date.now().toString());
  } catch {
    // Ignore storage issues
  }
}
