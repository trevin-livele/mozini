'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface HeroSlide {
  type: 'video' | 'image';
  src: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  href: string;
}

const slides: HeroSlide[] = [
  {
    type: 'video',
    src: '/IMG_9576.mov',
    label: 'WELCOME TO',
    title: 'MOZINI',
    subtitle: 'Watches & Gifts',
    description: 'THE PERFECT GIFT DOES EXIST!',
    cta: 'SHOP NOW',
    href: '/shop',
  },
  {
    type: 'image',
    src: '/images/necklaces/image00001.jpeg',
    label: "VALENTINE'S COLLECTION",
    title: '',
    subtitle: '"SAY IT WITHOUT WORDS"',
    description: 'CURATED GIFTS/ WATCHES/JEWELRY/ FLOWER BOUQUETS',
    cta: 'SHOP NOW',
    href: '/shop?category=Jewelry',
  },
  {
    type: 'image',
    src: '/images/gift-cards/image00001.jpeg',
    label: 'GALENTINES MOZINI GAME',
    title: '',
    subtitle: 'CELEBRATE SISTERHOOD IN STYLE',
    description: 'GIFTS/GALENTINES THEMED GAME/ PERSONALIZED WINE',
    cta: 'SHOP NOW',
    href: '/shop?category=Gifts',
  },
  {
    type: 'image',
    src: '/images/curren/image00001.jpeg',
    label: 'DEAL OF THE MONTH',
    title: '',
    subtitle: 'EVERY ORDER COMES WITH A FREE DESKTOP CALENDAR',
    description: 'WATCHES/ JEWELRY/GIFTS',
    cta: 'SHOP NOW',
    href: '/shop',
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [canAutoAdvance, setCanAutoAdvance] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset and play video when component mounts or when returning to first slide
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (currentIndex === 0) {
      // Reset video state
      setIsVideoPlaying(true);
      setCanAutoAdvance(false);
      
      // Reset and play video
      video.currentTime = 0;
      video.play().catch(err => console.log('Video play failed:', err));
    }
  }, [currentIndex]);

  // Handle video end
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      setIsVideoPlaying(false);
      setCanAutoAdvance(true);
      // Wait 1 second after video ends, then advance
      setTimeout(() => {
        setCurrentIndex(1);
      }, 1000);
    };

    video.addEventListener('ended', handleVideoEnd);
    return () => video.removeEventListener('ended', handleVideoEnd);
  }, []);

  // Auto-advance carousel (only after video has played)
  useEffect(() => {
    if (!canAutoAdvance || currentIndex === 0) return;

    autoAdvanceTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (autoAdvanceTimerRef.current) {
        clearInterval(autoAdvanceTimerRef.current);
      }
    };
  }, [canAutoAdvance, currentIndex]);

  const goToSlide = (index: number) => {
    // Allow going back to video slide - it will replay
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    if (currentIndex === 0 && isVideoPlaying) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex];
  
  // Decorative icons for each slide
  const getSlideIcon = (index: number) => {
    const icons = ['', '💕', '🎮', '🤝'];
    return icons[index] || '';
  };

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-black">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background - Video or Image */}
          {slide.type === 'video' ? (
            <video
              ref={videoRef}
              src={slide.src}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.src})` }}
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="relative z-20 h-full flex items-center justify-center">
            <div className="text-center text-white px-6 max-w-4xl">
              {/* Decorative Icon */}
              {getSlideIcon(index) && (
                <div className="text-5xl md:text-6xl mb-4 animate-pulse">
                  {getSlideIcon(index)}
                </div>
              )}

              {/* Label */}
              <p className="text-sm md:text-base tracking-[0.3em] mb-4 font-light">
                {slide.label}
              </p>

              {/* Title */}
              {slide.title && (
                <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold mb-2 tracking-wider">
                  {slide.title}
                </h1>
              )}

              {/* Subtitle */}
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl mb-6 tracking-wide">
                {slide.subtitle}
              </h2>

              {/* Description */}
              <p className="text-sm md:text-base tracking-[0.2em] mb-8 font-light">
                {slide.description}
              </p>

              {/* CTA Button */}
              <Link
                href={slide.href}
                className="inline-block bg-white text-black px-12 py-4 text-sm tracking-[0.2em] font-semibold hover:bg-gray-200 transition-colors"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={currentIndex === 0 && isVideoPlaying}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        disabled={currentIndex === 0 && isVideoPlaying}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'w-10 bg-white'
                : 'w-3 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 z-30 bg-black/40 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full">
        {currentIndex + 1} / {slides.length}
      </div>
    </section>
  );
}
