import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo1.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Products', href: '#products' },
    { name: 'Stories', href: '#stories' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Order Online', href: '#order' },
  ];

  const handleMobileClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      
      setMobileMenuOpen(false);
      
      setTimeout(() => {
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 300);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'py-4 glass-morphism' : 'py-5 md:py-8 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <img src={logo} alt="Dolcetto Logo" className="h-10 w-10 rounded-full object-cover border-2 border-black" />
          <span className="text-2xl font-serif tracking-widest gold-gradient italic">dolcetto</span>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-8">
          {navLinks.map((link, index) => {
            const isOrderOnline = link.name === 'Order Online';
            if (isOrderOnline) {
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gold hover:bg-gold/90 text-softBlack px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(220,213,198,0.45)] hover:shadow-[0_0_30px_rgba(220,213,198,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 border border-gold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-softBlack animate-ping" />
                  {link.name}
                </motion.a>
              );
            }
            return (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-sm uppercase tracking-widest hover:text-gold transition-colors duration-300"
              >
                {link.name}
              </motion.a>
            );
          })}
          <motion.a
            href="#reviews"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-white/10 hover:border-gold/50 hover:bg-white/5 px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300"
          >
            Review Us
          </motion.a>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-softBlack border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => {
                const isOrderOnline = link.name === 'Order Online';
                if (isOrderOnline) {
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleMobileClick(e, link.href)}
                      className="bg-gold text-softBlack w-full py-4 rounded-2xl text-center font-bold tracking-widest uppercase text-sm shadow-[0_10px_35px_rgba(220,213,198,0.3)] flex items-center justify-center gap-2 border border-gold"
                    >
                      <span className="w-2 h-2 rounded-full bg-softBlack animate-ping" />
                      {link.name}
                    </a>
                  );
                }
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleMobileClick(e, link.href)}
                    className="text-lg font-serif tracking-widest text-white/80 hover:text-gold"
                  >
                    {link.name}
                  </a>
                );
              })}
              <a
                href="#reviews"
                onClick={(e) => handleMobileClick(e, '#reviews')}
                className="border border-white/10 hover:border-gold/50 hover:bg-white/5 w-full py-3.5 rounded-xl font-bold text-center tracking-widest text-xs uppercase mt-2 transition-all duration-300"
              >
                Review Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
