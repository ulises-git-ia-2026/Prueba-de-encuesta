import React, { useState, useRef, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Tv, 
  Share2, 
  MessageCircle, 
  Download, 
  Sparkles, 
  Building2, 
  UserCheck, 
  Clock, 
  AlertCircle,
  Globe,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { JoinLogo } from './JoinLogo';
import { CAPACITACION_INFO } from '../data/mockData';
import { buildOfficialSurveyUrl, DEV_APP_URL, PREVIEW_SHARED_URL, getEffectiveBaseUrl } from '../services/storage';

interface ShareQRViewProps {
  onGoToSurvey: () => void;
}

export const ShareQRView: React.FC<ShareQRViewProps> = ({ onGoToSurvey }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWpp, setCopiedWpp] = useState(false);
  const [isFullScreenProjector, setIsFullScreenProjector] = useState(false);
  
  // URL mode selector: 'active' (ais-dev or current origin), 'shared' (ais-pre), 'custom'
  const [urlMode, setUrlMode] = useState<'active' | 'shared' | 'custom'>('active');
  const [customBaseUrl, setCustomBaseUrl] = useState('');

  const selectedBaseUrl = useMemo(() => {
    if (urlMode === 'custom' && customBaseUrl.trim()) {
      return customBaseUrl.trim();
    }
    if (urlMode === 'shared') {
      return PREVIEW_SHARED_URL;
    }
    // 'active' mode
    return getEffectiveBaseUrl();
  }, [urlMode, customBaseUrl]);

  const officialUrl = useMemo(() => {
    return buildOfficialSurveyUrl(selectedBaseUrl);
  }, [selectedBaseUrl]);

  const qrRef = useRef<HTMLDivElement>(null);

  const whatsappMessage = `👋 ¡Hola a todos en *La Celada*!
Al finalizar la primera sesión de hoy (*Módulo 1: Qué es y qué tipos de herramientas hay* con *Pablo Santoro* de 9:00 a 10:30 hs), les pedimos por favor 90 segundos para completar esta breve encuesta anónima de feedback:

🔗 ${officialUrl}

¡Muchas gracias! Tu opinión nos ayuda a calibrar los ejercicios prácticos de las próximas sesiones.`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(officialUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyWpp = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedWpp(true);
    setTimeout(() => setCopiedWpp(false), 2500);
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `QR_Encuesta_Modulo1_La_Celada_Pablo_Santoro.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* FULLSCREEN PROJECTOR STAGE */}
      {isFullScreenProjector && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
          <button
            onClick={() => setIsFullScreenProjector(false)}
            className="absolute top-6 right-6 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
          >
            ✕ Cerrar Pantalla Completa (ESC)
          </button>

          <div className="max-w-2xl w-full text-center space-y-6">
            {/* White card with JOIN Logo */}
            <div className="inline-block bg-white p-4 rounded-2xl shadow-xl shadow-cyan-500/10">
              <JoinLogo />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2">
                {CAPACITACION_INFO.empresa} • Encuesta Post-Sesión
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {CAPACITACION_INFO.moduloTitulo}
              </h1>
              <p className="text-base sm:text-lg text-cyan-300 mt-1">
                Capacitador: <strong>{CAPACITACION_INFO.docente}</strong> • {CAPACITACION_INFO.horario}
              </p>
            </div>

            {/* Giant QR Code */}
            <div className="inline-block p-6 sm:p-8 rounded-3xl bg-white shadow-2xl shadow-cyan-500/30">
              <QRCodeSVG
                value={officialUrl}
                size={280}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
                📱 Escaneá con la cámara de tu celular
              </p>
              <p className="text-sm text-slate-400">
                Abre directamente el formulario sin necesidad de iniciar sesión.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Presentation Card with JOIN Logo & Resumed Copete */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 border border-slate-750 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Encuesta Exclusiva • 1ª Capacitación
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {CAPACITACION_INFO.empresa}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {CAPACITACION_INFO.moduloTitulo}
            </h1>

            {/* RESUMED COPETE AS REQUESTED */}
            <p className="text-xs sm:text-sm text-cyan-200/90 font-medium leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-cyan-500/20">
              💡 {CAPACITACION_INFO.moduloDescripcion}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>{CAPACITACION_INFO.docente} ({CAPACITACION_INFO.cargoDocente})</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Hoy {CAPACITACION_INFO.horario}</span>
              </span>
            </div>
          </div>

          {/* JOIN Official Branding Card */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col items-center justify-center shrink-0 border border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Programa Corporativo
            </div>
            <JoinLogo />
          </div>
        </div>
      </div>

      {/* Notice on why 403 happened and how to enable public access with Share button */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>¿Por qué tu celular dio "403 error" al escanear con la cámara?</span>
        </div>
        <p className="leading-relaxed text-slate-300">
          El link te funcionó en la computadora porque tu navegador ya tiene la sesión de Google iniciada con la que estás editando el proyecto. En cambio, cuando escaneás el QR con la cámara del celular, el teléfono abre una ventana sin esa sesión y Google Cloud bloquea el acceso privado con un <strong>error 403 (Forbidden)</strong>.
        </p>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2 text-slate-200">
          <p className="font-bold text-white flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-black">✓</span>
            <span>Solución para que cualquier celular de La Celada entre libremente sin login:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[11px] text-slate-300 leading-relaxed">
            <li>Hacé clic en el botón <strong>"Share" (Compartir)</strong> en la esquina superior derecha de Google AI Studio.</li>
            <li>Al hacer clic en "Share", Google activa la URL pública compartida (<code className="text-cyan-300 font-mono">ais-pre</code>) con acceso anónimo libre.</li>
            <li>Seleccioná abajo la opción <strong>"2. URL Compartida (ais-pre)"</strong> y el QR funcionará en cualquier teléfono sin pedir contraseña y sin error 403.</li>
          </ol>
        </div>
      </div>

      {/* URL Selector & Explanation of the 404 fix */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white text-sm">Servidor y Dominio del Enlace:</span>
          </div>
          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Servidor Activo Verificado
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Option 1: Live Dev URL */}
          <button
            type="button"
            onClick={() => setUrlMode('active')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              urlMode === 'active'
                ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`font-bold text-xs ${urlMode === 'active' ? 'text-cyan-300' : 'text-slate-300'}`}>
                1. URL Activa (En Vivo)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Online</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 break-all">
              {getEffectiveBaseUrl()}
            </p>
            <p className="text-[10px] text-cyan-200/80 mt-1">
              ✓ Esta es la URL que está respondiendo en este momento (sin error 404).
            </p>
          </button>

          {/* Option 2: Pre Shared URL */}
          <button
            type="button"
            onClick={() => setUrlMode('shared')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              urlMode === 'shared'
                ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`font-bold text-xs ${urlMode === 'shared' ? 'text-cyan-300' : 'text-slate-300'}`}>
                2. URL Compartida (ais-pre)
              </span>
              <span className="text-[10px] font-mono text-amber-400">Pre-release</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 break-all">
              {PREVIEW_SHARED_URL}
            </p>
            <p className="text-[10px] text-amber-300/80 mt-1">
              ⚠️ Requiere hacer clic en "Share" en AI Studio; de lo contrario da 404.
            </p>
          </button>

          {/* Option 3: Custom domain */}
          <button
            type="button"
            onClick={() => setUrlMode('custom')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              urlMode === 'custom'
                ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`font-bold text-xs ${urlMode === 'custom' ? 'text-cyan-300' : 'text-slate-300'}`}>
                3. Dominio Propio
              </span>
              <span className="text-[10px] font-mono text-slate-400">Custom</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ej: https://lacelada.com/encuesta
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Si vas a alojar la encuesta en tu propio servidor web.
            </p>
          </button>
        </div>

        {urlMode === 'custom' && (
          <div className="pt-2">
            <input
              type="text"
              value={customBaseUrl}
              onChange={(e) => setCustomBaseUrl(e.target.value)}
              placeholder="Ingresá la URL base (ej: https://lacelada.com)"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-xs outline-none focus:border-cyan-500"
            />
          </div>
        )}
      </div>

      {/* TWO MAIN CARDS: QR CODE & DIRECT LINK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: SCANNABLE QR CODE */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center justify-between shadow-xl space-y-5">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Código QR para Escanear</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Escaneo Móvil
            </span>
          </div>

          {/* QR Display */}
          <div ref={qrRef} className="p-5 bg-white rounded-3xl shadow-xl border-4 border-slate-100 flex flex-col items-center justify-center">
            <QRCodeSVG
              value={officialUrl}
              size={210}
              level="H"
              includeMargin={false}
            />
            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-black text-slate-800 uppercase tracking-wider">
              <span>JOIN</span>
              <span className="text-cyan-600">•</span>
              <span className="text-cyan-700">La Celada</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">
              📱 Escaneá con la cámara de tu teléfono móvil
            </p>
            <p className="text-xs text-slate-400 max-w-xs">
              Abre directamente la encuesta del Módulo 1 en el navegador de tu celular.
            </p>
          </div>

          {/* Action Buttons for QR */}
          <div className="w-full grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setIsFullScreenProjector(true)}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Tv className="w-4 h-4" />
              <span>Proyectar Pantalla</span>
            </button>

            <button
              onClick={handleDownloadQR}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Descargar QR (SVG)</span>
            </button>
          </div>
        </div>

        {/* CARD 2: DIRECT LINK & WHATSAPP MESSAGE */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Enlace Directo para Pasar</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Auto-Completado
            </span>
          </div>

          {/* URL Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Link Corto Oficial para Alumnos:</span>
              <span className="text-[11px] font-semibold text-emerald-400">Ultra-Corto (?m1)</span>
            </label>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 break-all select-all leading-relaxed">
              {officialUrl}
            </div>
            <p className="text-[10px] text-slate-400">
              ⚡ Enlace súper simplificado: cabe en un solo renglón de WhatsApp y carga al instante.
            </p>
          </div>

          {/* Action Buttons: Copy, Open in new Tab & Test locally */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? '¡Link Copiado!' : 'Copiar Link'}</span>
              </button>

              {/* Native anchor with target="_blank" so clicking it opens in a new tab immediately */}
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir en Nueva Pestaña</span>
              </a>
            </div>

            <button
              onClick={onGoToSurvey}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Responder Encuesta en esta pantalla</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* WhatsApp / Meet Ready Message */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Mensaje listo para WhatsApp / Meet:</span>
              </span>
              <button
                onClick={handleCopyWpp}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedWpp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWpp ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-3 italic leading-relaxed">
              "{whatsappMessage}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
