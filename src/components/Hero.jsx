import { motion } from 'framer-motion';
import logo from '../assets/logo1.png';
import nameLogo from '../assets/qwe.png';
import { formatRating } from '../data/reviews';

const Hero = ({ averageRating, reviewCount }) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-softBlack pt-28 md:pt-0">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/10 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">




        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center justify-center mb-6 mt-12 md:mt-0"
        >


          {/* Main Logo Text */}
          <h1 className="text-[6.5rem] sm:text-[9rem] md:text-[11rem] lg:text-[13rem] xl:text-[15rem] font-script real-gold-gradient leading-[1.3] pb-6 pr-4">
            Dolcetto
          </h1>

          {/* Tagline */}
          <p className="text-[10px] sm:text-xs md:text-sm lg:text-base tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.5em] uppercase font-bold real-gold-gradient mt-2 pl-4 text-center">
            A Little Sweet, A Lot Of Joy
          </p>
        </motion.div>

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
          className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center"
        >
          <a href="#order" className="bg-gold hover:bg-gold/90 text-softBlack px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold shadow-[0_0_25px_rgba(220,213,198,0.4)] hover:shadow-[0_0_35px_rgba(220,213,198,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 border border-gold w-full sm:w-auto justify-center">
            <span className="w-2 h-2 rounded-full bg-softBlack animate-ping" />
            Order Online
          </a>
          <a href="#products" className="border border-white/20 hover:bg-white/5 px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 w-full sm:w-auto justify-center text-center">
            Explore Menu
          </a>
          <a href="#stories" className="border border-white/20 hover:bg-white/5 px-8 py-4 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 w-full sm:w-auto justify-center text-center">
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
