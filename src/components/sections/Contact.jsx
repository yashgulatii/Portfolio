import { motion } from 'framer-motion';
import { Mail, FileDown } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';
import { Link } from 'react-router-dom';

const MotionLink = motion(Link);


export default function Contact() {
  const links = [
    {
      name: 'Email',
      value: 'contactyashgulati@gmail.com', // Replace with real email
      icon: <Mail size={24} />,
      href: 'mailto:contactyashgulati@gmail.com'
    },
    {
      name: 'LinkedIn',
      value: '/in/yashgulatii',
      icon: <LinkedinIcon size={24} />,
      href: 'https://linkedin.com/in/yashgulatii'
    },
    {
      name: 'GitHub',
      value: '/yashgulatii',
      icon: <GithubIcon size={24} />,
      href: 'https://github.com/yashgulatii'
    },
    {
      name: 'TryHackMe',
      value: '/p/yashgulatii',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.95 0C5.35 0 0 5.35 0 11.95V24H12.05C18.65 24 24 18.65 24 12.05C24 5.45 18.65 0 11.95 0ZM11.95 2.5C17.15 2.5 21.45 6.7 21.45 11.95C21.45 17.2 17.25 21.45 12.05 21.45H2.5V11.95C2.5 6.75 6.7 2.5 11.95 2.5ZM17.1 10.15L15.4 14.1L12.55 10.35V16H10.55V9.45L12.95 12.65L14.1 9.95H17.1V10.15Z" />
        </svg>
      ),
      href: 'https://tryhackme.com/p/yashgulatii'
    },
    {
      name: 'Resume',
      value: 'View PDF',
      icon: <FileDown size={24} />,
      to: '/resume'
    }
  ];

  return (
    <section id="contact" className="py-32 bg-bg-secondary border-t border-border">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto md:mx-0"
        >
          <h2 className="text-4xl md:text-5xl text-text-primary mb-6">Let's work together.</h2>
          <p className="text-text-secondary text-lg leading-relaxed mb-16">
            Actively seeking fresher SOC Analyst, Security Analyst, or Junior
            Penetration Tester roles across India. Open to internships, contract
            assessments, and collaborative research.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {links.map((link, index) => {
            const isInternal = !!link.to;
            const Component = isInternal ? MotionLink : motion.a;
            const linkProps = isInternal
              ? { to: link.to }
              : {
                  href: link.href,
                  target: "_blank",
                  rel: "noopener noreferrer"
                };

            return (
              <Component
                key={link.name}
                {...linkProps}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-bg-card border border-border hover:border-accent hover:bg-accent-dim p-6 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all hover:-translate-y-1 group cursor-pointer"
              >
                <div className="text-text-secondary group-hover:text-accent transition-colors">
                  {link.icon}
                </div>
                <div className="text-center">
                  <div className="text-text-primary font-bold text-sm mb-1">{link.name}</div>
                  <div className="text-text-muted text-xs truncate max-w-full">{link.value}</div>
                </div>
              </Component>
            );
          })}
        </div>
      </div>
    </section>
  );
}
