import { cn } from '../../utils/cn';

export default function Badge({ children, className, variant = 'default' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-bg-secondary text-text-secondary',
        variant === 'accent' && 'bg-accent/10 text-accent',
        variant === 'terminal' && 'bg-[#1a1a1a] text-accent font-mono border border-[#333]',
        className
      )}
    >
      {children}
    </span>
  );
}
