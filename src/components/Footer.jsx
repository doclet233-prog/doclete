import logo from '../assets/logo1.png';

const Footer = () => {
  return (
    <footer className="py-20 bg-softBlack border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
          <div className="flex flex-col items-center md:items-start">
            <img src={logo} alt="Dolcetto Logo" className="h-16 w-16 rounded-full object-cover border-2 border-black mb-6" />
            <p className="text-white/40 text-sm max-w-xs text-center md:text-left">
              Redefining the artisanal dessert experience with premium ingredients and handmade perfection.
            </p>
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col gap-4">
               <h4 className="text-white text-sm font-bold uppercase tracking-widest">Explore</h4>
               <a href="#products" className="text-white/40 hover:text-gold transition-colors text-sm">Menu</a>
               <a href="#order" className="text-white/40 hover:text-gold transition-colors text-sm">Order Online</a>
               <a href="#stories" className="text-white/40 hover:text-gold transition-colors text-sm">Stories</a>
               <a href="#reviews" className="text-white/40 hover:text-gold transition-colors text-sm">Reviews</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white text-sm font-bold uppercase tracking-widest">Connect</h4>
              <a href="https://www.instagram.com/_.dolcetto._?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold transition-colors text-sm">Instagram</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
          <p className="text-white/20 text-xs tracking-widest">
            (C) 2024 DOLCETTO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/20 hover:text-white transition-colors text-xs tracking-widest">PRIVACY POLICY</a>
            <a href="#" className="text-white/20 hover:text-white transition-colors text-xs tracking-widest">TERMS OF SERVICE</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
