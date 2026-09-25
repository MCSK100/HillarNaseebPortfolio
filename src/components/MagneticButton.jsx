import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

export default function MagneticButton({ children, href, className = '', variant = 'primary', onClick }) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const rect = buttonRef.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);

    setPosition({ x: offsetX * 0.12, y: offsetY * 0.12 });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  const classes = `magnetic-button magnetic-button--${variant} ${className}`.trim();

  const content = (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={classes}
      whileHover={{ scale: 1.01 }}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.8 }}
      onClick={onClick}
      type="button"
    >
      {children}
    </motion.button>
  );

  if (href) {
    return (
      <a href={href} className="inline-flex" aria-label={typeof children === 'string' ? children : 'Action'}>
        {content}
      </a>
    );
  }

  return content;
}
