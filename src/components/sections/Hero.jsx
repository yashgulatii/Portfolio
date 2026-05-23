import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, FileDown } from 'lucide-react';
import Badge from '../ui/Badge';
import { useTryHackMe } from '../../hooks/useTryHackMe';

export default function Hero() {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const { stats } = useTryHackMe();

  const terminalLines = useMemo(() => [
    { prompt: '$ whoami', output: '> yash gulati — cybersecurity analyst | offensive security & appsec' },
    { prompt: '$ ls ./tools', output: '> airtrace  netra  enchat  simlock  dualauth  keyscope  entropyx' },
    { prompt: '$ cat stats.json', output: `> { "tryhackme_rank": "${stats.rank === 'Top 2%' ? 'top_2_percent' : stats.rank}",\n    "rooms_completed": ${stats.roomsCompleted},\n    "tools_built": 7,\n    "beta_users": "100+" }` },
    { prompt: '$ cat ./skills | grep proficient', output: '> python  burpsuite  wireshark  splunk  nmap  nessus  kali' }
  ], [stats]);

  useEffect(() => {
    let timeout;
    
    if (isTyping) {
      const line = terminalLines[currentLine];
      const fullText = `${line.prompt}\n${line.output}`;
      
      if (displayedText.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        }, 30);
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => {
          setDisplayedText('');
          setCurrentLine((prev) => (prev + 1) % terminalLines.length);
          setIsTyping(true);
        }, 3000);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, currentLine, isTyping, terminalLines]);

  return (
    <section className="min-h-screen flex flex-col justify-center pt-24 pb-12">
      <div className="max-w-[1100px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left Column */}
        <div className="md:col-span-7 flex flex-col items-start gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <Badge variant="terminal">Available for hire · Delhi, India</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-[50px] leading-[1.2] text-text-primary text-balance font-syne font-bold"
          >
            Yash Gulati — <span className="text-accent">Cybersecurity Analyst</span> | Offensive Security & AppSec
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg font-medium text-text-primary border-l-2 border-accent pl-4 py-1 max-w-xl"
          >
            Seeking SOC Analyst and Application Security Engineer roles (Fresher, available immediately).
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-sm font-mono text-text-muted"
          >
            Google Cybersecurity Professional Certificate · CNSP · Top 2% globally on TryHackMe
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 mt-4"
          >
            <a
              href="/resume.pdf"
              download
              className="bg-accent text-accent-text px-6 py-3.5 rounded-md font-bold hover:bg-accent/90 transition-colors flex items-center gap-2 text-base shadow-lg shadow-accent/20"
            >
              <FileDown size={18} />
              Download Resume
            </a>
            <a
              href="mailto:contactyashgulati@gmail.com"
              className="bg-bg-secondary text-text-primary px-6 py-3.5 rounded-md font-bold hover:bg-bg-card border border-border hover:border-border-hover transition-all flex items-center gap-2 text-base"
            >
              <Mail size={18} />
              contactyashgulati@gmail.com
            </a>
          </motion.div>
        </div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="md:col-span-5 w-full"
        >
          <div className="bg-[#0d0d0d] rounded-lg border border-border overflow-hidden h-[240px] flex flex-col shadow-2xl">
            <div className="bg-[#1a1a1a] px-4 py-2 border-b border-border flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              <span className="ml-2 text-xs font-mono text-text-muted">yash@sec-env:~</span>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed text-text-secondary whitespace-pre-wrap flex-grow overflow-hidden">
              <span className="text-text-primary">{displayedText}</span>
              <span className="animate-pulse bg-accent w-2 h-4 inline-block ml-1 align-middle"></span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="mt-auto pt-24 overflow-hidden w-full border-t border-border/50">
        <div className="flex whitespace-nowrap animate-[scroll_30s_linear_infinite]">
          <div className="flex gap-8 items-center text-text-muted font-mono text-sm uppercase tracking-wider px-4">
            <span>Burp Suite</span><span>·</span>
            <span>Wireshark</span><span>·</span>
            <span>Splunk</span><span>·</span>
            <span>Nmap</span><span>·</span>
            <span>Nessus</span><span>·</span>
            <span>Kali Linux</span><span>·</span>
            <span>Metasploit</span><span>·</span>
            <span>SQLMap</span><span>·</span>
            <span>OWASP ZAP</span><span>·</span>
            <span>Hydra</span><span>·</span>
            <span>John the Ripper</span><span>·</span>
            <span>Nikto</span>
          </div>
          <div className="flex gap-8 items-center text-text-muted font-mono text-sm uppercase tracking-wider px-4">
            <span>Burp Suite</span><span>·</span>
            <span>Wireshark</span><span>·</span>
            <span>Splunk</span><span>·</span>
            <span>Nmap</span><span>·</span>
            <span>Nessus</span><span>·</span>
            <span>Kali Linux</span><span>·</span>
            <span>Metasploit</span><span>·</span>
            <span>SQLMap</span><span>·</span>
            <span>OWASP ZAP</span><span>·</span>
            <span>Hydra</span><span>·</span>
            <span>John the Ripper</span><span>·</span>
            <span>Nikto</span>
          </div>
        </div>
      </div>
    </section>
  );
}
