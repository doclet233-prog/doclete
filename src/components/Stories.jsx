import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const stories = [
  {
    id: 1,
    src: '/story/1.jpg',
    label: 'Our Beginning',
    description: 'Where the aroma of freshly baked dreams first filled the air. Crafting joy from scratch.',
  },
  {
    id: 2,
    src: '/story/2.jpg',
    label: 'The Ingredients',
    description: 'Only the finest organic flour, farm-fresh butter, and wild berries sourced locally.',
  },
  {
    id: 3,
    src: '/story/3.jpg',
    label: 'Artisanal Craft',
    description: 'Rising with the sun. Hand-kneaded dough, shaped by passionate master bakers.',
  },
  {
    id: 4,
    src: '/story/4.jpg',
    label: 'Golden Crust',
    description: 'Perfecting our signature 24-hour slow-fermentation sourdough loaf.',
  },
  {
    id: 5,
    src: '/story/5.jpg',
    label: 'Sweet Treats',
    description: 'Delicate pastries and elegant patisserie made to sweeten your special moments.',
  },
  {
    id: 6,
    src: '/story/6.jpg',
    label: 'Dolcetto Love',
    description: 'Bringing smiles and warmth to your table, one delicious bite at a time.',
  },
];

const Stories = () => {
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const pressStartTime = useRef(0);
  const pressStartPos = useRef({ x: 0, y: 0 });

  const closeStory = () => {
    setActiveStoryIndex(null);
    setProgress(0);
    setIsPaused(false);
  };

  const handleNext = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setProgress(0);
    } else {
      closeStory();
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex === null) return;
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setProgress(0);
    } else {
      setProgress(0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeStoryIndex === null) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        closeStory();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStoryIndex]);

  // Story progression timer
  useEffect(() => {
    if (activeStoryIndex === null) return;
    if (isPaused) return;

    const duration = 5000; // 5 seconds per story
    const intervalTime = 30; // 33 fps for high smoothness
    const increment = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeStoryIndex, isPaused]);

  const handlePressStart = (e) => {
    setIsPaused(true);
    pressStartTime.current = Date.now();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    pressStartPos.current = { x: clientX, y: clientY };
  };

  const handlePressEnd = (e) => {
    setIsPaused(false);
    const pressDuration = Date.now() - pressStartTime.current;
    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || 0;
    const deltaX = Math.abs(clientX - pressStartPos.current.x);
    const deltaY = Math.abs(clientY - pressStartPos.current.y);

    // If it was a quick tap without significant dragging, handle navigation
    if (pressDuration < 250 && deltaX < 10 && deltaY < 10) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const width = rect.width;
      if (clickX < width * 0.35) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  const stopPropagationProps = {
    onMouseDown: (e) => e.stopPropagation(),
    onMouseUp: (e) => e.stopPropagation(),
    onTouchStart: (e) => e.stopPropagation(),
    onTouchEnd: (e) => e.stopPropagation(),
    onClick: (e) => e.stopPropagation(),
  };

  return (
    <section id="stories" className="py-24 bg-warmDark overflow-hidden select-none">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <span className="uppercase tracking-[0.3em] text-gold text-sm font-bold mb-3 block">
              Bakery Stories
            </span>
            <h2 className="text-4xl md:text-6xl font-serif gold-gradient">Fresh Moments</h2>
          </div>
          <span className="text-white/35 uppercase tracking-[0.2em] text-xs font-semibold">
            <span className="hidden md:inline">Hover to fan out • Click to view</span>
            <span className="md:hidden">Swipe to browse • Tap to view</span>
          </span>
        </div>

        {/* 1. Desktop 3D Stacked Card Deck (Fans out beautifully on hover) - Scaled Up for Big Screens */}
        <div
          className="hidden md:flex relative h-[550px] lg:h-[620px] w-full items-center justify-center py-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {stories.map((story, index) => {
            const centerOffset = index - 2.5; // Offset multiplier: -2.5, -1.5, -0.5, 0.5, 1.5, 2.5
            
            return (
              <motion.button
                key={story.id}
                type="button"
                animate={{
                  x: isHovered ? centerOffset * 170 : centerOffset * 12,
                  y: isHovered ? Math.abs(centerOffset) * 20 - 30 : index * -6,
                  rotate: isHovered ? centerOffset * 6 : centerOffset * 2.5,
                  scale: isHovered ? 1 : 1 - index * 0.015,
                  zIndex: isHovered ? 20 + index : 20 - index,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                onClick={() => {
                  setActiveStoryIndex(index);
                  setProgress(0);
                  setIsPaused(false);
                }}
                className="absolute w-72 h-[420px] lg:w-80 lg:h-[480px] rounded-[2rem] border border-gold/30 overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.75)] bg-softBlack cursor-pointer group focus:outline-none transition-shadow duration-300 hover:shadow-[0_35px_80px_rgba(212,175,55,0.22)]"
              >
                {/* Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={story.src}
                    alt={story.label}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent transition-opacity duration-300" />
                </div>

                {/* Card Monogram & Text */}
                <div className="absolute inset-x-0 bottom-0 p-6 text-left pointer-events-none z-10 flex flex-col justify-between h-full">
                  <div className="self-end w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-serif text-gold text-xs font-bold italic">d</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-1.5 block">
                      Story 0{story.id}
                    </span>
                    <h3 className="font-serif text-white text-xl lg:text-2xl font-bold tracking-wide">
                      {story.label}
                    </h3>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* 2. Mobile Polaroid Snapping List (Tactile Scattered Feel) - Responsive viewport fit */}
        <div className="flex md:hidden gap-6 overflow-x-auto pb-14 pt-4 px-[9vw] snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stories.map((story, index) => {
            const rotations = [-3, 2, -4, 3, -2, 4];
            const rotation = rotations[index % rotations.length];
            return (
              <motion.button
                key={story.id}
                type="button"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setActiveStoryIndex(index);
                  setProgress(0);
                  setIsPaused(false);
                }}
                className="shrink-0 snap-center w-[82vw] h-[54vh] max-w-[340px] max-h-[460px] rounded-[2rem] border border-gold/30 overflow-hidden shadow-2xl bg-softBlack relative group focus:outline-none"
                style={{
                  rotate: `${rotation}deg`,
                }}
              >
                <div className="absolute inset-0">
                  <img
                    src={story.src}
                    alt={story.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
                </div>
                
                <div className="absolute inset-x-0 bottom-0 p-6 text-left pointer-events-none">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-1 block">
                    Story 0{story.id}
                  </span>
                  <h3 className="font-serif text-white text-lg font-bold">
                    {story.label}
                  </h3>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Instagram Story Overlay (unchanged premium experience) */}
      <AnimatePresence>
        {activeStoryIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[150] bg-black/98 flex items-center justify-center select-none touch-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Main Interactive card */}
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.1, bottom: 0.8 }}
              onDragEnd={(event, info) => {
                // Swipe down to close
                if (info.offset.y > 120) {
                  closeStory();
                }
              }}
              className="relative w-full h-full md:h-[92vh] md:max-w-[450px] md:rounded-3xl md:overflow-hidden md:border md:border-gold/20 shadow-2xl flex flex-col justify-between overflow-hidden bg-softBlack"
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onTouchStart={(e) => handlePressStart(e)}
              onTouchEnd={(e) => handlePressEnd(e)}
            >
              {/* Story Images with transition */}
              <div className="absolute inset-0 z-0">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={activeStoryIndex}
                    src={stories[activeStoryIndex].src}
                    alt={stories[activeStoryIndex].label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                </AnimatePresence>
                {/* Vignette gradients to ensure text/progress bar readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />
              </div>

              {/* Progress Bars */}
              <div className="absolute top-4 inset-x-0 px-4 z-30 flex gap-1.5 pointer-events-none">
                {stories.map((story, index) => (
                  <div key={story.id} className="h-[3px] flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-light via-gold to-gold-dark transition-all duration-75 ease-linear rounded-full"
                      style={{
                        width:
                          index < activeStoryIndex
                            ? '100%'
                            : index === activeStoryIndex
                            ? `${progress}%`
                            : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Header bar */}
              <div className="absolute top-8 inset-x-0 px-4 z-30 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center bg-softBlack/85 shadow-md">
                    <span className="font-serif text-gold text-xs font-bold italic">d</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-serif text-gold font-bold text-sm leading-tight tracking-wider">
                      _.dolcetto._
                    </span>
                    <span className="text-[10px] text-white/60 tracking-widest uppercase">
                      Fresh Bakery
                    </span>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  type="button"
                  {...stopPropagationProps}
                  onClick={closeStory}
                  className="w-8 h-8 rounded-full bg-black/45 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/65 transition-all duration-200 pointer-events-auto"
                  aria-label="Close story"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Desktop-only Navigation Arrows */}
              <div className="absolute inset-y-0 -left-16 hidden xl:flex items-center justify-center pointer-events-none">
                <button
                  type="button"
                  {...stopPropagationProps}
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-warmDark/85 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-softBlack transition-all duration-200 pointer-events-auto shadow-lg"
                  aria-label="Previous story"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              
              <div className="absolute inset-y-0 -right-16 hidden xl:flex items-center justify-center pointer-events-none">
                <button
                  type="button"
                  {...stopPropagationProps}
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-warmDark/85 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-softBlack transition-all duration-200 pointer-events-auto shadow-lg"
                  aria-label="Next story"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Story Description (bottom overlay) */}
              <div className="absolute bottom-12 inset-x-0 px-6 z-30 pointer-events-none text-center">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeStoryIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-2.5 border border-gold/30 backdrop-blur-md">
                      {stories[activeStoryIndex].label}
                    </span>
                    <p className="text-white text-sm md:text-base font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] leading-relaxed">
                      {stories[activeStoryIndex].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Stories;
