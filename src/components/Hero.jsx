import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
import { formatRating } from '../data/reviews';

const Hero = ({ averageRating, reviewCount }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-softBlack">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-8"
        >
          <img src={logo} alt="Dolcetto Logo" className="h-32 md:h-48 mx-auto filter drop-shadow-2xl" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-8xl font-serif mb-6 gold-gradient tracking-tight"
        >
          Artisanal Indulgence
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-lg md:text-2xl text-white/60 font-sans max-w-2xl mx-auto mb-10 tracking-wide font-light"
        >
          Crafting moments of pure joy with every bite. Discover the finest handcrafted desserts in a premium cafe experience.
        </motion.p>

        <motion.a
          href="#reviews"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-10 text-white/70 hover:text-gold transition-colors"
        >
          <span className="text-gold text-xl tracking-wider" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>{averageRating >= star - 0.75 ? '\u2605' : '\u2606'}</span>
            ))}
          </span>
          <span className="text-sm uppercase tracking-[0.2em]">
            {formatRating(averageRating)} from {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </span>
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col md:flex-row gap-6 justify-center"
        >
          <a href="#products" className="gold-button px-10 py-4 rounded-full text-sm uppercase tracking-widest font-bold">
            Explore Menu
          </a>
          <a href="#stories" className="border border-white/20 hover:bg-white/5 px-10 py-4 rounded-full text-sm uppercase tracking-widest font-bold transition-all duration-300">
            Stories
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-gold to-transparent opacity-50" />
      </motion.div>
    </section>
  );
};

export default Hero;
