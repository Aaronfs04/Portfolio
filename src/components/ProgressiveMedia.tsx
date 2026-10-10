import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ProgressiveImage({ src, alt, className, style }: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const tinySrc = src.replace(/\.(png|jpg|jpeg|webp)$/, '-tiny.jpg');

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Thumbnail placeholder with blur */}
      <motion.img
        src={tinySrc}
        alt={alt + ' placeholder'}
        className={className}
        style={{
          ...style,
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          filter: 'blur(20px)',
          transform: 'scale(1.1)', // Prevent white edges from blur
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      {/* Actual High Res Image */}
      <motion.img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoaded(true)}
        style={{
          ...style,
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
    </div>
  );
}

interface ProgressiveVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ProgressiveVideo({ src, className, style }: ProgressiveVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const tinySrc = src.replace(/\.mp4$/, '-tiny.jpg');
  const webmSrc = src.replace(/\.mp4$/, '.webm');

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Thumbnail placeholder with blur */}
      <motion.img
        src={tinySrc}
        alt="Video placeholder"
        className={className}
        style={{
          ...style,
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      {/* Actual Video */}
      <motion.video
        className={className}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        style={{
          ...style,
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <source src={webmSrc} type="video/webm" />
        <source src={src} type="video/mp4" />
      </motion.video>
    </div>
  );
}

