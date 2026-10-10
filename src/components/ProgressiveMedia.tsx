import { useState, useRef, useEffect, type CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}

export function ProgressiveImage({ src, alt, className, style }: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const tinySrc = src.replace(/\.(png|jpg|jpeg|webp)$/, '-tiny.jpg');

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Blurred thumbnail placeholder */}
      <motion.img
        src={tinySrc}
        alt={alt + ' placeholder'}
        className={className}
        style={{
          ...style,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      {/* Actual High Res Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoaded(true)}
        style={{
          ...style,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: isLoaded ? 'none' : 'blur(10px)',
          transition: 'filter 0.5s ease',
        }}
      />
    </div>
  );
}

interface ProgressiveVideoProps {
  src: string;
  className?: string;
  style?: CSSProperties;
}

export function ProgressiveVideo({ src, className, style }: ProgressiveVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tinySrc = src.replace(/\.mp4$/, '-tiny.jpg');
  const webmSrc = src.replace(/\.mp4$/, '.webm');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    if (video.readyState >= 2) {
      setIsLoaded(true);
    }

    video.load();
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (video) {
          video.muted = true;
          video.play().catch(() => {});
        }
      });
    }

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [src, webmSrc]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Blurred thumbnail placeholder */}
      <motion.img
        src={tinySrc}
        alt="Video placeholder"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      {/* Actual Video with WebM primary and MP4 fallback */}
      <video
        ref={videoRef}
        className={className}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        onCanPlay={() => setIsLoaded(true)}
        onPlaying={() => setIsLoaded(true)}
        style={{
          ...style,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          filter: isLoaded ? 'none' : 'blur(10px)',
          transition: 'filter 0.5s ease',
        }}
      >
        <source src={webmSrc} type="video/webm" />
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
