export const projects = [
  {
    id: "campus-track",
    title: "Campus Track — College Management System",
    category: "Full-stack",
    stack: ["Flutter", "Flask", "Firebase Auth + Firestore"],
    description: "Campus Track is a cross-platform academic management system built in collaboration — Flask backend, Firebase integration, deployment infrastructure, and security audit by Yash Gulati. Frontend developed by a collaborator. Deployed and beta-launched with 100+ real users across college departments. During a self-audit of the codebase, discovered and documented a real Broken Access Control vulnerability.",
    fullDescription: "Campus Track is a cross-platform academic management system built in collaboration — Flask backend, Firebase integration, deployment infrastructure, and security audit by Yash Gulati. Frontend developed by a collaborator. Deployed and beta-launched with 100+ real users across college departments. During a self-audit of the codebase, discovered and documented a real Broken Access Control vulnerability.",
    vulnerability: {
      title: "Role Boundary Bypass (Broken Access Control)",
      details: "A student-role user could escalate to teacher or admin by modifying the URL path. The server performed no server-side role validation, granting full account access including write permissions across all role boundaries.",
      cvss: "8.9",
      rating: "High",
      vector: "AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:N"
    },
    features: [
      "Role-based access control",
      "Bulk CSV import",
      "File storage",
      "Real-time Firestore sync with SQLite buffer"
    ],
    deployment: "systemd + Gunicorn; tested via ngrok tunneling",
    users: "100+ beta users across college departments",
    keyLearning: "Production deployment, REST API security, and real-world vulnerability patching.",
    github: "https://github.com/yashgulatii",
    featured: true
  },
  {
    id: "airtrace",
    title: "Airtrace",
    category: "Network",
    stack: ["Python"],
    description: "WiFi network scanner — detects and lists nearby access points with signal strength and encryption type.",
    fullDescription: "WiFi network scanner — detects and lists nearby access points with signal strength and encryption type.",
    github: "https://github.com/yashgulatii",
    featured: true
  },
  {
    id: "netra",
    title: "Netra",
    category: "Network",
    stack: ["Python"],
    description: "Python-based network scanner — performs host discovery and open port enumeration.",
    fullDescription: "Python-based network scanner — performs host discovery and open port enumeration.",
    github: "https://github.com/yashgulatii",
    featured: true
  },
  {
    id: "enchat",
    title: "EnChat",
    category: "Cryptography",
    stack: ["Python"],
    description: "CLI chat tool with end-to-end encryption implemented from scratch using Python.",
    fullDescription: "CLI chat tool with end-to-end encryption implemented from scratch using Python.",
    github: "https://github.com/yashgulatii",
    featured: true
  },
  {
    id: "simlock",
    title: "SimLock",
    category: "Defensive",
    stack: ["Python"],
    description: "Ransomware behaviour simulator built for controlled lab environments — demonstrates file encryption and ransom note delivery.",
    fullDescription: "Ransomware behaviour simulator built for controlled lab environments — demonstrates file encryption and ransom note delivery.",
    warning: "Built for educational use in isolated lab environments.",
    github: "https://github.com/yashgulatii",
    featured: false
  },
  {
    id: "dualauth",
    title: "DualAuth",
    category: "Defensive",
    stack: ["Python"],
    description: "SQL injection simulation tool — demonstrates authentication bypass via unsanitised query inputs.",
    fullDescription: "SQL injection simulation tool — demonstrates authentication bypass via unsanitised query inputs.",
    warning: "Built for educational use in isolated lab environments.",
    github: "https://github.com/yashgulatii",
    featured: false
  },
  {
    id: "keyscope",
    title: "KeyScope",
    category: "Offensive",
    stack: ["Python"],
    description: "Educational keylogger built in Python for security research and awareness demonstrations.",
    fullDescription: "Educational keylogger built in Python for security research and awareness demonstrations.",
    warning: "Built for educational use in isolated lab environments.",
    github: "https://github.com/yashgulatii",
    featured: false
  },
  {
    id: "entropyx",
    title: "EntropyX",
    category: "Cryptography",
    stack: ["Python"],
    description: "Password generator with real-time entropy scoring to evaluate password strength.",
    fullDescription: "Password generator with real-time entropy scoring to evaluate password strength.",
    github: "https://github.com/yashgulatii",
    featured: false
  }
];
