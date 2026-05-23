import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/projects';
import ProjectCard from '../components/ui/ProjectCard';
import { cn } from '../utils/cn';

const categories = ['All', 'Offensive', 'Defensive', 'Cryptography', 'Network', 'Full-stack'];

export default function Projects() {
  const [activeTab, setActiveTab] = useState('All');

  const filteredProjects = projects.filter(
    p => activeTab === 'All' || p.category === activeTab
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-32 pb-24"
    >
      <Helmet>
        <title>Projects — Yash Gulati</title>
      </Helmet>

      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl text-text-primary mb-6">Tools & Projects</h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            A collection of security tools, proof-of-concepts, and applications I've built 
            to understand attack surfaces and engineering principles.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                activeTab === category 
                  ? "bg-accent text-accent-text border-accent" 
                  : "bg-transparent text-text-secondary border-border hover:border-text-secondary"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map(project => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} featured={false} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
