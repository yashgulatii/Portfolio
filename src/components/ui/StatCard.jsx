import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function StatCard({ value, label, isString = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView && !isString) {
      const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
      let startTimestamp = null;
      const duration = 1200;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // ease out quad
        const easeProgress = progress * (2 - progress);
        setCount(Math.floor(easeProgress * numericValue));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(numericValue);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [isInView, value, isString]);

  const displayValue = isString ? value : (count + (value.includes('+') ? '+' : ''));

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
      >
        <div className="font-mono text-4xl md:text-5xl text-accent mb-2">
          {displayValue}
        </div>
        <div className="text-text-secondary text-sm">
          {label}
        </div>
      </motion.div>
    </div>
  );
}
