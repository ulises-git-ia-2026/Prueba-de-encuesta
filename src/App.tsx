/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SurveyForm } from './components/SurveyForm';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ShareQRView } from './components/ShareQRView';
import { TrainingPlanView } from './components/TrainingPlanView';
import { JoinLogo } from './components/JoinLogo';
import { SurveyParams, SurveyResponse } from './types';
import { 
  getStoredResponses, 
  saveResponse, 
  resetResponsesToDefault, 
  parseUrlSurveyParams 
} from './services/storage';
import { CAPACITACION_INFO } from './data/mockData';
import { Lock, Unlock, ShieldCheck, Eye, ArrowLeft } from 'lucide-react';

export default function App() {
  const [params, setParams] = useState<SurveyParams>(() => parseUrlSurveyParams());
  const [responses, setResponses] = useState<SurveyResponse[]>(() => getStoredResponses());
  
  // Detect if user opened the link as a student (short param ?m1 or ?encuesta)
  const [isStudentOnlyMode, setIsStudentOnlyMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search);
      if (q.has('admin')) return false;
      return q.has('m1') || q.has('encuesta') || q.get('mode') === 'encuesta';
    }
    return false;
  });

  // Admin tabs: 'analytics' | 'share' | 'survey' | 'plan'
  const [activeTab, setActiveTab] = useState<'survey' | 'analytics' | 'share' | 'plan'>('analytics');
  
  // Admin PIN prompt state
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const p = parseUrlSurveyParams();
      setParams(p);
      const q = new URLSearchParams(window.location.search);
      if (q.has('admin')) {
        setIsStudentOnlyMode(false);
      } else if (q.has('m1') || q.has('encuesta') || q.get('mode') === 'encuesta') {
        setIsStudentOnlyMode(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSurveySubmit = (newResponse: SurveyResponse) => {
    const updated = saveResponse(newResponse);
    setResponses(updated);
  };

  const handleResetData = () => {
    if (window.confirm('¿Deseas reiniciar las respuestas a los registros iniciales de la 1ª capacitación de Pablo Santoro?')) {
      const reset = resetResponsesToDefault();
      setResponses(reset);
    }
  };

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple PIN for Ulises / Pablo (or empty/celada/1234)
    if (pinInput.trim().toLowerCase() === 'celada' || pinInput.trim() === '1234' || pinInput.trim() === '') {
      setIsStudentOnlyMode(false);
      setShowAdminPinModal(false);
      setPinError(false);
      setPinInput('');
      setActiveTab('analytics');
    } else {
      setPinError(true);
    }
  };

  // -------------------------------------------------------------
  // VISTA 1: MODO ALUMNO / PARTICIPANTE (SOLO ENCUESTA LIMPIA)
  // -------------------------------------------------------------
  if (isStudentOnlyMode) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
        {/* Minimal header with JOIN logo for attendees - NO TABS, NO ANALYTICS */}
        <header className="bg-slate-900 border-b border-slate-800 py-3.5 px-4 shadow-lg sticky top-0 z-30 backdrop-blur-md">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <div className="bg-white px-2.5 py-1 rounded-xl shadow-sm border border-slate-200">
              <JoinLogo variant="compact" />
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 inline-block mb-0.5">
                {params.empresa}
              </span>
              <p className="text-xs font-semibold text-white">
                Módulo 1 • Pablo Santoro
              </p>
            </div>
          </div>
        </header>

        {/* Survey component in standalone mode */}
        <main className="flex-1 pb-12">
          <SurveyForm
            params={params}
            onSubmitSuccess={handleSurveySubmit}
            onGoToAnalytics={() => {}}
            onGoToShare={() => {}}
            isStudentView={true}
          />
        </main>

        {/* Minimal footer with discreet admin unlock button */}
        <footer className="border-t border-slate-800/80 bg-slate-900/40 py-5 text-center text-xs text-slate-500">
          <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">
              JOIN • Hacemos que suceda © 2026
            </p>

            <button
              onClick={() => setShowAdminPinModal(true)}
              className="text-[11px] text-slate-500 hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="Acceso exclusivo para capacitador y organizador"
            >
              <Lock className="w-3 h-3" />
              <span>Acceso Docente</span>
            </button>
          </div>
        </footer>

        {/* Admin PIN Modal */}
        {showAdminPinModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Acceso Administración</span>
                </div>
                <button
                  onClick={() => setShowAdminPinModal(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Ingresá para ver las métricas de NPS, el resumen ejecutivo y los datos de La Celada.
              </p>

              <form onSubmit={handleUnlockAdmin} className="space-y-3">
                <div>
                  <input
                    type="password"
                    placeholder="Clave (por defecto: celada)"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-cyan-500"
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-xs text-rose-400 mt-1">
                      Clave incorrecta. Podés usar: <code className="font-mono">celada</code>
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Ingresar al Tablero
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdminPinModal(false)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VISTA 2: MODO ADMINISTRADOR (ULISES & PABLO SANTORO)
  // TIENE TODO: ANALYTICS, PROGRAMA, QR, GENERADOR Y SWITCH
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Banner with Admin indicator */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-800/50 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              Panel Administrador (Ulises / Pablo Santoro)
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline">
              Los alumnos solo ven la encuesta limpia.
            </span>
          </div>

          <button
            onClick={() => setIsStudentOnlyMode(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Modo Alumno (Encuesta pura)</span>
          </button>
        </div>
      </div>

      {/* Global Navigation Header with JOIN Logo */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        surveyParams={params}
        totalResponsesCount={responses.length}
      />

      {/* Main Admin View Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            responses={responses}
            onResetData={handleResetData}
            onGoToSurvey={() => setActiveTab('survey')}
            onGoToShare={() => setActiveTab('share')}
          />
        )}

        {activeTab === 'share' && (
          <ShareQRView
            onGoToSurvey={() => setActiveTab('survey')}
          />
        )}

        {activeTab === 'survey' && (
          <div>
            <div className="max-w-3xl mx-auto px-4 pt-4 flex items-center justify-between">
              <span className="text-xs text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/80">
                👁️ Vista Previa del Administrador
              </span>
              <button
                onClick={() => setIsStudentOnlyMode(true)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Abrir en Modo Alumno Completo
              </button>
            </div>
            <SurveyForm
              params={params}
              onSubmitSuccess={handleSurveySubmit}
              onGoToAnalytics={() => setActiveTab('analytics')}
              onGoToShare={() => setActiveTab('share')}
              isStudentView={false}
            />
          </div>
        )}

        {activeTab === 'plan' && (
          <TrainingPlanView
            onGoToShare={() => setActiveTab('share')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white px-2.5 py-1 rounded-lg">
              <JoinLogo variant="compact" />
            </div>
            <div>
              <p className="font-semibold text-white">
                {CAPACITACION_INFO.titulo} • {CAPACITACION_INFO.empresa}
              </p>
              <p className="text-[11px] text-slate-400">
                {CAPACITACION_INFO.moduloTitulo} (Hoy {CAPACITACION_INFO.horario})
              </p>
            </div>
          </div>
          <div className="text-right text-[11px] text-slate-400">
            Capacitador: <strong className="text-slate-200">{CAPACITACION_INFO.docente} (Sysadmin)</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
