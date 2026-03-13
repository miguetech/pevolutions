import { motion } from 'framer-motion';
import React from 'react';

export const AnimatedCard: React.FC<{ 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className={className}
  >
    {children}
  </motion.div>
);

export const AnimatedList: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
};

export const AnimatedListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={item}>
      {children}
    </motion.div>
  );
};
