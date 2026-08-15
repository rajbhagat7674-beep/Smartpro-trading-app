import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, ExternalLink, QrCode, X, Sparkles, Copy, Check } from 'lucide-react';

interface AppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
  deferredPrompt?: any;
  onInstallClick?: () => void;
}

export const AppInstallModal: React.FC<AppInstallModalProps> = ({
  isOpen,
  onClose,
  appUrl,
  deferredPrompt,
  onInstallClick
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate QR code URL using standard public QR generator for the preview link
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}&bgcolor=080c14&color=10b981&margin=2`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0b101d] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Smartphone className="w-6 h-6" />
            </span>
            <div>
              <h3 className="text-lg font-black text-white">Install SmartPro on Android</h3>
              <p className="text-xs text-slate-400">Native WebAPK Standalone App (No Browser Badge)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* One-Click Native Install Button if prompt available */}
          {deferredPrompt && (
            <div className="p-4 bg-gradient-to-r from-emerald-950/80 to-indigo-950/80 border border-emerald-500/50 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-black">
                <Sparkles className="w-4 h-4" />
                <span>NATIVE INSTALL READY</span>
              </div>
              <p className="text-xs text-slate-300">
                Click below to install SmartPro directly into your phone's app drawer as a standalone native app:
              </p>
              <button
                onClick={onInstallClick}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-950 transition-all active:scale-98"
              >
                <Download className="w-4 h-4" />
                INSTALL NATIVE APP (APK) NOW
              </button>
            </div>
          )}

          {/* Direct Install Banner */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl flex-shrink-0">
              <img
                src={qrCodeUrl}
                alt="Scan to Install"
                className="w-28 h-28 rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 text-xs font-black">
                <Sparkles className="w-4 h-4" />
                <span>MOBILE PHONE QR SCAN</span>
              </div>
              <h4 className="text-sm font-bold text-white">Scan QR code with your Android phone</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Open in Chrome, and tap <strong className="text-emerald-400 font-bold">Install App</strong> to get the full native standalone experience without browser toolbars.
              </p>
            </div>
          </div>

          {/* Steps for Android (Chrome / APK Web App) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase">
              How to fix Chrome Shortcut and get True App Install:
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </span>
                <div>
                  <span className="font-bold text-white">Delete any old home screen shortcut</span>
                  <p className="text-slate-400 mt-0.5">Remove the gray icon shortcut from your home screen.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </span>
                <div>
                  <span className="font-bold text-white">Open link in Chrome & tap Menu (⋮)</span>
                  <p className="text-slate-400 mt-0.5">
                    Select <strong className="text-emerald-400">"Install app"</strong> (not bookmark/shortcut).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </span>
                <div>
                  <span className="font-bold text-white">WebAPK Built Automatically</span>
                  <p className="text-slate-400 mt-0.5">
                    Android will build the WebAPK with the dedicated green candlestick icon and install it into your Android App Drawer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Copy Direct Link */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">Direct Mobile Launch URL</span>
            <div className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="bg-transparent text-xs text-slate-300 w-full px-2 outline-none font-mono select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 flex-shrink-0 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all text-center"
            >
              <ExternalLink className="w-4 h-4" />
              Open Live in New Tab
            </a>
            <button
              onClick={onClose}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

