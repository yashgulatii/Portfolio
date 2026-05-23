import { motion } from 'framer-motion';
import { experience } from '../../data/experience';

export default function Experience() {
  return (
    <section className="py-32">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl text-text-primary mb-2">Experience & Education</h2>
        </motion.div>

        <div className="relative border-l border-border ml-3 md:ml-4">
          {experience.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-12 last:mb-0 relative pl-8 md:pl-12"
            >
              <div className="absolute w-3 h-3 bg-accent rounded-full -left-[6.5px] top-2" />
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
                <h3 className="text-xl text-text-primary font-bold">{item.title}</h3>
              </div>
              <div className="text-text-secondary text-sm mb-4 font-medium">
                {item.org} <span className="mx-2 text-text-muted">·</span> {item.date}
              </div>
              <p className="text-text-secondary leading-relaxed max-w-3xl text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
