import { Link } from 'react-router-dom';
import { GithubIcon, LinkedinIcon, InstagramIcon } from '../ui/Icons';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-32 bg-bg-primary">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl text-text-primary">Yash Gulati</h3>
            <p className="text-text-secondary text-sm max-w-xs">
              Building security tools and finding vulnerabilities since 2022.
            </p>
          </div>

          {/* Centre Column */}
          <div className="flex flex-col gap-4 md:items-center">
            <h4 className="text-text-primary text-sm font-bold uppercase tracking-wider">Navigation</h4>
            <nav className="flex flex-col gap-2 md:items-center">
              <Link to="/" className="text-text-secondary hover:text-accent transition-colors text-sm">Home</Link>
              <Link to="/projects" className="text-text-secondary hover:text-accent transition-colors text-sm">Projects</Link>
              <Link to="/resume" className="text-text-secondary hover:text-accent transition-colors text-sm">Resume</Link>
            </nav>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 md:items-end">
            <h4 className="text-text-primary text-sm font-bold uppercase tracking-wider">Socials</h4>
            <div className="flex gap-4">
              <a href="https://github.com/yashgulatii" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                <GithubIcon size={20} />
              </a>
              <a href="https://linkedin.com/in/yashgulatii" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                <LinkedinIcon size={20} />
              </a>
              <a href="https://tryhackme.com/p/yashgulatii" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                {/* TryHackMe Icon inline SVG fallback */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.95 0C5.35 0 0 5.35 0 11.95V24H12.05C18.65 24 24 18.65 24 12.05C24 5.45 18.65 0 11.95 0ZM11.95 2.5C17.15 2.5 21.45 6.7 21.45 11.95C21.45 17.2 17.25 21.45 12.05 21.45H2.5V11.95C2.5 6.75 6.7 2.5 11.95 2.5ZM17.1 10.15L15.4 14.1L12.55 10.35V16H10.55V9.45L12.95 12.65L14.1 9.95H17.1V10.15Z" />
                </svg>
              </a>
              <a href="https://instagram.com/yashgulatii" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-xs">
            Built with Vite + React
          </p>
          <p className="text-text-muted text-xs">
            &copy; 2026 Yash Gulati
          </p>
        </div>
      </div>
    </footer>
  );
}
