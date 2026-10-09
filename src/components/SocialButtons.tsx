import { motion, AnimatePresence } from 'framer-motion';

export interface SocialButtonsProps {
  isOpen: boolean;
}

export function SocialButtons({ isOpen }: SocialButtonsProps) {
  const emailUrl = import.meta.env.VITE_SOCIAL_EMAIL || 'mailto:aaronf.suryanto@gmail.com';
  const whatsappUrl = import.meta.env.VITE_SOCIAL_WHATSAPP || 'https://wa.me/6282251785165';
  const linkedinUrl = import.meta.env.VITE_SOCIAL_LINKEDIN || 'https://www.linkedin.com/in/aaron-faustine-0802173a8/';
  const githubUrl = import.meta.env.VITE_SOCIAL_GITHUB || 'https://github.com/Aaronfs04';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.a
            key="social-email"
            layout
            href={emailUrl}
            className="icon-btn"
            aria-label="Email"
            initial={{ opacity: 0, x: 150, scale: 0.5 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.7, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } }}
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.8,
              delay: 0.1,
              layout: { type: 'spring', bounce: 0, duration: 0.8 },
            }}
            style={{ textDecoration: 'none', color: '#000000' }}
          >
            <svg
              style={{ width: '34%', height: '34%' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="3.5"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </motion.a>

          <motion.a
            key="social-whatsapp"
            layout
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            aria-label="WhatsApp"
            initial={{ opacity: 0, x: 150, scale: 0.5 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.7, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } }}
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.8,
              delay: 0.15,
              layout: { type: 'spring', bounce: 0, duration: 0.8 },
            }}
            style={{ textDecoration: 'none', color: '#000000' }}
          >
            <svg style={{ width: '36%', height: '36%' }} viewBox="0 0 24 24" fill="#000000">
              <path d="M12.01 2C6.48 2 2 6.48 2 12.01c0 1.77.46 3.49 1.34 5.01L2 22l5.12-1.34c1.47.8 3.13 1.23 4.89 1.23 5.53 0 10.01-4.48 10.01-10.01C22.02 6.48 17.54 2 12.01 2zm5.84 14.28c-.24.69-1.22 1.3-1.78 1.39-.5.08-1.15.11-1.85-.11-.42-.14-.97-.31-1.68-.62-2.95-1.28-4.88-4.27-5.02-4.46-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.26-.29.57-.37.76-.37.19 0 .38 0 .55.01.18.01.42-.07.65.49.24.57.82 2 .89 2.15.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.29.77 1.27 1.65 2.05 1.13 1.01 2.09 1.32 2.38 1.47.3.15.47.13.65-.08.17-.2.74-.86.94-1.15.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.34.07.13.07.74-.17 1.43z" />
            </svg>
          </motion.a>

          <motion.a
            key="social-linkedin"
            layout
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            aria-label="LinkedIn"
            initial={{ opacity: 0, x: 150, scale: 0.5 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.7, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } }}
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.8,
              delay: 0.2,
              layout: { type: 'spring', bounce: 0, duration: 0.8 },
            }}
            style={{ textDecoration: 'none', color: '#000000' }}
          >
            <svg style={{ width: '34%', height: '34%' }} viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="4.5" fill="#000000" />
              <circle cx="7.5" cy="7.5" r="1.5" fill="#ffffff" />
              <rect x="6.25" y="10" width="2.5" height="8" fill="#ffffff" />
              <path
                d="M11 10h2.4v1.1h.03c.33-.63 1.15-1.3 2.37-1.3 2.53 0 3 1.67 3 3.83V18h-2.5v-3.9c0-.93-.02-2.13-1.3-2.13-1.3 0-1.5 1.01-1.5 2.06V18H11V10z"
                fill="#ffffff"
              />
            </svg>
          </motion.a>

          <motion.a
            key="social-github"
            layout
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            aria-label="GitHub"
            initial={{ opacity: 0, x: 150, scale: 0.5 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.7, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } }}
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.8,
              delay: 0.25,
              layout: { type: 'spring', bounce: 0, duration: 0.8 },
            }}
            style={{ textDecoration: 'none', color: '#000000' }}
          >
            <svg style={{ width: '36%', height: '36%' }} viewBox="0 0 24 24" fill="#000000">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </motion.a>
        </>
      )}
    </AnimatePresence>
  );
}

