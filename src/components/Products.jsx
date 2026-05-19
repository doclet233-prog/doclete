import { motion } from 'framer-motion';
import { productsData } from '../data/products';
import logo from '../assets/logo1.png';

const Products = ({ onSelectProduct }) => {
  return (
    <section id="products" className="py-24 bg-softBlack">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="uppercase tracking-[0.3em] text-gold text-sm font-bold mb-4 block"
          >
            Exquisite Collection
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif mb-4"
          >
            Our Signature Menu
          </motion.h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Browse our finest artisanal masterpieces handcrafted daily with premium, organic ingredients.
          </p>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
        >
          {productsData.map((product) => (
            <motion.a
              key={product.id}
              href="#order"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectProduct) {
                  onSelectProduct(product.name);
                }
              }}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="group relative glass-morphism rounded-2xl md:rounded-3xl overflow-hidden p-2.5 md:p-4 hover:border-gold/30 transition-all duration-500 block cursor-pointer"
            >
              <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-3 md:mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {!['Dark Chocolate Cheesecake', 'Chocolate Mousse', 'Cold Coffee', 'Biscoff Cheesecake', 'Classic Tiramisu'].includes(product.name) && (
                  <div 
                    className="absolute top-[50%] left-[50%] w-[25%] aspect-square z-10 pointer-events-none opacity-95 flex items-center justify-center"
                    style={{ transform: 'translate(-50%, -50%) rotateX(60deg)' }}
                  >
                    <img 
                      src={logo} 
                      alt="Dolcetto Logo" 
                      className="w-full h-full rounded-full object-cover border border-white/20 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-20">
                  <span className="gold-button px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] md:text-xs uppercase font-bold tracking-wider shadow-lg">
                    Order Online
                  </span>
                </div>
              </div>
              
              <div className="px-1 md:px-2 pb-1 md:pb-2 text-left">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                  <h3 className="text-sm md:text-lg font-serif tracking-wide group-hover:text-gold transition-colors duration-300 font-bold leading-tight">
                    {product.name}
                  </h3>
                  <span className="text-xs md:text-sm font-mono text-gold font-bold whitespace-nowrap">
                    {product.price}
                  </span>
                </div>
                <p className="text-white/40 text-[10px] md:text-sm font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {product.description}
                </p>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
