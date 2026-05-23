import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import ProjectsPreview from '../components/sections/ProjectsPreview';
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
        <title>Yash Gulati — Cybersecurity Analyst | Offensive Security & AppSec</title>
      </Helmet>

      <Hero />
      <About />
      <ProjectsPreview />
      <Skills />
      <TryHackMe />
      <Contact />
    </motion.div>
  );
}
