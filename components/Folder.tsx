import * as React from 'react';
import { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, ScanLine, Grip, Fingerprint, X } from 'lucide-react';
import { Project } from '../types';
import Noise from './Noise';
import DataViz from './DataViz';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
  isActive: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, delay = 0, className = "", isActive }) => {
  const [displayText, setDisplayText] = useState(text);
  const wasActiveRef = useRef(isActive);
  
  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      wasActiveRef.current = false;
      return;
    }

    if (isActive && !wasActiveRef.current) {
      setDisplayText("");
      const startTimeout = window.setTimeout(() => {
        let i = 0;
        const interval = window.setInterval(() => {
          setDisplayText(text.slice(0, i));
          i++;
          if (i > text.length) {
            window.clearInterval(interval);
          }
        }, 12); 
        
        return () => window.clearInterval(interval);
      }, delay * 1000);

      wasActiveRef.current = true;
      return () => window.clearTimeout(startTimeout);
    }
  }, [text, delay, isActive]);

  return (
    <span className={`${className} relative inline-block`}>
      {displayText}
      <span className="invisible select-none pointer-events-none" aria-hidden="true">
        {text.slice(displayText.length)}
      </span>
    </span>
  );
};

interface FolderProps {
  project: Project;
  isActive: boolean;
  index: number;
  total: number;
  onClick: () => void;
  onImageClick?: (url: string) => void;
  scatter: {
    x: string | number;
    y: string | number;
    rotation: number;
  };
}

const Folder: React.FC<FolderProps> = ({ project, isActive, index, total, onClick, onImageClick, scatter }) => {
  const [hasEntered, setHasEntered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isDark = project.color === '#2C2B29';
  const textColor = isDark ? 'text-white' : 'text-paper-900';
  const borderColor = isDark ? 'border-white/20' : 'border-paper-900/20';
  const mutedTextColor = isDark ? 'text-white/40' : 'text-paper-900/40';

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 2500 + (total * 150));
    return () => clearTimeout(timer);
  }, [total]);

  const restingDimensions = useMemo(() => {
    const baseHeight = 620; 
    const minWidth = 840;   
    
    let width = baseHeight * project.aspectRatio;
    if (project.aspectRatio < 1.2) {
      width = minWidth; 
    }

    return { 
      width: Math.max(minWidth, width), 
      height: baseHeight 
    };
  }, [project.aspectRatio]);

  const containerVariants = {
    inactive: { opacity: 1 },
    active: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const lineVariants = {
    inactive: { opacity: 0.15 },
    active: { 
      opacity: 0.3,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <motion.div
      layout={false}
      initial={{ 
        x: '-50%',
        y: '120vh', 
        rotate: scatter.rotation + 35, 
        scale: 1.1, 
        opacity: 0 
      }}
      animate={{
        x: isActive ? '-50%' : `calc(-50% + ${scatter.x})`,
        y: isActive ? '-50%' : `calc(-50% + ${scatter.y})`,
        rotate: isActive ? 0 : scatter.rotation,
        scale: isActive ? 1 : 0.65,
        zIndex: isActive ? 50 : index + 1, 
        opacity: isActive ? 1 : (index < 6 ? 1 : 0.4),
      }}
      whileHover={!isActive ? { 
        scale: 0.68,
        y: `calc(-51% + ${scatter.y})`, 
        transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] }
      } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{
        default: {
            type: "spring",
            stiffness: isActive ? 160 : 110, 
            damping: isActive ? 28 : 18,
            mass: isActive ? 0.7 : 1.3,
            restDelta: 0.001,
            delay: hasEntered ? 0 : (index * 0.18)
        },
        opacity: { duration: 0.8, ease: "easeOut" },
        zIndex: { delay: isActive ? 0 : 0.1 } 
      }}
      className={`absolute perspective-1000 will-change-transform ${isActive ? 'w-[94%] max-w-7xl h-[90%] cursor-default' : 'cursor-pointer'}`}
      style={{ 
        top: '50%',
        left: '50%',
        width: !isActive ? `${restingDimensions.width}px` : undefined,
        height: !isActive ? `${restingDimensions.height}px` : undefined,
      }}
      onClick={!isActive ? onClick : undefined}
    >
      {/* Folder Tab */}
      <div 
        className={`absolute -right-12 top-16 w-14 h-48 rounded-r-sm shadow-[10px_0_25px_-5px_rgba(0,0,0,0.12)] flex items-center justify-center transition-colors duration-500 z-0 border-y border-r ${borderColor} paper-texture`}
        style={{ backgroundColor: project.color }}
      >
         <div className="transform rotate-90 flex items-center gap-4 whitespace-nowrap">
            <span className={`font-mono text-[11px] font-black uppercase tracking-widest ${mutedTextColor}`}>ID:</span>
            <span className={`font-display font-black tracking-widest text-lg ${textColor}`}>{project.code}</span>
         </div>
      </div>

      <div 
        className={`relative w-full h-full rounded-sm overflow-hidden flex flex-col border border-opacity-30 ${isDark ? 'border-white' : 'border-black'} transition-all duration-700 paper-texture ${isActive ? 'shadow-[0_100px_140px_-40px_rgba(0,0,0,0.4)]' : 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)]'}`}
        style={{ backgroundColor: project.color }}
      >
        <Noise opacity={isDark ? 0.18 : 0.1} />

        {/* Header Strip */}
        <div className={`h-16 md:h-20 border-b ${borderColor} flex items-center px-8 md:px-12 justify-between shrink-0 relative z-10 bg-black/5`}>
          <div className="flex items-center gap-8">
             <div className={`w-3 h-3 md:w-4 h-4 rounded-full ring-2 ring-offset-2 ring-offset-transparent ${isActive ? 'bg-industrial-orange ring-industrial-orange/40 animate-pulse' : 'bg-industrial-orange/20 ring-transparent'}`} />
             <h2 className={`font-display font-black text-2xl md:text-3xl lg:text-4xl uppercase tracking-tighter ${textColor} truncate max-w-[200px] sm:max-w-none`}>
                <TypewriterText text={project.title} isActive={isActive} delay={0.1} />
             </h2>
             <motion.span 
              initial={false}
              animate={{ opacity: isActive ? 1 : 0.4 }}
              className={`font-mono text-[9px] px-2 py-1 border-2 ${borderColor} rounded-sm ${mutedTextColor} hidden lg:block font-black tracking-[0.2em]`}>
                DOC_AUTH_FINAL_VER_2.1
             </motion.span>
          </div>
          <div className="flex items-center gap-8">
             {isActive && (
                 <button 
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    className={`p-2 hover:bg-black/15 rounded-full transition-all ${textColor} active:scale-90`}
                 >
                    <X size={32} strokeWidth={2.5} />
                 </button>
             )}
             {!isActive && (
                <Fingerprint size={32} className={mutedTextColor} strokeWidth={1.5} />
             )}
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 p-6 md:p-8 lg:p-10 flex gap-10 md:gap-14 lg:gap-20 relative z-10 overflow-hidden`}>
            
            {/* Left Metadata Column - Optimizado para evitar scroll */}
            <motion.div 
              variants={containerVariants}
              initial="inactive"
              animate="active"
              className={`w-[45%] lg:w-[40%] xl:w-[35%] flex flex-col font-mono text-sm ${textColor} border-r ${borderColor} pr-8 md:pr-10 lg:pr-12 overflow-y-auto custom-scrollbar h-full space-y-4 lg:space-y-5`}
            >
                {/* 01. Summary */}
                <div className="space-y-1 lg:space-y-2">
                    <p className={`text-[10px] uppercase tracking-[0.5em] font-black ${mutedTextColor}`}>01_CONCEPT_SUMMARY</p>
                    <div className="leading-[1.4] opacity-95 text-[12px] font-sans font-semibold tracking-tight">
                      <TypewriterText text={project.description} isActive={isActive} delay={0.6} />
                    </div>
                </div>

                <motion.div variants={lineVariants} className={`h-[1px] w-full shrink-0 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />

                {/* 02. Taxonomy */}
                <div className="space-y-1 lg:space-y-2">
                     <p className={`text-[10px] uppercase tracking-[0.5em] font-black ${mutedTextColor}`}>02_TAG_TAXONOMY</p>
                     <div className="flex flex-row flex-wrap gap-x-2 gap-y-1.5 items-center">
                        {project.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className={`px-2 py-1 border border-current border-opacity-30 text-[9px] font-black uppercase tracking-widest bg-black/5 rounded-[1px] whitespace-nowrap`}
                            >
                              {tag}
                            </span>
                        ))}
                     </div>
                </div>

                <motion.div variants={lineVariants} className={`h-[1px] w-full shrink-0 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />

                {/* 03. Signal Module */}
                <div className="space-y-1 lg:space-y-2">
                    <div className="flex justify-between items-end">
                      <p className={`text-[10px] uppercase tracking-[0.5em] font-black ${mutedTextColor}`}>03_SIGNAL_VISUALIZER</p>
                      <ScanLine size={16} className={mutedTextColor} />
                    </div>
                    
                    <div className={`p-2 border rounded-sm h-[80px] lg:h-[100px] w-full flex items-center justify-center transition-all duration-1000 ${isDark ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/5 shadow-inner'}`}>
                        <DataViz data={project.stats} color={isDark ? '#fff' : '#000'} height={isActive ? 70 : 60} width={340} animate={isActive} />
                    </div>
                    
                    <div className="flex justify-between text-[8px] font-black opacity-30 tracking-[0.3em] pt-1">
                        <span>LO_FREQ</span>
                        <span>MID_SYNC</span>
                        <span>HI_FREQ</span>
                    </div>
                </div>
            </motion.div>

            {/* Right Visual Column */}
            <div className="flex-1 relative flex flex-col h-full overflow-hidden justify-center">
                <div 
                  className={`relative flex-grow bg-black/5 p-4 md:p-6 border border-black/10 shadow-inner overflow-hidden flex items-center justify-center ${isActive ? 'cursor-zoom-in' : ''}`}
                  onClick={() => isActive && onImageClick?.(project.imageUrl)}
                >
                    <div className="w-full h-full relative flex items-center justify-center">
                        <motion.img 
                            src={project.imageUrl} 
                            alt={project.title} 
                            animate={{ 
                                scale: isActive ? 1 : 0.98,
                                filter: (isActive || isHovered) ? 'grayscale(0%)' : 'grayscale(100%)',
                                opacity: (isActive || isHovered) ? 1 : 0.85
                            }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className={`max-w-full max-h-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] lg:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] object-contain ${isActive ? 'hover:scale-[1.015]' : ''}`}
                        />
                         <div className="absolute inset-0 pointer-events-none opacity-20 micro-grid" />
                    </div>
                </div>

                {/* Technical Attachment Footer */}
                <div className="mt-6 md:mt-8 flex justify-between items-center px-4 shrink-0">
                    <div className="flex items-center gap-4 md:gap-6">
                        <Paperclip size={24} className={textColor} />
                        <span className={`text-[10px] md:text-[12px] font-mono font-black uppercase tracking-[0.4em] ${textColor} border-b border-current border-opacity-20 pb-1`}>
                           ATTACHMENT_{project.code}.DAT
                        </span>
                    </div>
                    <div className="flex gap-3 md:gap-4 items-center">
                        <div className="w-3 h-3 md:w-4 h-4 rounded-full border border-current opacity-20" />
                        <div className="w-3 h-3 md:w-4 h-4 rounded-full border border-current opacity-50" />
                        <motion.div 
                          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                          className="w-3 h-3 md:w-4 h-4 rounded-full bg-industrial-orange shadow-[0_0_15px_rgba(255,51,0,0.4)]" 
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* System Footer Strip */}
        <div className={`h-12 md:h-16 border-t ${borderColor} bg-black/10 flex items-center justify-between px-8 md:px-12 z-10 shrink-0`}>
             <p className={`text-[9px] md:text-[11px] font-mono font-black tracking-[0.4em] md:tracking-[0.6em] uppercase ${mutedTextColor} truncate pr-4`}>
                RESTRICTED_ACCESS_SECURE_NODE_1A // AUTH_LEVEL_5
             </p>
             <div className="flex items-center gap-4 md:gap-6 shrink-0">
                <span className={`text-[9px] md:text-[10px] font-mono font-bold ${mutedTextColor} opacity-60 hidden sm:inline`}>CRC_CHECK_SUCCESSFUL</span>
                <Grip size={20} className={mutedTextColor} />
             </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Folder;