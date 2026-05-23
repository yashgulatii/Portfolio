import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FileDown, AlertCircle } from 'lucide-react';

export default function Resume() {
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
        <title>Resume — Yash Gulati</title>
      </Helmet>

      <div className="max-w-[1100px] mx-auto px-6 md:px-12 w-full flex-grow flex flex-col">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl text-text-primary mb-4">Resume</h1>
            <p className="text-text-secondary text-lg">
              My professional experience, education, and technical skills.
            </p>
          </div>
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center justify-center gap-2 bg-accent text-accent-text px-6 py-3 rounded-md font-bold hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            <FileDown size={20} />
            Download PDF
          </a>
        </div>

        <div className="flex-grow w-full bg-bg-card border border-border rounded-xl overflow-hidden shadow-2xl relative min-h-[60vh] flex flex-col">
          {!embedError ? (
            <iframe
              src="/resume.pdf#view=FitH"
              title="Yash Gulati Resume"
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
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 bg-bg-secondary text-text-primary px-6 py-3 rounded-md font-bold border border-border hover:border-accent hover:text-accent transition-colors"
              >
                <FileDown size={20} />
                Download Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
