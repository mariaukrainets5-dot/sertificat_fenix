import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon, 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-display font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500/50 overflow-hidden rounded-xl";
  
  const variants = {
    primary: "bg-orange-600 text-white hover:bg-orange-500 shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_4px_30px_rgba(234,88,12,0.5)] border border-orange-500/20",
    secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600",
    outline: "bg-transparent text-orange-500 border border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
  };

  return (
    <motion.button 
      whileHover={{ scale: props.disabled ? 1 : 1.01, y: props.disabled ? 0 : -1 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props as any}
    >
      {/* Animated Shine Effect for Primary */}
      {variant === 'primary' && !props.disabled && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full skew-x-12 group-hover:animate-[shimmer_1.5s_infinite]"></span>
      )}
      
      {/* Icon */}
      {icon && <span className="relative z-10 w-5 h-5 flex items-center justify-center">{icon}</span>}
      
      {/* Text */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};