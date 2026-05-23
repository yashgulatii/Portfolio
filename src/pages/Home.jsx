import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Hero from '../components/sections/Hero';
import Stats from '../components/sections/Stats';
import About from '../components/sections/About';
import ProjectsPreview from '../components/sections/ProjectsPreview';
import Experience from '../components/sections/Experience';
import Skills from '../components/sections/Skills';
import TryHackMe from '../components/sections/TryHackMe';
import Contact from '../components/sections/Contact';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Yash Gulati — Security Analyst & Tool Builder</title>
      </Helmet>

      <Hero />
      <Stats />
      <About />
      <ProjectsPreview />
      <Experience />
      <Skills />
      <TryHackMe />
      <Contact />
    </motion.div>
  );
}
