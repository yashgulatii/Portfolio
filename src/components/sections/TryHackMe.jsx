import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTryHackMe } from '../../hooks/useTryHackMe';

export default function TryHackMe() {
  const [iframeError, setIframeError] = useState(false);
  const { stats } = useTryHackMe();

  return (
    <section className="py-32">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-bg-card border border-border rounded-xl p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Left side: Embed or Fallback */}
            <div className="w-full flex justify-center items-center bg-transparent border-none p-0 overflow-hidden">
              {!iframeError ? (
                <iframe
                  src="https://tryhackme.com/api/v2/badges/public-profile?userPublicId=2570639"
                  className="border-none w-[330px] h-[88px] overflow-hidden"
                  title="TryHackMe Profile Badge"
                  scrolling="no"
                  onError={() => setIframeError(true)}
                />
              ) : (
                <div className="text-center font-mono py-8">
                  <h4 className="text-accent text-xl mb-2">TryHackMe Profile</h4>
                  <p className="text-text-primary">{stats.rank} · {stats.roomsCompleted} rooms</p>
                </div>
              )}
            </div>

            {/* Right side: Copy */}
            <div className="flex flex-col items-start">
              <span className="text-accent text-sm font-mono tracking-wider uppercase mb-4">
                Proof of work
              </span>
              <h3 className="text-2xl md:text-3xl text-text-primary mb-6 font-bold leading-tight">
                {stats.roomsCompleted} rooms. {stats.rank} globally.
              </h3>
              <p className="text-text-secondary text-base leading-relaxed mb-8">
                Not a certificate. Not a course completion badge.
                Active, ranked practice on real attack scenarios —
                web exploitation, network analysis, SIEM labs,
                forensics, and privilege escalation.
              </p>
              <a
                href="https://tryhackme.com/p/yashgulatii"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-text-primary hover:text-accent transition-colors flex items-center gap-2"
              >
                View full profile on TryHackMe →
              </a>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
