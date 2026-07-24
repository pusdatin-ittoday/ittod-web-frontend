import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion as Motion } from 'motion/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * EventGallery — Carousel foto dokumentasi acara.
 * Model sama seperti MemoriesCarousel di Home:
 * gambar tengah aktif, kiri/kanan mengecil + gelap,
 * klik gambar samping untuk pindah, pagination dots + panah.
 *
 * @param {string[]} images - Array path gambar (dari /public).
 * @param {string}   title  - Judul seksi galeri.
 */
const EventGallery = ({ images = [], title = 'Dokumentasi' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragCurrentX = useRef(0);
  const containerRef = useRef(null);

  const totalSlides = images.length;

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
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const onTouchStart = useCallback((e) => handleDragStart(e.touches[0].clientX), [handleDragStart]);
  const onTouchMove = useCallback((e) => handleDragMove(e.touches[0].clientX), [handleDragMove]);
  const onTouchEnd = useCallback(() => handleDragEnd(), [handleDragEnd]);
  const onMouseDown = useCallback((e) => { e.preventDefault(); handleDragStart(e.clientX); }, [handleDragStart]);
  const onMouseMove = useCallback((e) => handleDragMove(e.clientX), [handleDragMove]);
  const onMouseUp = useCallback(() => handleDragEnd(), [handleDragEnd]);
  const onMouseLeave = useCallback(() => { if (isDragging) handleDragEnd(); }, [isDragging, handleDragEnd]);

  const getSlideStyle = (index) => {
    let offset = index - activeIndex;
    if (offset > totalSlides / 2) offset -= totalSlides;
    if (offset < -totalSlides / 2) offset += totalSlides;

    const isActive = offset === 0;
    const isAdjacent = Math.abs(offset) === 1;

    if (isActive) {
      return { x: '0%', scale: 1, opacity: 1, zIndex: 30, filter: 'brightness(1)' };
    }
    if (isAdjacent) {
      const direction = offset > 0 ? 1 : -1;
      return { x: `${direction * 105}%`, scale: 0.78, opacity: 0.7, zIndex: 20, filter: 'brightness(0.7)' };
    }
    const direction = offset > 0 ? 1 : -1;
    return { x: `${direction * 200}%`, scale: 0.6, opacity: 0, zIndex: 10, filter: 'brightness(0.5)' };
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full">
      {/* Section title */}
      <h3 className="mb-5 w-fit border-b-[3px] border-yellow-neo pb-1 font-inter text-sm font-black uppercase tracking-widest text-[#171918]">
        {title}
      </h3>

      {/* Carousel viewport */}
      <div
        ref={containerRef}
        className="relative mx-auto h-[220px] w-full max-w-3xl sm:h-[260px] md:h-[300px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {images.map((src, index) => {
            const style = getSlideStyle(index);
            const isActive = index === activeIndex;

            return (
              <Motion.div
                key={src + index}
                className="absolute flex w-[70%] max-w-[420px] flex-col items-center sm:w-[60%] md:w-[55%]"
                animate={{
                  x: style.x,
                  scale: style.scale,
                  opacity: style.opacity,
                  filter: style.filter,
                }}
                whileHover={!isActive ? { scale: style.scale * 1.05, filter: 'brightness(0.9)' } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
                onClick={() => {
                  if (Math.abs(dragStartX.current - dragCurrentX.current) < 5 && !isActive) {
                    goTo(index);
                  }
                }}
                style={{
                  zIndex: style.zIndex,
                  transformOrigin: 'center center',
                  cursor: isActive ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
                }}
              >
                <div className="aspect-[4/3] w-full overflow-hidden border-[4px] border-[#1a1c1c] bg-black">
                  <img
                    src={src}
                    alt={`Foto dokumentasi ${index + 1}`}
                    className="h-full w-full object-cover"
                    draggable={false}
                    loading="lazy"
                  />
                </div>
              </Motion.div>
            );
          })}
        </div>
      </div>

      {/* Pagination: Arrows + Dots */}
      <div className="mt-5 flex items-center justify-center gap-4 md:mt-6 md:gap-6">
        {/* Left Arrow */}
        <button
          onClick={goPrev}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-yellow-neo text-black shadow-[3px_3px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#000] md:h-10 md:w-10"
          aria-label="Previous slide"
        >
          <FiChevronLeft size={20} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {images.map((src, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'h-3 w-3 bg-[#1a1c1c]'
                  : 'h-2.5 w-2.5 bg-[#1a1c1c]/40 hover:bg-[#1a1c1c]/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : 'false'}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={goNext}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-yellow-neo text-black shadow-[3px_3px_0_#000] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#000] md:h-10 md:w-10"
          aria-label="Next slide"
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default EventGallery;
