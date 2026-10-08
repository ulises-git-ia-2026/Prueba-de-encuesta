import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Star, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  UserCheck, 
  Calendar, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  MessageSquare,
  QrCode
} from 'lucide-react';
import { SurveyParams, SurveyResponse, NPSCategory } from '../types';
import { AREAS_LA_CELADA, CAPACITACION_INFO } from '../data/mockData';
import { JoinLogo } from './JoinLogo';
import { auditConfidentialData, checkSubmissionRateLimit, recordSubmissionTimestamp } from '../services/security';

interface SurveyFormProps {
  params: SurveyParams;
  onSubmitSuccess: (response: SurveyResponse) => void;
  onGoToAnalytics: () => void;
  onGoToShare: () => void;
  isStudentView?: boolean;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({
  params,
  onSubmitSuccess,
  onGoToAnalytics,
  onGoToShare,
  isStudentView = false
}) => {
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [claridad, setClaridad] = useState<number>(5);
  const [dominio, setDominio] = useState<number>(5);
  const [ritmo, setRitmo] = useState<number>(5);
  const [predisposicion, setPredisposicion] = useState<number>(5);
  const [utilidad, setUtilidad] = useState<number>(5);
  const [materiales, setMateriales] = useState<number>(5);
  const [dificultad, setDificultad] = useState<'Muy básico' | 'Adecuado y equilibrado' | 'Exigente pero alcanzable' | 'Muy avanzado'>('Adecuado y equilibrado');
  
  const [loMasValioso, setLoMasValioso] = useState('');
  const [sugerencias, setSugerencias] = useState('');
  const [area, setArea] = useState(AREAS_LA_CELADA[0]);
  const [nombre, setNombre] = useState('');
  const [isAnonimo, setIsAnonimo] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const getNpsCategory = (val: number): NPSCategory => {
    if (val >= 9) return 'promotor';
    if (val >= 7) return 'pasivo';
    return 'detractor';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (npsScore === null) {
      setErrorMsg('Por favor seleccioná una puntuación de recomendación (0 al 10) para continuar.');
      window.scrollTo({ top: 380, behavior: 'smooth' });
      return;
    }

    // Seguridad: Auditoría de datos confidenciales (Regla de Pablo Santoro - Pág. 8)
    const auditValioso = auditConfidentialData(loMasValioso);
    if (!auditValioso.isSafe) {
      setErrorMsg(auditValioso.warning || 'Información no permitida detectada.');
      return;
    }

    const auditSugerencias = auditConfidentialData(sugerencias);
    if (!auditSugerencias.isSafe) {
      setErrorMsg(auditSugerencias.warning || 'Información no permitida detectada.');
      return;
    }

    // Seguridad: Rate limiting contra spam y ataques de inundación (DoS)
    const rateCheck = checkSubmissionRateLimit();
    if (!rateCheck.allowed) {
      setErrorMsg(`Por favor esperá ${rateCheck.waitSeconds} segundos antes de enviar otra respuesta para proteger el servidor.`);
      return;
    }
    recordSubmissionTimestamp();

    const response: SurveyResponse = {
      id: `resp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      empresa: params.empresa,
      docente: params.docente,
      capacitacion: params.capacitacion,
      modulo: CAPACITACION_INFO.moduloTitulo,
      tema: CAPACITACION_INFO.moduloDescripcion,
      fecha: params.fecha,
      horario: params.horario,
      sesionNumero: 1,
      npsScore,
      npsCategory: getNpsCategory(npsScore),
      claridadDocente: claridad,
      dominioTema: dominio,
      dinamismoRitmo: ritmo,
      predisposicionDudas: predisposicion,
      utilidadLaboral: utilidad,
      calidadMateriales: materiales,
      nivelDificultad: dificultad,
      loMasValioso: loMasValioso.trim() || 'Muy clara la diferencia entre buscadores y los tipos de IA.',
      sugerenciasParaPablo: sugerencias.trim(),
      areaParticipante: area,
      nombreParticipante: isAnonimo ? 'Anónimo' : (nombre.trim() || 'Participante La Celada')
    };

    onSubmitSuccess(response);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const renderStarSelector = (
    label: string, 
    value: number, 
    onChange: (val: number) => void,
    helperText?: string
  ) => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors gap-2">
        <div>
          <span className="text-sm font-medium text-slate-200">{label}</span>
          {helperText && <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>}
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => onChange(star)}
              className="p-1 rounded-md hover:scale-110 transition-transform focus:outline-none cursor-pointer"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= value
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-xs font-semibold text-amber-400 min-w-[2.5rem]">
            {value} / 5
          </span>
        </div>
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/40 text-center shadow-2xl shadow-cyan-950/50">
        {/* JOIN Logo on top of card */}
        <div className="bg-white p-3 rounded-2xl max-w-[240px] mx-auto mb-6 shadow-md">
          <JoinLogo variant="compact" />
        </div>

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
          ¡Respuesta Registrada con Éxito!
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          ¡Muchas gracias por tu feedback!
        </h2>

        <p className="text-slate-300 text-sm mt-3 leading-relaxed max-w-lg mx-auto">
          Tus respuestas sobre el <strong className="text-cyan-300">Módulo 1</strong> con <strong className="text-white">{params.docente} (Sysadmin)</strong> ya forman parte del panel de análisis en tiempo real de <strong className="text-cyan-300">{params.empresa}</strong>.
        </p>

        <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 text-left text-xs text-slate-300 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Programa:</span>
            <span className="font-semibold text-white">{CAPACITACION_INFO.titulo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Sesión evaluada:</span>
            <span className="font-semibold text-cyan-300">{CAPACITACION_INFO.moduloTitulo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Horario:</span>
            <span className="font-semibold text-white">{params.horario} (Hoy)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Capacitador:</span>
            <span className="font-semibold text-amber-300">{params.docente}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {isStudentView ? (
            <div className="text-center py-2">
              <span className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>Podés cerrar esta ventana en tu celular. ¡Buen día!</span>
              </span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onGoToAnalytics}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Ver Análisis de Datos en Vivo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onGoToShare}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Ver QR & Enlace Oficial</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-6 px-4">
      {/* Session Header Card with training metadata & JOIN Logo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 border border-slate-750 p-6 sm:p-8 shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Encuesta de la 1ª Capacitación
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Nivel Inicial
            </span>
          </div>

          {/* JOIN Branding Badge */}
          <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm self-start sm:self-auto border border-slate-200">
            <JoinLogo variant="compact" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {CAPACITACION_INFO.moduloTitulo}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          {CAPACITACION_INFO.moduloDescripcion}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Empresa</p>
              <p className="font-semibold text-white">{params.empresa}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Capacitador</p>
              <p className="font-semibold text-white">{params.docente} (Sysadmin)</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Fecha</p>
              <p className="font-semibold text-white">{params.fecha}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Horario</p>
              <p className="font-semibold text-white">{params.horario}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
          ⏱️ Tiempo de respuesta: <strong>menos de 90 segundos</strong>. Tu devolución es anónima y ayuda a Pablo Santoro a adaptar los ejercicios de las siguientes clases en La Celada.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: NPS Principal */}
        <div className="p-6 rounded-2xl bg-slate-850/80 border border-slate-800 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Net Promoter Score (NPS)
            </h3>
          </div>
          <p className="text-sm text-slate-300 mb-4">
            ¿Con qué probabilidad recomendarías esta primera capacitación sobre herramientas de IA a un compañero de equipo en <strong>{params.empresa}</strong>?
          </p>

          {/* Scale 0 to 10 */}
          <div className="grid grid-cols-11 gap-1 sm:gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
              const isSelected = npsScore === score;
              let bgHover = 'hover:bg-slate-700';
              let badgeColor = 'text-slate-400';

              if (score <= 6) {
                badgeColor = 'hover:border-rose-500 hover:text-rose-400';
              } else if (score <= 8) {
                badgeColor = 'hover:border-amber-500 hover:text-amber-400';
              } else {
                badgeColor = 'hover:border-emerald-500 hover:text-emerald-400';
              }

              let selectedStyle = 'bg-slate-800 text-slate-300 border-slate-700';
              if (isSelected) {
                if (score <= 6) {
                  selectedStyle = 'bg-rose-500 text-white font-bold border-rose-400 scale-105 shadow-md shadow-rose-500/30';
                } else if (score <= 8) {
                  selectedStyle = 'bg-amber-500 text-slate-950 font-bold border-amber-400 scale-105 shadow-md shadow-amber-500/30';
                } else {
                  selectedStyle = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 scale-105 shadow-md shadow-emerald-500/30';
                }
              }

              return (
                <button
                  type="button"
                  key={score}
                  onClick={() => {
                    setNpsScore(score);
                    setErrorMsg('');
                  }}
                  className={`h-11 sm:h-12 rounded-xl flex items-center justify-center font-semibold text-sm sm:text-base border transition-all ${selectedStyle} ${bgHover} ${badgeColor} cursor-pointer`}
                >
                  {score}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[11px] sm:text-xs text-slate-400 mt-2.5 px-1 font-medium">
            <span className="text-rose-400">0 - Nada probable</span>
            <span className="text-amber-400 hidden sm:inline">7-8 Neutro</span>
            <span className="text-emerald-400">10 - Altamente probable</span>
          </div>

          {npsScore !== null && (
            <div className="mt-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs flex items-center justify-between">
              <span className="text-slate-300">Calificación:</span>
              <span className="font-bold">
                {npsScore <= 6 && <span className="text-rose-400">Detractor ({npsScore}/10)</span>}
                {npsScore >= 7 && npsScore <= 8 && <span className="text-amber-400">Pasivo / Neutro ({npsScore}/10)</span>}
                {npsScore >= 9 && <span className="text-emerald-400">Promotor ({npsScore}/10) 🌟</span>}
              </span>
            </div>
          )}

          {errorMsg && (
            <p className="mt-3 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-2 rounded-lg font-medium">
              ⚠️ {errorMsg}
            </p>
          )}
        </div>

        {/* SECTION 2: Evaluación Docente (Pablo Santoro) */}
        <div className="p-6 rounded-2xl bg-slate-850/80 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Evaluación del Capacitador ({params.docente})
              </h3>
            </div>
            <span className="text-xs text-slate-400">Escala 1 a 5</span>
          </div>

          <div className="space-y-2.5">
            {renderStarSelector(
              'Claridad al explicar la diferencia con un buscador',
              claridad,
              setClaridad,
              'Facilidad para transmitir qué tipo de tareas resuelve bien y cuáles no.'
            )}
            {renderStarSelector(
              'Dominio técnico y respuesta a preguntas',
              dominio,
              setDominio,
              'Conocimiento sobre las distintas herramientas (texto, audio, imágenes).'
            )}
            {renderStarSelector(
              'Dinamismo de la videollamada (90 minutos)',
              ritmo,
              setRitmo,
              'Ritmo de la clase, uso de pantalla compartida y ejemplos en vivo.'
            )}
            {renderStarSelector(
              'Predisposición y cercanía con el equipo de La Celada',
              predisposicion,
              setPredisposicion,
              'Escucha atenta a las dudas de las distintas áreas.'
            )}
          </div>
        </div>

        {/* SECTION 3: Aplicabilidad de Módulo 1 en La Celada */}
        <div className="p-6 rounded-2xl bg-slate-850/80 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Contenido del Módulo 1 y Utilidad Laboral
            </h3>
          </div>

          <div className="space-y-2.5">
            {renderStarSelector(
              'Utilidad de lo aprendido para tu puesto de trabajo',
              utilidad,
              setUtilidad,
              '¿Cuánto te sirve entender los tipos de herramientas para resolver mejor tu día a día?'
            )}
            {renderStarSelector(
              'Calidad de las demostraciones prácticas',
              materiales,
              setMateriales,
              'Diferencias entre versiones gratuitas y pagas mostradas en vivo.'
            )}
          </div>

          {/* Dificultad */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              ¿Cómo sentiste el nivel de complejidad del Módulo 1?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Muy básico', 'Adecuado y equilibrado', 'Exigente pero alcanzable', 'Muy avanzado'] as const).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setDificultad(opt)}
                  className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    dificultad === opt
                      ? 'bg-cyan-600/30 border-cyan-400 text-cyan-200 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: Feedback Cualitativo */}
        <div className="p-6 rounded-2xl bg-slate-850/80 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
              4
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Aprendizaje Clave & Sugerencias
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              ¿Qué fue lo más valioso o clarificador que te llevás del Módulo 1?
            </label>
            <textarea
              rows={2}
              value={loMasValioso}
              onChange={(e) => setLoMasValioso(e.target.value)}
              placeholder="Ej: Entender cuándo conviene usar texto y cuándo herramientas integradas, y por qué el mismo pedido da resultados distintos..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              ¿Qué dudas o inquietudes te gustaría que Pablo retome en las próximas clases? (Opcional)
            </label>
            <textarea
              rows={2}
              value={sugerencias}
              onChange={(e) => setSugerencias(e.target.value)}
              placeholder="Ej: Me gustaría ver cómo formular pedidos paso a paso con planillas de mi área..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* SECTION 5: Área en La Celada */}
        <div className="p-6 rounded-2xl bg-slate-850/80 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
              5
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Tu Sector en {params.empresa}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Área / Departamento
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
              >
                {AREAS_LA_CELADA.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nombre (Opcional)
              </label>
              <input
                type="text"
                disabled={isAnonimo}
                value={isAnonimo ? 'Respuesta anónima' : nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none disabled:opacity-50"
              />
              <label className="flex items-center gap-2 mt-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonimo}
                  onChange={(e) => setIsAnonimo(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Enviar como respuesta 100% anónima</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transform active:scale-[0.99] transition-all cursor-pointer"
          >
            <Send className="w-5 h-5 text-cyan-200" />
            <span>Enviar Encuesta del Módulo 1</span>
          </button>
          <div className="mt-4 flex items-center justify-center">
            <div className="bg-white/95 px-4 py-2 rounded-xl shadow-sm border border-slate-200">
              <JoinLogo variant="compact" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
