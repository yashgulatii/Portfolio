import { ExternalLink } from 'lucide-react';
import { GithubIcon } from './Icons';
import Badge from './Badge';

export default function ProjectCard({ project, featured = false }) {
  return (
    <div className="group bg-bg-card border border-border hover:border-border-hover p-6 rounded-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <div className="flex flex-wrap gap-2 mb-4">
        {project.stack.map(tech => (
          <Badge key={tech} variant="default">{tech}</Badge>
        ))}
        {featured && project.featured && (
          <Badge variant="accent">[Featured Project]</Badge>
        )}
      </div>
      
      <h3 className="text-xl text-text-primary mb-2 font-sans font-bold">{project.title}</h3>
      <p className="text-text-secondary text-sm flex-grow mb-6 line-clamp-3">
        {featured ? project.description : project.fullDescription}
      </p>
      
      {!featured && project.keyLearning && (
        <p className="text-text-muted text-xs italic mb-4">
          Key learning: {project.keyLearning}
        </p>
      )}

      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/50">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
          >
            <GithubIcon size={16} />
            {featured ? 'View Source' : 'View on GitHub'}
          </a>
        )}
      </div>
    </div>
  );
}
