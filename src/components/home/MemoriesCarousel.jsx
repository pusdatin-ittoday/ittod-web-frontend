import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";

const GALLERY_ITEMS = [
  { id: 1, label: "SEMINAR", src: "/assets/gallery/seminar.jpeg" },
  { id: 2, label: "BOOTCAMP", src: "/assets/gallery/bootcamp.jpeg" },
  { id: 3, label: "WORKSHOP", src: "/assets/gallery/workshop.jpeg" },
  {
    id: 4,
    label: "GRAND FINAL UX TODAY",
    src: "/assets/gallery/grand-final-ux.JPG",
  },
  {
    id: 5,
    label: "GRAND FINAL MINE TODAY",
    src: "/assets/gallery/grand-final-mine.JPG",
  },
  {
    id: 6,
    label: "GRAND FINAL HACK TODAY",
    src: "/assets/gallery/grand-final-hack.JPG",
  },
  {
    id: 7,
    label: "GRAND FINAL GAME TODAY",
    src: "/assets/gallery/grand-final-game.JPG",
  },
  { id: 8, label: "AWARDING", src: "/assets/gallery/awarding.jpeg" },
];

/**
 * MemoriesCarousel — peek-style carousel showing 3 visible slides (center active + partial left/right).
 * Custom implementation using useState + CSS transform + touch/mouse drag.
 */
const MemoriesCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const containerRef = useRef(null);

  const totalSlides = GALLERY_ITEMS.length;

  const goTo = useCallback(
    (index) => {
      let next = index;
      if (next < 0) next = totalSlides - 1;
      if (next >= totalSlides) next = 0;
      setActiveIndex(next);
    },
    [totalSlides],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  // Touch/Mouse drag handlers
  const handleDragStart = useCallback((clientX) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    dragCurrentX.current = clientX;
  }, []);

  const handleDragMove = useCallback(
    (clientX) => {
      if (!isDragging) return;
      dragCurrentX.current = clientX;
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragStartX.current - dragCurrentX.current;
    const threshold = 50;
    if (diff > threshold) goNext();
    else if (diff < -threshold) goPrev();
  }, [isDragging, goNext, goPrev]);

  // Touch events
  const onTouchStart = useCallback(
    (e) => handleDragStart(e.touches[0].clientX),
    [handleDragStart],
  );
  const onTouchMove = useCallback(
    (e) => handleDragMove(e.touches[0].clientX),
    [handleDragMove],
  );
  const onTouchEnd = useCallback(() => handleDragEnd(), [handleDragEnd]);

  // Mouse events
  const onMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      handleDragStart(e.clientX);
    },
    [handleDragStart],
  );
  const onMouseMove = useCallback(
    (e) => handleDragMove(e.clientX),
    [handleDragMove],
  );
  const onMouseUp = useCallback(() => handleDragEnd(), [handleDragEnd]);
  const onMouseLeave = useCallback(() => {
    if (isDragging) handleDragEnd();
  }, [isDragging, handleDragEnd]);

  /**
   * Calculate offset position for each slide relative to the active one.
   * Returns an object with transform, scale, opacity, and zIndex.
   */
  const getSlideStyle = (index) => {
    let offset = index - activeIndex;

    // Wrap-around logic for seamless circular navigation
    if (offset > totalSlides / 2) offset -= totalSlides;
    if (offset < -totalSlides / 2) offset += totalSlides;

    const isActive = offset === 0;
    const isAdjacent = Math.abs(offset) === 1;

    if (isActive) {
      return {
        x: "0%",
        scale: 1,
        opacity: 1,
        zIndex: 30,
        filter: "brightness(1)",
      };
    }

    if (isAdjacent) {
      const direction = offset > 0 ? 1 : -1;
      return {
        x: `${direction * 105}%`,
        scale: 0.78,
        opacity: 0.7,
        zIndex: 20,
        filter: "brightness(0.7)",
      };
    }

    // Off-screen slides
    const direction = offset > 0 ? 1 : -1;
    return {
      x: `${direction * 200}%`,
      scale: 0.6,
      opacity: 0,
      zIndex: 10,
      filter: "brightness(0.5)",
    };
  };

  return (
    <div className="w-full">
      {/* Carousel viewport */}
      <div
        ref={containerRef}
        className="relative mx-auto h-[320px] w-full max-w-4xl sm:h-[360px] md:h-[400px] lg:h-[460px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {/* Arrow buttons removed to match reference image */}

        {/* Slides */}
        <div className="absolute inset-0 flex items-center justify-center">
          {GALLERY_ITEMS.map((item, index) => {
            const style = getSlideStyle(index);
            const isActive = index === activeIndex;

            return (
              <Motion.div
                key={item.id}
                className="absolute flex w-[70%] max-w-[480px] flex-col items-center sm:w-[60%] md:w-[55%]"
                animate={{
                  x: style.x,
                  scale: style.scale,
                  opacity: style.opacity,
                  filter: style.filter,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8,
                }}
                style={{
                  zIndex: style.zIndex,
                  transformOrigin: "center center",
                }}
              >
                {/* Image container */}
                <div
                  className="aspect-[4/3] w-full overflow-hidden border-[4px] border-[#1a1c1c] bg-black"
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    className="h-full w-full object-cover"
                    draggable={false}
                    loading="lazy"
                  />
                </div>

                {/* Label */}
                <p
                  className={`mt-3 text-center font-inter text-xs font-black uppercase tracking-[0.06em] sm:text-sm md:mt-4 md:text-base ${isActive ? "text-[#1a1c1c]" : "text-[#1a1c1c]/60"
                    }`}
                >
                  {item.label}
                </p>
              </Motion.div>
            );
          })}
        </div>
      </div>

      {/* Dot pagination */}
      <div className="mt-6 flex items-center justify-center gap-2 sm:mt-8 md:gap-2.5">
        {GALLERY_ITEMS.map((item, index) => (
          <button
            key={item.id}
            onClick={() => goTo(index)}
            className={`rounded-full transition-all duration-300 ${index === activeIndex
              ? "h-3 w-3 bg-[#1a1c1c] md:h-3.5 md:w-3.5"
              : "h-2.5 w-2.5 bg-[#1a1c1c]/40 hover:bg-[#1a1c1c]/60 md:h-3 md:w-3"
              }`}
            aria-label={`Go to slide ${index + 1}: ${item.label}`}
            aria-current={index === activeIndex ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoriesCarousel;
