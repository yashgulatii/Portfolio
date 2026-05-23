export const projects = [
  {
    id: "campus-track",
    title: "Campus Track",
    category: "Full-stack",
    stack: ["Flutter", "Firebase", "Python Flask", "SQLite"],
    description: "Cross-platform academic management system deployed on a live Ubuntu server with 100+ beta users. Identified and patched a real IDOR vulnerability in the file access endpoint during development.",
    fullDescription: "Built a complete cross-platform academic management system with a full REST API, Firebase Auth, role-based access control, and bulk CSV import. Successfully identified and patched a real IDOR vulnerability in the file access endpoint during development.",
    keyLearning: "Production deployment, REST API security, and real-world vulnerability patching.",
    github: "https://github.com/yashgulatii",
    featured: true
  },
  {
    id: "netra",
    title: "Netra — Network Scanner",
    category: "Network",
    stack: ["Python", "Scapy", "Nmap"],
    description: "Host discovery and port scanning tool built to understand network enumeration from first principles. Supports subnet sweeps and service fingerprinting.",
    fullDescription: "A custom network scanner built with Python and Scapy. Features host discovery, port scanning, and service fingerprinting to deeply understand network enumeration from first principles.",
    keyLearning: "Network protocols, raw socket programming, and packet manipulation.",
    github: "https://github.com/yashgulatii",
    featured: true
  },
  {
    id: "enchat",
    title: "EnChat — Encrypted Chat",
    category: "Cryptography",
    stack: ["Python", "AES-256", "Socket"],
    description: "End-to-end encrypted chat application with AES-256 encryption. Built to understand secure comms protocols and key exchange at the implementation level.",
    fullDescription: "A secure terminal-based chat application implementing AES-256 end-to-end encryption. Built to thoroughly understand secure communication protocols and key exchange mechanisms at the implementation level.",
    keyLearning: "Cryptography implementations, socket programming, and secure communication.",
    github: "https://github.com/yashgulatii",
    featured: true
  },
  {
    id: "dualauth",
    title: "DualAuth",
    category: "Defensive",
    stack: ["Python", "TOTP"],
    description: "Two-factor authentication system",
    fullDescription: "A two-factor authentication (2FA) module leveraging TOTP (Time-based One-Time Password) algorithms. Designed to integrate with existing authentication flows to enhance security.",
    keyLearning: "Authentication frameworks, TOTP algorithm mechanics, and security hardening.",
    github: "https://github.com/yashgulatii",
    featured: false
  },
  {
    id: "airtrace",
    title: "Airtrace",
    category: "Network",
    stack: ["Python"],
    description: "Passive network traffic analyser",
    fullDescription: "A passive network traffic analysis tool that captures and parses network packets to identify potential anomalies or unauthorized data exfiltration.",
    keyLearning: "Traffic analysis, packet sniffing, and network forensics.",
    github: "https://github.com/yashgulatii",
    featured: false
  },
  {
    id: "keyscope",
    title: "KeyScope",
    category: "Offensive",
    stack: ["Python"],
    description: "Keylogger for forensic analysis and detection research",
    fullDescription: "An experimental keylogger developed strictly for forensic analysis and detection research, demonstrating how user input can be intercepted at the OS level.",
    keyLearning: "OS-level hooking, malware behavior, and threat detection mechanisms.",
    github: "https://github.com/yashgulatii",
    featured: false
  },
  {
    id: "simlock",
    title: "SimLock",
    category: "Defensive",
    stack: ["Python"],
    description: "SIM lock bypass detection and analysis tool",
    fullDescription: "A defensive tool designed to detect and analyze attempts to bypass SIM locks on mobile devices, providing insights into physical device security.",
    keyLearning: "Hardware security, bypass techniques, and threat modeling.",
    github: "https://github.com/yashgulatii",
    featured: false
  },
  {
    id: "entropyx",
    title: "EntropyX",
    category: "Cryptography",
    stack: ["Python"],
    description: "Entropy-based file analysis for detecting encrypted/packed malware",
    fullDescription: "A security utility that performs Shannon entropy analysis on files to detect packed executables or encrypted payloads typically associated with malware.",
    keyLearning: "Malware analysis, statistical entropy calculation, and binary inspection.",
    github: "https://github.com/yashgulatii",
    featured: false
  }
];
