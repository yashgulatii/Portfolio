import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileDown, AlertCircle } from 'lucide-react';

const resumes = {
  soc: {
    title: 'SOC Analyst Resume — Yash Gulati',
    filename: 'Yash_Gulati_SOC_Analyst_Resume.pdf',
    path: '/Yash_Gulati_SOC_Analyst_Resume.pdf',
  },
  appsec: {
    title: 'AppSec / PenTest Resume — Yash Gulati',
    filename: 'Yash_Gulati_AppSec_PenTest_Resume.pdf',
    path: '/Yash_Gulati_AppSec_PenTest_Resume.pdf',
  }
};

export default function Resume() {
  const [activeTab, setActiveTab] = useState('soc');
  const [embedError, setEmbedError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-32 pb-24 flex flex-col"
    >
      <Helmet>
        <title>{resumes[activeTab].title}</title>
      </Helmet>

      <div className="max-w-[1100px] mx-auto px-6 md:px-12 w-full flex-grow flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl text-text-primary mb-4 font-syne font-bold">Resume</h1>
            <p className="text-text-secondary text-lg">
              My professional experience, education, and technical skills.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Tab Switched Pills */}
            <div className="bg-bg-secondary border border-border p-1 rounded-xl flex gap-1">
              <button
                onClick={() => { setActiveTab('soc'); setEmbedError(false); }}
                className={`relative px-5 py-2.5 rounded-lg text-sm font-bold transition-colors duration-200 ${
                  activeTab === 'soc' ? 'text-accent-text' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {activeTab === 'soc' && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-accent rounded-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">SOC Analyst</span>
              </button>
              <button
                onClick={() => { setActiveTab('appsec'); setEmbedError(false); }}
                className={`relative px-5 py-2.5 rounded-lg text-sm font-bold transition-colors duration-200 ${
                  activeTab === 'appsec' ? 'text-accent-text' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {activeTab === 'appsec' && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-accent rounded-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">AppSec / PenTest</span>
              </button>
            </div>

            <a
              href={resumes[activeTab].path}
              download={resumes[activeTab].filename}
              className="inline-flex items-center justify-center gap-2 bg-accent text-accent-text px-6 py-3.5 rounded-lg font-bold hover:bg-accent/90 transition-colors whitespace-nowrap shadow-lg"
            >
              <FileDown size={20} />
              Download PDF
            </a>
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-grow w-full bg-bg-card border border-border rounded-xl overflow-hidden shadow-2xl relative min-h-[60vh] flex flex-col"
        >
          {!embedError ? (
            <iframe
              src={`${resumes[activeTab].path}#view=FitH`}
              title={resumes[activeTab].title}
              className="w-full h-[80vh] border-none"
              onError={() => setEmbedError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow p-12 text-center">
              <AlertCircle size={48} className="text-text-muted mb-6" />
              <h3 className="text-xl text-text-primary font-bold mb-2">
                Your browser can't embed PDFs
              </h3>
              <p className="text-text-secondary mb-8">
                Click below to download the file directly.
              </p>
              <a
                href={resumes[activeTab].path}
                download={resumes[activeTab].filename}
                className="inline-flex items-center gap-2 bg-bg-secondary text-text-primary px-6 py-3 rounded-md font-bold border border-border hover:border-accent hover:text-accent transition-colors"
              >
                <FileDown size={20} />
                Download Resume
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
