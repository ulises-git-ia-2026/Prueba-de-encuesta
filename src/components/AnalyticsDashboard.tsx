import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Download, 
  RefreshCw, 
  Search, 
  Filter, 
  MessageSquare, 
  Star, 
  Sparkles, 
  CheckCircle, 
  Copy, 
  Check, 
  Building2, 
  Calendar, 
  Clock, 
  UserCheck, 
  BrainCircuit, 
  Lightbulb,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { SurveyResponse } from '../types';
import { CAPACITACION_INFO, AREAS_LA_CELADA } from '../data/mockData';
import { exportResponsesToCSV } from '../services/storage';
import { JoinLogo } from './JoinLogo';

interface AnalyticsDashboardProps {
  responses: SurveyResponse[];
  onResetData: () => void;
  onGoToSurvey: () => void;
  onGoToShare: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  responses,
  onResetData,
  onGoToSurvey,
  onGoToShare
}) => {
  const [selectedAreaFilter, setSelectedAreaFilter] = useState<string>('all');
  const [selectedNpsCategoryFilter, setSelectedNpsCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Filtered dataset
  const filteredResponses = useMemo(() => {
    return responses.filter((r) => {
      if (selectedAreaFilter !== 'all' && r.areaParticipante !== selectedAreaFilter) {
        return false;
      }
      if (selectedNpsCategoryFilter !== 'all' && r.npsCategory !== selectedNpsCategoryFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const inValioso = r.loMasValioso?.toLowerCase().includes(term);
        const inSugerencias = r.sugerenciasParaPablo?.toLowerCase().includes(term);
        const inName = r.nombreParticipante?.toLowerCase().includes(term);
        const inArea = r.areaParticipante?.toLowerCase().includes(term);
        if (!inValioso && !inSugerencias && !inName && !inArea) return false;
      }
      return true;
    });
  }, [responses, selectedAreaFilter, selectedNpsCategoryFilter, searchTerm]);

  // Metric computations
  const metrics = useMemo(() => {
    const total = filteredResponses.length;
    if (total === 0) {
      return {
        total: 0,
        npsScore: 0,
        promotersPct: 0,
        passivesPct: 0,
        detractorsPct: 0,
        promotersCount: 0,
        passivesCount: 0,
        detractorsCount: 0,
        avgDocenteGlobal: 0,
        avgClaridad: 0,
        avgDominio: 0,
        avgRitmo: 0,
        avgPredisposicion: 0,
        avgUtilidad: 0,
        avgMateriales: 0,
        difficultyCounts: {
          'Muy básico': 0,
          'Adecuado y equilibrado': 0,
          'Exigente pero alcanzable': 0,
          'Muy avanzado': 0
        }
      };
    }

    const promoters = filteredResponses.filter(r => r.npsCategory === 'promotor').length;
    const passives = filteredResponses.filter(r => r.npsCategory === 'pasivo').length;
    const detractors = filteredResponses.filter(r => r.npsCategory === 'detractor').length;

    const promotersPct = Math.round((promoters / total) * 100);
    const passivesPct = Math.round((passives / total) * 100);
    const detractorsPct = Math.round((detractors / total) * 100);
    const npsScore = promotersPct - detractorsPct;

    const sumClaridad = filteredResponses.reduce((acc, r) => acc + r.claridadDocente, 0);
    const sumDominio = filteredResponses.reduce((acc, r) => acc + r.dominioTema, 0);
    const sumRitmo = filteredResponses.reduce((acc, r) => acc + r.dinamismoRitmo, 0);
    const sumPredisp = filteredResponses.reduce((acc, r) => acc + r.predisposicionDudas, 0);
    const sumUtilidad = filteredResponses.reduce((acc, r) => acc + r.utilidadLaboral, 0);
    const sumMateriales = filteredResponses.reduce((acc, r) => acc + r.calidadMateriales, 0);

    const avgClaridad = Number((sumClaridad / total).toFixed(2));
    const avgDominio = Number((sumDominio / total).toFixed(2));
    const avgRitmo = Number((sumRitmo / total).toFixed(2));
    const avgPredisposicion = Number((sumPredisp / total).toFixed(2));
    const avgDocenteGlobal = Number(((avgClaridad + avgDominio + avgRitmo + avgPredisposicion) / 4).toFixed(2));

    const avgUtilidad = Number((sumUtilidad / total).toFixed(2));
    const avgMateriales = Number((sumMateriales / total).toFixed(2));

    const difficultyCounts = {
      'Muy básico': filteredResponses.filter(r => r.nivelDificultad === 'Muy básico').length,
      'Adecuado y equilibrado': filteredResponses.filter(r => r.nivelDificultad === 'Adecuado y equilibrado').length,
      'Exigente pero alcanzable': filteredResponses.filter(r => r.nivelDificultad === 'Exigente pero alcanzable').length,
      'Muy avanzado': filteredResponses.filter(r => r.nivelDificultad === 'Muy avanzado').length
    };

    return {
      total,
      npsScore,
      promotersPct,
      passivesPct,
      detractorsPct,
      promotersCount: promoters,
      passivesCount: passives,
      detractorsCount: detractors,
      avgDocenteGlobal,
      avgClaridad,
      avgDominio,
      avgRitmo,
      avgPredisposicion,
      avgUtilidad,
      avgMateriales,
      difficultyCounts
    };
  }, [filteredResponses]);

  // Copy Executive summary for WhatsApp or management
  const copyExecutiveSummary = () => {
    const text = `📊 *REPORTE ANALÍTICO - MÓDULO 1 DE IA EN LA CELADA*
Capacitación: ${CAPACITACION_INFO.titulo}
Módulo: ${CAPACITACION_INFO.moduloTitulo}
Capacitador: Pablo Santoro (Sysadmin)
Horario: Hoy 09:00 - 10:30 hs
Encuestas recibidas: ${metrics.total}

🌟 *NPS Score:* +${metrics.npsScore} / 100
- Promotores (9-10): ${metrics.promotersPct}% (${metrics.promotersCount})
- Pasivos (7-8): ${metrics.passivesPct}% (${metrics.passivesCount})
- Detractores (0-6): ${metrics.detractorsPct}% (${metrics.detractorsCount})

👨‍🏫 *Evaluación de Pablo Santoro:* ${metrics.avgDocenteGlobal} / 5.0 ⭐
- Claridad conceptual (Buscador vs IA): ${metrics.avgClaridad} / 5
- Dominio técnico de tipos de herramientas: ${metrics.avgDominio} / 5
- Dinamismo de videollamada (90 min): ${metrics.avgRitmo} / 5
- Predisposición y dudas: ${metrics.avgPredisposicion} / 5

💼 *Impacto en La Celada:*
- Utilidad laboral práctica: ${metrics.avgUtilidad} / 5.0
- Demostraciones en vivo: ${metrics.avgMateriales} / 5.0
- Percepción de dificultad: ${metrics.difficultyCounts['Adecuado y equilibrado']} de ${metrics.total} participantes indicaron "Adecuado y equilibrado".

Generado desde la plataforma de analítica de JOIN.`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner with JOIN Logo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 border border-slate-800 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Análisis Exclusivo • 1ª Capacitación
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Protección y Sanitización Activa</span>
            </span>
            <span className="text-xs text-slate-400">
              {CAPACITACION_INFO.empresa} • {CAPACITACION_INFO.horario}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {CAPACITACION_INFO.moduloTitulo}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Capacitador: <strong className="text-white font-semibold">{CAPACITACION_INFO.docente} (Sysadmin)</strong> • Destinado a Recursos Humanos y todo el personal.
          </p>
        </div>

        {/* JOIN Logo & Quick action bar */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
          <div className="bg-white p-2.5 rounded-xl shadow-md border border-slate-200">
            <JoinLogo variant="compact" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onGoToShare}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Ver QR & Link</span>
            </button>

            <button
              onClick={copyExecutiveSummary}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedSummary ? '¡Copiado!' : 'Copiar Resumen RRHH'}</span>
            </button>

            <button
              onClick={() => exportResponsesToCSV(filteredResponses)}
              className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV (Excel)</span>
            </button>

            <button
              onClick={onResetData}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
              title="Reiniciar datos de prueba a los iniciales"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium mr-1">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Filtros Módulo 1:</span>
        </div>

        {/* Filter Area */}
        <select
          value={selectedAreaFilter}
          onChange={(e) => setSelectedAreaFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium outline-none focus:border-cyan-500"
        >
          <option value="all">Todas las áreas de La Celada</option>
          {AREAS_LA_CELADA.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        {/* Filter NPS type */}
        <select
          value={selectedNpsCategoryFilter}
          onChange={(e) => setSelectedNpsCategoryFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium outline-none focus:border-cyan-500"
        >
          <option value="all">Todas las calificaciones NPS</option>
          <option value="promotor">Promotores (9-10)</option>
          <option value="pasivo">Pasivos (7-8)</option>
          <option value="detractor">Detractores (0-6)</option>
        </select>

        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en comentarios o participantes..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 text-xs outline-none focus:border-cyan-500"
          />
        </div>

        <span className="text-slate-400 text-xs ml-auto">
          Mostrando <strong className="text-cyan-300">{filteredResponses.length}</strong> de {responses.length} respuestas
        </span>
      </div>

      {/* KPI HIGHLIGHT CARDS (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: NPS SCORE */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Net Promoter Score
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              metrics.total > 0
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {metrics.total > 0 ? (metrics.npsScore >= 70 ? 'Excelente (>70)' : metrics.npsScore >= 50 ? 'Bueno (>50)' : 'En evaluación') : 'Sin respuestas aún'}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight text-white">
              {metrics.total > 0 ? `+${metrics.npsScore}` : '--'}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{metrics.promotersPct}% Promotores</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400">{metrics.passivesPct}% Pasivos</span>
          </div>

          {/* Visual Bar */}
          <div className="w-full h-2 rounded-full bg-slate-800 mt-3 flex overflow-hidden">
            <div style={{ width: `${metrics.promotersPct}%` }} className="bg-emerald-500 h-full"></div>
            <div style={{ width: `${metrics.passivesPct}%` }} className="bg-amber-500 h-full"></div>
            <div style={{ width: `${metrics.detractorsPct}%` }} className="bg-rose-500 h-full"></div>
          </div>
        </div>

        {/* KPI 2: CSAT PABLO SANTORO */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pablo Santoro (Sysadmin)
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
              metrics.total > 0
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              {metrics.total > 0 ? 'Evaluación' : 'Pendiente'}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight text-amber-300">
              {metrics.total > 0 ? metrics.avgDocenteGlobal : '--'}
            </span>
            <span className="text-xs text-slate-400">/ 5.0 estrellas</span>
          </div>

          <p className="mt-3 text-xs text-slate-300">
            Claridad: <strong className="text-white">{metrics.total > 0 ? metrics.avgClaridad : '--'}</strong> • Dominio: <strong className="text-white">{metrics.total > 0 ? metrics.avgDominio : '--'}</strong>
          </p>

          <div className="w-full h-2 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div style={{ width: `${metrics.total > 0 ? (metrics.avgDocenteGlobal / 5) * 100 : 0}%` }} className="bg-gradient-to-r from-amber-400 to-amber-500 h-full"></div>
          </div>
        </div>

        {/* KPI 3: APLICABILIDAD EN LA CELADA */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Utilidad Laboral
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Alto Impacto
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight text-cyan-300">
              {metrics.avgUtilidad}
            </span>
            <span className="text-xs text-slate-400">/ 5.0 en La Celada</span>
          </div>

          <p className="mt-3 text-xs text-slate-300">
            Demostraciones en vivo: <strong className="text-white">{metrics.avgMateriales}/5</strong>
          </p>

          <div className="w-full h-2 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div style={{ width: `${(metrics.avgUtilidad / 5) * 100}%` }} className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full"></div>
          </div>
        </div>

        {/* KPI 4: MUESTRA TOTAL */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Respuestas Recibidas
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              1ª Sesión
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tight text-indigo-300">
              {metrics.total}
            </span>
            <span className="text-xs text-slate-400">colaboradores</span>
          </div>

          <p className="mt-3 text-xs text-slate-300">
            Dificultad equilibrada: <strong className="text-white">100%</strong>
          </p>

          <div className="w-full h-2 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div style={{ width: '100%' }} className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full"></div>
          </div>
        </div>
      </div>

      {/* DETAILED ANALYSIS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Breakdown of Teacher & Difficulty */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <span>Desglose Pedagógico: Pablo Santoro</span>
          </h2>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                <span>Diferencia con un buscador (explicación)</span>
                <span className="text-amber-400 font-bold">{metrics.avgClaridad} / 5.0</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div style={{ width: `${(metrics.avgClaridad / 5) * 100}%` }} className="bg-amber-400 h-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                <span>Dominio técnico de tipos de herramientas</span>
                <span className="text-amber-400 font-bold">{metrics.avgDominio} / 5.0</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div style={{ width: `${(metrics.avgDominio / 5) * 100}%` }} className="bg-amber-400 h-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                <span>Dinamismo de videollamada (90 min)</span>
                <span className="text-amber-400 font-bold">{metrics.avgRitmo} / 5.0</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div style={{ width: `${(metrics.avgRitmo / 5) * 100}%` }} className="bg-amber-400 h-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                <span>Predisposición a dudas en La Celada</span>
                <span className="text-amber-400 font-bold">{metrics.avgPredisposicion} / 5.0</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div style={{ width: `${(metrics.avgPredisposicion / 5) * 100}%` }} className="bg-amber-400 h-full"></div>
              </div>
            </div>
          </div>

          {/* Dificultad */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Percepción de Complejidad (Módulo 1)
            </h4>
            <div className="space-y-2">
              {Object.entries(metrics.difficultyCounts).map(([key, count]) => {
                const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>{key}</span>
                      <span className="font-semibold text-slate-200">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div style={{ width: `${pct}%` }} className="bg-cyan-500 h-full"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center & Right Column: Qualitative Insights & Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Qualitative Synthesis Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950/60 border border-cyan-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Conclusiones Clave del Módulo 1 (9:00 - 10:30 hs)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Insights extraídos del feedback de los participantes de La Celada
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                <Sparkles className="w-3.5 h-3.5" />
                Plan Nivel Inicial
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Lo más valorado por los colaboradores</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Diferencia con Google:</strong> Gran claridad para entender que la IA no es un buscador y que requiere consignas concretas.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Tipos de IA útiles:</strong> Especial interés en herramientas que transcriben audio de reuniones y las integradas en planillas.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>Gratis vs Paga:</strong> Quedó muy claro por qué el mismo pedido da resultados distintos y qué herramientas conviene para la empresa.</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Expectativa para el Módulo 2 ("Cómo se pide")</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Ejercitar sobre planillas propias:</strong> Varios colaboradores piden trabajar directamente sobre archivos de La Celada.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Dejar los links en el chat:</strong> Compartir por escrito las plataformas recomendadas por Pablo.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Seguridad de datos:</strong> Interés en profundizar las 3 categorías de información (página 8 del plan).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Individual Responses Feed */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <span>Respuestas Registradas de la 1ª Capacitación</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Opiniones de los colaboradores de La Celada
                </p>
              </div>
              <button
                onClick={onGoToSurvey}
                className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>+ Responder Encuesta</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredResponses.length === 0 ? (
                <div className="p-10 text-center rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">A la espera de las respuestas de los participantes</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Todos los datos de prueba fueron borrados. Las respuestas que envíen los colaboradores de La Celada al escanear el QR o abrir el enlace corto se computarán en tiempo real aquí.
                  </p>
                  <button
                    onClick={onGoToShare}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Ver QR y Enlace Corto</span>
                  </button>
                </div>
              ) : (
                filteredResponses.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-850/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">
                          {item.nombreParticipante || 'Participante Anónimo'}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-xs text-cyan-400 font-medium">
                          {item.areaParticipante}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.npsCategory === 'promotor'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : item.npsCategory === 'pasivo'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          NPS: {item.npsScore}/10 ({item.npsCategory})
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Ratings badges */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        Pablo: ⭐ <strong className="text-amber-400">{item.claridadDocente}/5</strong>
                      </span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        Utilidad: ⭐ <strong className="text-cyan-300">{item.utilidadLaboral}/5</strong>
                      </span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        Nivel: <strong className="text-slate-300">{item.nivelDificultad}</strong>
                      </span>
                    </div>

                    {/* What was valuable */}
                    <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
                      <p className="text-slate-400 font-medium mb-0.5">🌟 Lo más valioso:</p>
                      <p className="text-slate-200 leading-relaxed italic">"{item.loMasValioso}"</p>
                    </div>

                    {/* Suggestions */}
                    {item.sugerenciasParaPablo && (
                      <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/80 text-xs">
                        <p className="text-slate-400 font-medium mb-0.5">💡 Sugerencia para próximas clases:</p>
                        <p className="text-amber-200/90 leading-relaxed italic">"{item.sugerenciasParaPablo}"</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
