import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { PROJECTS } from './constants';
import Folder from './components/Folder';
import { Activity, X } from 'lucide-react';
import Noise from './components/Noise';
import { motion, AnimatePresence } from 'framer-motion';

const SCATTER_POSITIONS = [
  { x: '-20vw', y: '-10vh', rotation: -5 },
  { x: '16vw', y: '-14vh', rotation: 4 },
  { x: '-26vw', y: '15vh', rotation: 8 }, // Ajustado para que se vea más la esquina de la imagen
  { x: '18vw', y: '12vh', rotation: -3 },
  { x: '3vw', y: '5vh', rotation: -2 },
];

const App: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const lastScrollTime = useRef(0);
  const SCROLL_COOLDOWN = 800;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (fullscreenImage) return;
      const now = Date.now();
      if (Math.abs(e.deltaY) < 30) return;
      if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;

      lastScrollTime.current = now;
      const direction = e.deltaY > 0 ? 1 : -1;

      setActiveProjectId(currentId => {
        if (!currentId) return direction > 0 ? PROJECTS[0].id : PROJECTS[PROJECTS.length - 1].id;
        
        const currentIndex = PROJECTS.findIndex(p => p.id === currentId);
        let nextIndex = currentIndex + direction;
        
        if (nextIndex >= PROJECTS.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = PROJECTS.length - 1;
        
        return PROJECTS[nextIndex].id;
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [fullscreenImage]);

  const handleClose = () => setActiveProjectId(null);

  const handleFolderClick = (id: string) => {
    if (activeProjectId === id) {
      handleClose();
    } else {
      setActiveProjectId(id);
    }
  };

  const closeFullscreen = () => setFullscreenImage(null);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative selection:bg-industrial-orange selection:text-white studio-bg vignette">
      <Noise opacity={0.08} />
      
      {/* 1. HEADER - Dark Mode #121212 */}
      <header className="shrink-0 z-[100] bg-[#121212] border-b border-white/5 shadow-2xl">
        <div className="max-w-[1600px] mx-auto px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <h1 className="font-display font-black text-3xl tracking-tighter uppercase leading-none text-white">PORTFOLIO</h1>
            </div>
            <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-white/5 border border-white/10 rounded-sm">
              <Activity size={12} className="text-industrial-orange animate-pulse" />
              <span className="font-mono text-[10px] font-black tracking-widest opacity-60 uppercase text-white">Designs</span>
            </div>
          </div>

          <div className="flex-1" />
        </div>
      </header>

      {/* 2. MAIN CANVAS */}
      <main className="flex-grow relative overflow-hidden z-10">
        <div className="absolute inset-0 micro-grid pointer-events-none" />
        
        <div className="h-full w-full relative overflow-hidden">
          <div className="max-w-[1600px] mx-auto w-full h-full relative">
            <div className="w-full h-full relative">
              {PROJECTS.map((project, index) => {
                const scatter = SCATTER_POSITIONS[index % SCATTER_POSITIONS.length];
                return (
                  <Folder 
                    key={project.id}
                    project={project}
                    isActive={activeProjectId === project.id}
                    index={index}
                    total={PROJECTS.length}
                    onClick={() => handleFolderClick(project.id)}
                    onImageClick={(url) => setFullscreenImage(url)}
                    scatter={scatter}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* LIGHTBOX / FULLSCREEN IMAGE */}
        <AnimatePresence>
          {fullscreenImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeFullscreen}
              className="fixed inset-0 z-[200] bg-[#121212]/95 flex flex-col items-center justify-center p-12 backdrop-blur-2xl cursor-zoom-out"
            >
              <Noise opacity={0.05} />
              
              <motion.button 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                onClick={(e) => { e.stopPropagation(); closeFullscreen(); }}
                className="absolute top-32 right-10 w-16 h-16 bg-industrial-orange text-white flex items-center justify-center rounded-sm shadow-[0_15px_40px_rgba(255,51,0,0.4)] hover:scale-110 active:scale-95 transition-all z-[220] pointer-events-auto group border border-white/30"
              >
                <motion.div
                  className="flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ rotate: { repeat: Infinity, duration: 1.2, ease: "linear" } }}
                >
                  <X size={40} strokeWidth={3} />
                </motion.div>
              </motion.button>

              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full h-full flex items-center justify-center cursor-default mt-16"
              >
                <img 
                  src={fullscreenImage} 
                  className="max-w-[85vw] max-h-[75vh] object-contain shadow-[0_100px_200px_rgba(0,0,0,0.95)] border border-white/10"
                  alt="Archive Full"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. FOOTER - Dark Mode #121212 */}
      <footer className="shrink-0 h-10 bg-[#121212] border-t border-white/5 px-10 flex items-center justify-between z-[110] text-[9px] font-mono uppercase tracking-[0.4em] text-white/40 font-black">
          <div className="flex gap-12">
            <span>INDEX_COUNT: {PROJECTS.length}</span>
            <span className="hidden sm:inline">STATUS: SECURE</span>
          </div>
          <div className="flex gap-6 items-center">
            <span className="opacity-50 tracking-normal font-sans font-bold">© 2024 DESIGN ARCHIVE</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-white/5" />
              <div className="w-1.5 h-1.5 bg-white/20" />
              <div className="w-1.5 h-1.5 bg-industrial-orange" />
            </div>
          </div>
      </footer>
    </div>
  );
};

export default App;