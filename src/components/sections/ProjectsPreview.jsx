import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import ProjectCard from '../ui/ProjectCard';
import { projects } from '../../data/projects';

export default function ProjectsPreview() {
  // Show only top 3 featured projects
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

  return (
    <section className="py-32 bg-bg-secondary">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeader 
            title="Things I've built" 
            linkText="See all →" 
            linkTo="/projects" 
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <ProjectCard project={project} featured={true} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
