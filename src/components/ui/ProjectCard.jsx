import { GithubIcon } from './Icons';
import Badge from './Badge';
import { ExternalLink } from 'lucide-react';

export default function ProjectCard({ project, featured = false }) {
  // Pinned Campus Track custom premium layout
  if (project.id === 'campus-track') {
    return (
      <div className="group bg-bg-card border border-accent/20 hover:border-accent p-8 rounded-xl transition-all duration-300 shadow-xl h-full flex flex-col text-left">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {project.stack.map(tech => (
              <Badge key={tech} variant="accent">{tech}</Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Badge variant="terminal">Pinned #1 Project</Badge>
            <Badge variant="default">{project.users}</Badge>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl text-text-primary mb-4 font-sans font-bold group-hover:text-accent transition-colors">
          {project.title}
        </h3>

        {/* Description & Deployment Info */}
        <p className="text-text-secondary text-base mb-6 leading-relaxed">
          {project.fullDescription}
        </p>
        
        <p className="text-sm font-mono text-text-muted mb-6 bg-[#0c0c0c] p-3 rounded border border-border">
          <strong className="text-text-secondary">Deployment:</strong> {project.deployment}
        </p>

        {/* Security Advisory Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 p-6 bg-[#0f0f0f] border border-red-950/40 rounded-xl relative overflow-hidden text-left">
          {/* Subtle threat-alert side glow */}
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-red-500/50" />
          
          {/* Left Column: Vulnerability Writeup */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h4 className="text-red-400 font-mono text-sm uppercase tracking-wider font-bold">
                Security Advisory: {project.vulnerability.title}
              </h4>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {project.vulnerability.details}
            </p>
            <div className="mt-2 text-xs font-mono text-text-muted">
              <strong>Vector:</strong> {project.vulnerability.vector}
            </div>
          </div>

          {/* Right Column: CVSS Rating */}
          <div className="lg:col-span-4 flex lg:flex-col justify-between lg:justify-center items-center lg:items-end border-t lg:border-t-0 lg:border-l border-border/50 pt-4 lg:pt-0 lg:pl-6 gap-2">
            <div className="text-left lg:text-right">
              <div className="text-xs font-mono text-text-muted">CVSS 3.1 SCORE</div>
              <div className="text-3xl md:text-4xl text-red-500 font-extrabold font-mono mt-1">
                {project.vulnerability.cvss}
              </div>
            </div>
            <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-xs font-bold font-mono">
              {project.vulnerability.rating} Severity
            </span>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="mb-6 text-left">
          <h4 className="text-text-primary text-sm font-bold uppercase tracking-wider mb-3">Key Features:</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-text-secondary font-mono">
            {project.features.map(feature => (
              <li key={feature} className="flex gap-2 items-center">
                <span className="text-accent">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Card Footer: GitHub / Live links */}
        <div className="flex items-center gap-6 mt-auto pt-6 border-t border-border/50">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors font-bold"
            >
              <GithubIcon size={18} />
              View on GitHub
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-bold"
            >
              <ExternalLink size={18} />
              {project.liveLabel || 'View Live Site'}
            </a>
          )}
          {!project.github && !project.live && (
            <span className="flex items-center gap-2 text-sm text-text-muted font-mono font-medium">
              Private Repository
            </span>
          )}
        </div>
      </div>
    );
  }

  // Standard Project Card layout for Python tools
  return (
    <div className="group bg-bg-card border border-border hover:border-border-hover p-6 rounded-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col text-left">
      <div className="flex flex-wrap gap-2 mb-4">
        {project.stack.map(tech => (
          <Badge key={tech} variant="default">{tech}</Badge>
        ))}
        {featured && project.featured && (
          <Badge variant="accent">[Featured Tool]</Badge>
        )}
      </div>
      
      <h3 className="text-xl text-text-primary mb-2 font-sans font-bold">{project.title}</h3>
      <p className="text-text-secondary text-sm flex-grow mb-4 leading-relaxed">
        {featured ? project.description : project.fullDescription}
      </p>

      {/* Educational Notice for Isolated environments */}
      {project.warning && (
        <p className="text-red-400/90 text-xs font-mono font-medium mb-4 bg-red-950/10 border border-red-950/30 p-2.5 rounded">
          {project.warning}
        </p>
      )}
      
      {!featured && project.keyLearning && (
        <p className="text-text-muted text-xs italic mb-4">
          Key learning: {project.keyLearning}
        </p>
      )}

      {/* Card Footer: GitHub / Live links */}
      <div className="flex flex-wrap items-center gap-6 mt-auto pt-4 border-t border-border/50">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors font-semibold"
          >
            <GithubIcon size={16} />
            {featured ? 'View Source' : 'View on GitHub'}
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-semibold"
          >
            <ExternalLink size={16} />
            {project.liveLabel || 'View Live Site'}
          </a>
        )}
        {!project.github && !project.live && (
          <span className="flex items-center gap-2 text-sm text-text-muted font-mono">
            Private Repository
          </span>
        )}
      </div>
    </div>
  );
}
