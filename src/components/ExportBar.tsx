import React from 'react';
import { Download, Copy, CheckCheck, Layout } from 'lucide-react';
import { ColorSwatch } from '../data/palette';
import { ActiveTab } from './TopNav';

interface ExportBarProps {
  activeTab: ActiveTab;
  aspectRatio: '4:5' | '1:1';
  setAspectRatio: (ar: '4:5' | '1:1') => void;
  onExport: (format: 'png' | 'jpeg') => Promise<void>;
  onCopyClipboard: () => Promise<void>;
  isExporting: boolean;
  copiedSuccess: boolean;
  themeColor: ColorSwatch;
  isAnimated?: boolean;
}

export const ExportBar: React.FC<ExportBarProps> = ({
  activeTab,
  aspectRatio,
  setAspectRatio,
  onExport,
  onCopyClipboard,
  isExporting,
  copiedSuccess,
  themeColor,
}) => {
  return (
    <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 mt-4 bg-white border border-[#e0e0e0] px-4 py-3 rounded-[18px] shadow-sm">
      {/* Left: Aspect Ratio Selector (2 sizes only: 4:5 and 1:1) */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase text-[#86868b] tracking-wider flex items-center gap-1">
          <Layout className="w-3 h-3" style={{ color: themeColor.hex }} />
          <span>Format:</span>
        </span>
        <div className="flex items-center bg-[#f5f5f7] rounded-full p-0.5 border border-[#e0e0e0] text-xs">
          <button
            type="button"
            onClick={() => setAspectRatio('4:5')}
            className={`px-3 py-1 rounded-full transition-all font-mono text-xs cursor-pointer ${
              aspectRatio === '4:5'
                ? 'text-white font-semibold shadow-xs'
                : 'text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
            style={aspectRatio === '4:5' ? { backgroundColor: themeColor.hex } : undefined}
          >
            4:5
          </button>
          <button
            type="button"
            onClick={() => setAspectRatio('1:1')}
            className={`px-3 py-1 rounded-full transition-all font-mono text-xs cursor-pointer ${
              aspectRatio === '1:1'
                ? 'text-white font-semibold shadow-xs'
                : 'text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
            style={aspectRatio === '1:1' ? { backgroundColor: themeColor.hex } : undefined}
          >
            1:1
          </button>
        </div>
        <span className="hidden sm:inline text-[11px] text-[#86868b] font-normal">
          ({aspectRatio === '4:5' ? 'LinkedIn Portrait' : 'Square Feed'})
        </span>
      </div>

      {/* Right: Export & Download Action Buttons (JPG & PNG only) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Copy to Clipboard */}
        <button
          type="button"
          onClick={onCopyClipboard}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f5f5f7] hover:bg-[#ebebed] text-[#1d1d1f] text-xs font-medium border border-[#e0e0e0] transition-colors active:scale-95 cursor-pointer"
          title="Copy high-res image to clipboard"
        >
          {copiedSuccess ? (
            <>
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#6e6e73]" />
              <span>Copy Image</span>
            </>
          )}
        </button>

        {/* Download JPG */}
        <button
          type="button"
          onClick={() => onExport('jpeg')}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] text-xs font-semibold border border-[#d1d1d6] transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#6e6e73]" />
          <span>JPG</span>
        </button>

        {/* Download PNG */}
        <button
          type="button"
          onClick={() => onExport('png')}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] text-xs font-semibold border border-[#d1d1d6] transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#6e6e73]" />
          <span>PNG</span>
        </button>
      </div>
    </div>
  );
};
