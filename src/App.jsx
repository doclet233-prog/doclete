import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import OrderOnline from './components/OrderOnline';
import Stories from './components/Stories';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import { getAverageRating } from './data/reviews';

const submittedReviewKey = 'dolcetto-submitted-review';

const sortReviewsByNewest = (reviews) =>
  [...reviews].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));

const uniqueReviews = (reviews) =>
  reviews.filter((review, index, allReviews) => allReviews.findIndex((item) => item.id === review.id) === index);

const getLocalSubmittedReview = () => {
  try {
    const review = localStorage.getItem(submittedReviewKey);
    return review ? JSON.parse(review) : null;
  } catch {
    return null;
  }
};

function App() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [selectedOrderProduct, setSelectedOrderProduct] = useState(null);
  const averageRating = useMemo(() => getAverageRating(reviews), [reviews]);

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch('/reviews.json');
        const jsonReviews = await response.json();
        const localReview = getLocalSubmittedReview();
        setReviews(sortReviewsByNewest(uniqueReviews(localReview ? [localReview, ...jsonReviews] : jsonReviews)));
      } catch {
        const localReview = getLocalSubmittedReview();
        setReviews(localReview ? [localReview] : []);
      }
    };

    loadReviews();
  }, []);

  const addReview = (review) => {
    localStorage.setItem(submittedReviewKey, JSON.stringify(review));
    setReviews((currentReviews) => [review, ...currentReviews]);
  };

  return (
    <div className="bg-softBlack text-white selection:bg-gold selection:text-softBlack">
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-softBlack flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="text-4xl md:text-6xl font-serif gold-gradient italic mb-4"
              >
                _.dolcetto._
              </motion.div>
              <div className="w-48 h-[1px] bg-white/10 mx-auto overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full bg-gold"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Navbar />
            <Hero averageRating={averageRating} reviewCount={reviews.length} />
            <Products onSelectProduct={(name) => {
              setSelectedOrderProduct(name);
              const orderSection = document.getElementById('order');
              if (orderSection) {
                orderSection.scrollIntoView({ behavior: 'smooth' });
              }
            }} />
            <Stories />
            <Testimonials reviews={reviews} averageRating={averageRating} onAddReview={addReview} />
            <OrderOnline selectedProduct={selectedOrderProduct} clearSelectedProduct={() => setSelectedOrderProduct(null)} />
            <Footer />

          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
