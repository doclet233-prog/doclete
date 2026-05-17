import { motion } from 'framer-motion';
import { productsData } from '../data/products';

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
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
              className="group relative glass-morphism rounded-3xl overflow-hidden p-4 hover:border-gold/30 transition-all duration-500 block cursor-pointer"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="gold-button px-6 py-2 rounded-full text-xs uppercase font-bold tracking-wider shadow-lg">
                    Order Online
                  </span>
                </div>
              </div>
              
              <div className="px-2 pb-2">
                <div className="mb-2">
                  <h3 className="text-xl font-serif tracking-wide group-hover:text-gold transition-colors duration-300">
                    {product.name}
                  </h3>
                </div>
                <p className="text-white/40 text-sm font-light leading-relaxed">
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
