import React, { useEffect } from 'react';
import { ShieldCheck, X, HardDrive, Lock, EyeOff, ExternalLink, Facebook, Linkedin, Mail } from 'lucide-react';
import { ColorSwatch } from '../data/palette';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeColor: ColorSwatch;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  themeColor,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="w-full max-w-2xl bg-white rounded-[24px] border border-[#e0e0e0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-[#f0f0f0] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: themeColor.hex }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Privacy Policy
              </h2>
              <p className="text-xs text-[#86868b] mt-0.5">
                yourmap.me · 100% Client-Side & Local Storage Architecture
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#ebebed] text-[#86868b] hover:text-[#1d1d1f] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-[#1d1d1f]">
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-[#f0f9ff] border border-[#bae6fd] flex items-start gap-3 text-xs text-[#0369a1] leading-relaxed">
            <Lock className="w-4 h-4 shrink-0 text-[#0284c7] mt-0.5" />
            <div>
              <strong className="font-semibold block text-[#0c4a6e] mb-0.5">
                Zero Remote Storage Guarantee
              </strong>
              We do not operate any database or cloud server for your data. Every photo you upload, name you type, and country you highlight stays exclusively on your own device.
            </div>
          </div>

          {/* Section 1: Client-Side Processing */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4" style={{ color: themeColor.hex }} />
              <h3 className="text-sm font-bold text-[#1d1d1f]">
                1. 100% Client-Side Architecture
              </h3>
            </div>
            <p className="text-xs text-[#6e6e73] leading-relaxed pl-6">
              All map projection math, bezier flight paths, avatar clipping, and graphic exports are computed locally in your web browser via standard HTML5 Canvas and SVG technologies. No information is transmitted to any external server.
            </p>
          </div>

          {/* Section 2: Local Storage */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" style={{ color: themeColor.hex }} />
              <h3 className="text-sm font-bold text-[#1d1d1f]">
                2. Browser Local Storage (localStorage)
              </h3>
            </div>
            <p className="text-xs text-[#6e6e73] leading-relaxed pl-6">
              To save you time when you return to the site, your selected country list, services, chosen theme palette, and entered name are saved locally in your browser's HTML5 <code className="px-1.5 py-0.5 rounded bg-[#f5f5f7] border text-[#1d1d1f] font-mono text-[11px]">localStorage</code>. This data never leaves your computer and can be cleared anytime by clearing your browser cookies and site data.
            </p>
          </div>

          {/* Section 3: Photo & Avatar Privacy */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" style={{ color: themeColor.hex }} />
              <h3 className="text-sm font-bold text-[#1d1d1f]">
                3. Profile Photo Handling
              </h3>
            </div>
            <p className="text-xs text-[#6e6e73] leading-relaxed pl-6">
              Photos uploaded using the avatar picker are read strictly in-memory using the browser's <code className="px-1.5 py-0.5 rounded bg-[#f5f5f7] border text-[#1d1d1f] font-mono text-[11px]">FileReader</code> API. Images are never uploaded to any third-party file storage, cloud bucket, or CDN.
            </p>
          </div>

          {/* Section 4: Analytics & Tracking */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" style={{ color: themeColor.hex }} />
              <h3 className="text-sm font-bold text-[#1d1d1f]">
                4. No Tracking, No Ads, No Third Parties
              </h3>
            </div>
            <p className="text-xs text-[#6e6e73] leading-relaxed pl-6">
              We do not track user behavior, install tracking cookies, sell data, or display third-party advertisements. Your business client footprint remains confidential to you.
            </p>
          </div>

          {/* Section 5: Creator & Contact */}
          <div className="pt-3 border-t border-[#f0f0f0]">
            <div className="p-3.5 rounded-2xl bg-[#fafafa] border border-[#e5e5ea] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#86868b] uppercase tracking-wider font-mono block">
                  Created & Designed by
                </span>
                <span className="text-sm font-bold text-[#1d1d1f]">
                  A M R JIM
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="mailto:amrjimweb@gmail.com"
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#1d1d1f] bg-[#e5e5ea] hover:bg-[#d1d1d6] transition-all shadow-xs hover:opacity-95 active:scale-95 flex items-center gap-1.5"
                  title="Email amrjimweb@gmail.com"
                >
                  <Mail className="w-3.5 h-3.5 text-[#0f7af0]" />
                  <span>Email</span>
                </a>
                <a
                  href="https://www.facebook.com/share/1FgP4jNFEG/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-[#1877f2] hover:bg-[#166fe5] transition-all shadow-xs hover:opacity-95 active:scale-95 flex items-center gap-1.5"
                  title="Connect on Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                </a>
                <a
                  href="https://www.linkedin.com/in/al-mahamud-rohit-jim-8027b9275/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-[#0a66c2] hover:bg-[#095196] transition-all shadow-xs hover:opacity-95 active:scale-95 flex items-center gap-1.5"
                  title="Connect on LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 px-6 border-t border-[#f0f0f0] bg-[#fafafa] flex items-center justify-between">
          <span className="text-xs text-[#86868b]">
            yourmap.me · Private by design
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-xs cursor-pointer"
            style={{ backgroundColor: themeColor.hex }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
