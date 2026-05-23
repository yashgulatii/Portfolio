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
              I build security tools.<br />
              Then I break into things with them.
            </h2>
            
            <div className="text-text-secondary text-lg leading-relaxed flex flex-col gap-6 mt-4">
              <p>
                Most security students read about vulnerabilities. I've been shipping Python
                tools that exploit them since my second year — a network scanner, an
                encrypted comms tool, a dual-factor auth system, a keylogger forensics
                utility. Seven tools in total, each designed to understand a specific
                attack surface by building it from scratch.
              </p>
              <p>
                In my final-year project, Campus Track, I found and documented a real IDOR
                vulnerability in a production system with 100+ active users — then fixed it.
              </p>
              <p>
                My TryHackMe profile ({stats.rank} globally, {stats.roomsCompleted} rooms) is the lab work. The
                tools are the engineering. The internship in ethical hacking is the
                application. Hiring me means you get all three.
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
            <div className="bg-bg-card border border-border p-8 rounded-lg flex flex-col gap-8 h-full">
              <div>
                <h3 className="text-text-primary font-bold mb-1">B.Sc. Electronics (Hons)</h3>
                <p className="text-text-secondary text-sm">Rajdhani College, University of Delhi</p>
                <p className="text-text-muted text-sm mt-1">Expected: June 2026</p>
              </div>

              <div>
                <h3 className="text-text-primary font-bold mb-1">Google Cybersecurity Professional</h3>
                <p className="text-text-primary font-bold mb-1">CNSP — Certified Network Security Practitioner</p>
                <p className="text-text-muted text-sm mt-1">Currently pursuing: CompTIA Security+</p>
              </div>

              <div className="mt-auto pt-8 border-t border-border/50">
                <p className="text-text-secondary text-sm mb-1">Based in Delhi, India</p>
                <p className="text-text-secondary text-sm mb-1">Open to: On-site · Hybrid · Remote</p>
                <p className="text-accent text-sm mt-2">Available: Immediately on graduation</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
