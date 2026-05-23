import { motion } from 'framer-motion';
import { useTryHackMe } from '../../hooks/useTryHackMe';

export default function About() {
  const { stats } = useTryHackMe();

  return (
    <section className="py-32">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-12">
          
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 flex flex-col gap-6"
          >
            <span className="text-accent text-sm font-mono tracking-wider uppercase">About</span>
            
            <h2 className="text-3xl md:text-4xl text-text-primary leading-tight text-balance">
              Cybersecurity Analyst specializing in Offensive Security & AppSec.
            </h2>
            
            <div className="text-text-secondary text-lg leading-relaxed flex flex-col gap-6 mt-4">
              <p>
                I am a final-year Electronics student transitioning into cybersecurity.
                I built and deployed a production system used by over 100 people.
                During a self-audit of this system, I discovered a real Broken Access Control vulnerability and documented it with CVSS 3.1 scoring.
              </p>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4"
          >
            <div className="bg-bg-card border border-border p-8 rounded-lg flex flex-col gap-6 h-full text-left">
              <h3 className="text-text-primary font-bold text-lg border-b border-border pb-2">Credentials</h3>
              
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                  <p className="text-text-primary text-sm font-medium leading-relaxed">
                    Google Cybersecurity Professional Certificate
                  </p>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                  <p className="text-text-primary text-sm font-medium leading-relaxed">
                    CNSP (Certified Network Security Practitioner)
                  </p>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                  <p className="text-text-primary text-sm font-medium leading-relaxed">
                    Top 2% globally on TryHackMe —{' '}
                    <a
                      href="https://tryhackme.com/p/yashgulatii"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-mono"
                    >
                      public profile
                    </a>
                  </p>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                  <p className="text-text-primary text-sm font-medium leading-relaxed">
                    B.Sc. Electronics Honours — Rajdhani College, University of Delhi (Final Year)
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-border/50 text-xs font-mono text-text-muted">
                <div>Location: Delhi, India</div>
                <div className="mt-1">Availability: Fresher, available immediately</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
