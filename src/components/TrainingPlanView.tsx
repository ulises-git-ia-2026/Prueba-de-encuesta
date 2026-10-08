import React from 'react';
import { 
  FileText, 
  CheckCircle, 
  ShieldAlert, 
  Layers, 
  UserCheck, 
  Clock, 
  Building2, 
  Check, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BrainCircuit
} from 'lucide-react';
import { JoinLogo } from './JoinLogo';
import { CAPACITACION_INFO } from '../data/mockData';

interface TrainingPlanViewProps {
  onGoToShare: () => void;
}

export const TrainingPlanView: React.FC<TrainingPlanViewProps> = ({ onGoToShare }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 border border-slate-750 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Propuesta de Formación Interna
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              La Celada
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Plan de Capacitación en Inteligencia Artificial
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Programa en dos niveles para que el personal de La Celada incorpore herramientas de IA en su labor diaria, con criterios de calidad y buenas prácticas de seguridad informática.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
            <span className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              Capacitador: <strong className="text-white">Pablo Santoro — Sysadmin</strong>
            </span>
            <span className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              Presentado a: <strong className="text-cyan-300">Recursos Humanos</strong>
            </span>
          </div>
        </div>

        {/* JOIN Logo on white badge */}
        <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center shrink-0 border border-slate-200">
          <JoinLogo />
        </div>
      </div>

      {/* Highlights from PDF Page 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-4xl font-black text-cyan-400">2</span>
          <p className="text-xs font-bold text-white uppercase tracking-wider">Niveles de Formación</p>
          <p className="text-[11px] text-slate-400">Nivel Inicial (para todo el personal) y Nivel de Uso Experimentado</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-4xl font-black text-emerald-400">11</span>
          <p className="text-xs font-bold text-white uppercase tracking-wider">Módulos en Total</p>
          <p className="text-[11px] text-slate-400">5 módulos de nivel inicial + 5 avanzados + 1 optativo de integración</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
          <span className="text-4xl font-black text-amber-400">100%</span>
          <p className="text-xs font-bold text-white uppercase tracking-wider">Evaluación Práctica</p>
          <p className="text-[11px] text-slate-400">Aplicado sobre una tarea real del propio puesto de trabajo</p>
        </div>
      </div>

      {/* FOCUS: Modulo 1 (The session evaluated today) */}
      <div className="p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              1
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Módulo 1: Qué es y qué tipos de herramientas hay (SESIÓN DE HOY)
              </h2>
              <p className="text-xs text-emerald-400 font-medium">
                Esta es la única sesión evaluada en esta encuesta
              </p>
            </div>
          </div>

          <button
            onClick={onGoToShare}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Ver QR & Enlace de la Encuesta</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
            <h3 className="font-bold text-cyan-300">🎯 Contenidos abordados:</h3>
            <ul className="text-slate-300 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400">•</span>
                <span>En qué se diferencia de un buscador tradicional (Google).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400">•</span>
                <span>Qué tipo de tareas resuelve bien y cuáles no conviene delegarle.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400">•</span>
                <span>Tipos que existen: texto, transcripción de audio, imágenes e integradas.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400">•</span>
                <span>Diferencias entre versiones gratuitas y pagas.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
            <h3 className="font-bold text-amber-300">⚠️ Problemas que resuelve en La Celada:</h3>
            <ul className="text-slate-300 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span><strong>Uso desparejo:</strong> Nivelar una base común para todo el personal.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span><strong>Alcance desconocido:</strong> Mostrar más allá del uso aislado para mails.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span><strong>Criterio de diseño:</strong> Ningún módulo termina con teoría; cierra con una tarea real del puesto resuelta de otra manera.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Principles from Page 8 */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Reglas de Seguridad Informática fijadas por Pablo Santoro</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Las 3 categorías clave para clasificar qué información de La Celada puede entrar a una IA:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/40">
            <span className="font-bold text-rose-400 block mb-1">🚫 NUNCA</span>
            <p className="text-slate-300 leading-relaxed">
              Contraseñas, claves de acceso, remuneraciones, legajos, identidad del personal, bases de clientes/proveedores y contratos legales.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40">
            <span className="font-bold text-amber-400 block mb-1">⚖️ CON CRITERIO</span>
            <p className="text-slate-300 leading-relaxed">
              Solo desde cuentas de la empresa: planillas operativas sin nombres, precios/costos internos y borradores de trabajo.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
            <span className="font-bold text-emerald-400 block mb-1">✅ LIBRE</span>
            <p className="text-slate-300 leading-relaxed">
              Textos redactados por uno mismo sin datos internos, material ya público (normativas, manuales) y preguntas generales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
