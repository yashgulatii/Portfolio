import { Link } from 'react-router-dom';

export default function SectionHeader({ title, linkText, linkTo }) {
  return (
    <div className="flex items-end justify-between mb-12">
      <h2 className="text-3xl md:text-4xl text-text-primary">{title}</h2>
      {linkText && linkTo && (
        <Link
          to={linkTo}
          className="text-text-secondary hover:text-accent transition-colors text-sm font-medium whitespace-nowrap mb-1"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
