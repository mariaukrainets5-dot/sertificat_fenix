import React from 'react';
import { Certificate } from '../types';
import { WEBSITE_URL, COMPANY_NAME } from '../constants';
import { QrCode, Flame, Shield, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';

interface CertificatePreviewProps {
  data: Partial<Certificate>;
  isGenerating?: boolean;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({ data, isGenerating }) => {
  const formattedAmount = new Intl.NumberFormat('uk-UA').format(data.amount || 0);

  return (
    <div className="relative w-full max-w-xl mx-auto group perspective-1000">
      {/* 3D Tilt Effect Container (Visual only here, CSS perspective added) */}
      <div className="relative aspect-[1.7/1] w-full transition-transform duration-500 ease-out transform-gpu group-hover:rotate-x-2 group-hover:rotate-y-2">
        
        {/* Glow Effects Behind */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-orange-600/40 via-red-900/20 to-amber-600/30 rounded-[30px] blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-700 animate-pulse-slow"></div>
        
        {/* Main Card */}
        <div className="relative h-full w-full bg-[#080808] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between z-10 backdrop-blur-xl">
          
          {/* Background Textures */}
          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{backgroundImage:'repeating-linear-gradient(45deg,#ffffff08 0,#ffffff08 1px,transparent 0,transparent 50%)',backgroundSize:'4px 4px'}}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/80"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-zinc-800/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>
          
          {/* Hexagon Pattern Overlay */}
          <div className="absolute top-4 right-4 opacity-10">
             <div className="flex gap-1">
               <Hexagon size={16} className="text-white" />
               <Hexagon size={16} className="text-white" />
               <Hexagon size={16} className="text-white" />
             </div>
             <div className="flex gap-1 ml-2 -mt-1">
               <Hexagon size={16} className="text-white" />
               <Hexagon size={16} className="text-white" />
             </div>
          </div>

          {/* Header Section */}
          <div className="relative z-10 px-8 pt-8 flex justify-between items-start">
            <div className="flex items-center gap-5">
              <div className="relative w-14 h-14 bg-gradient-to-b from-zinc-800 to-black border border-white/10 rounded-xl flex items-center justify-center shadow-lg group-hover:border-orange-500/40 transition-colors">
                <div className="absolute inset-0 bg-orange-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Flame size={32} className="text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold tracking-[0.15em] text-white uppercase leading-none drop-shadow-md">
                  {COMPANY_NAME}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-[9px] font-mono font-bold uppercase tracking-widest rounded border border-orange-500/20">
                    Official
                  </span>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase">
                    Tactical & Military Gear
                  </p>
                </div>
              </div>
            </div>
            
            {/* Serial Number Badge */}
            <div className="flex flex-col items-end gap-1">
               <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">Серійний номер</span>
               <div className={`relative px-4 py-1.5 bg-white/5 border border-white/10 rounded backdrop-blur-sm overflow-hidden ${isGenerating ? 'animate-pulse' : ''}`}>
                 <span className={`font-mono text-lg tracking-widest ${isGenerating ? 'text-transparent blur-sm' : 'text-orange-100 text-shadow-orange'}`}>
                   {data.code || '####-####-####'}
                 </span>
                 {isGenerating && (
                    <div className="absolute inset-0 bg-white/10 skew-x-12 animate-shimmer"></div>
                 )}
               </div>
            </div>
          </div>

          {/* Center Content (Amount) */}
          <div className="relative z-10 flex-1 flex flex-col justify-center items-center py-2">
            <div className="relative z-20">
              <span className="block text-center text-zinc-600/70 uppercase tracking-[0.8em] text-[10px] font-bold mb-2">
                Подарунковий сертифікат
              </span>
              <div className="flex items-start justify-center">
                 <h2 className="text-7xl lg:text-8xl font-display font-bold text-white drop-shadow-2xl tracking-tighter">
                  {formattedAmount}
                </h2>
                <span className="text-3xl font-light text-orange-500 mt-4 ml-2">₴</span>
              </div>
            </div>
            
            {/* Recipient Line */}
            <div className="mt-6 w-full max-w-[80%] mx-auto relative">
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
              {data.recipientName ? (
                 <div className="text-center pb-2">
                   <span className="text-xs text-zinc-500 uppercase tracking-widest mr-2">Власник:</span>
                   <span className="font-display text-lg text-orange-50 text-shadow-sm uppercase tracking-wider">{data.recipientName}</span>
                 </div>
              ) : (
                <div className="h-8"></div> // Spacer
              )}
            </div>
          </div>

          {/* Footer Section */}
          <div className="relative z-10 bg-gradient-to-t from-black via-black/90 to-transparent px-8 py-6 flex justify-between items-end">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-widest flex items-center gap-2">
                <Shield size={10} /> Дійсний до
              </span>
              <span className="text-lg text-white font-mono font-bold tracking-wider">
                {data.expiryDate || 'DD.MM.YYYY'}
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col text-right">
                <span className="text-[9px] text-zinc-600 uppercase tracking-widest mb-0.5">Веб-сайт</span>
                <span className="text-xs text-orange-500 font-bold tracking-[0.2em] uppercase hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-orange-500">
                  {WEBSITE_URL}
                </span>
              </div>
              <div className="p-1.5 bg-white rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                 <QrCode className="w-12 h-12 text-[#080808]" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Holographic / Shiny Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay"></div>
          
          {/* Tactical Edge Accent */}
          <div className="absolute left-0 top-10 h-12 w-[3px] bg-orange-600/80 shadow-[0_0_8px_#f97316]"></div>
          <div className="absolute right-0 bottom-10 h-12 w-[3px] bg-zinc-600/50"></div>
        </div>
      </div>
    </div>
  );
};