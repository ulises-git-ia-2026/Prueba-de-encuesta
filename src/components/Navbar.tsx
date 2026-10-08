import React from 'react';
import { 
  ClipboardCheck, 
  BarChart3, 
  QrCode, 
  FileText,
  Building2,
  Clock,
  UserCheck
} from 'lucide-react';
import { SurveyParams } from '../types';
import { JoinLogo } from './JoinLogo';

interface NavbarProps {
  currentTab: 'survey' | 'analytics' | 'share' | 'plan';
  onSelectTab: (tab: 'survey' | 'analytics' | 'share' | 'plan') => void;
  surveyParams: SurveyParams;
  totalResponsesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  surveyParams,
  totalResponsesCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top micro bar with training context */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-cyan-300">
              <Building2 className="w-3.5 h-3.5" />
              {surveyParams.empresa}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              Capacitador: <strong className="text-white font-semibold">{surveyParams.docente} (Sysadmin)</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:flex items-center gap-1 text-amber-300 font-medium">
              <Clock className="w-3.5 h-3.5" />
              Hoy {surveyParams.horario} (1h 30m)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {totalResponsesCount} respuestas Módulo 1
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation header with JOIN Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity: JOIN Logo with cute AI Robot */}
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onSelectTab('survey')}
        >
          {/* Logo container with light background for maximum contrast */}
          <div className="bg-slate-100 hover:bg-white rounded-xl px-2.5 py-1.5 border border-cyan-400/40 shadow-md shadow-cyan-500/15 transition-all">
            <JoinLogo variant="compact" />
          </div>

          <div className="hidden lg:block border-l border-slate-700 pl-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">
                Módulo 1: Qué es y qué tipos de herramientas hay
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                1ª Sesión
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Plan de Capacitación en IA • La Celada
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-slate-800/90 rounded-xl border border-slate-700 text-xs sm:text-sm font-medium">
          <button
            onClick={() => onSelectTab('share')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg transition-all ${
              currentTab === 'share'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 font-bold'
                : 'text-emerald-400 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR & Link Oficial</span>
          </button>

          <button
            onClick={() => onSelectTab('survey')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg transition-all ${
              currentTab === 'survey'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Responder Encuesta</span>
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg transition-all ${
              currentTab === 'analytics'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-cyan-300" />
            <span>Análisis de Datos</span>
          </button>

          <button
            onClick={() => onSelectTab('plan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg transition-all ${
              currentTab === 'plan'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Programa</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
