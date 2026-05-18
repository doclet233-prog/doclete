import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatRating } from '../data/reviews';

const submittedReviewKey = 'dolcetto-submitted-review';

const StarDisplay = ({ rating, size = 'text-lg' }) => (
  <div className="flex gap-1" aria-label={`${formatRating(rating)} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={`text-gold ${size}`}>
        {rating >= star - 0.75 ? '\u2605' : '\u2606'}
      </span>
    ))}
  </div>
);

const Testimonials = ({ reviews, averageRating, onAddReview }) => {
  const [reviewForm, setReviewForm] = useState({
    name: '',
    text: '',
    stars: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setReviewForm((current) => ({ ...current, [name]: value }));
  };

  const submitReview = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (localStorage.getItem(submittedReviewKey)) {
      setErrorMessage('You already submitted a review');
      return;
    }

    const trimmedText = reviewForm.text.trim();
    if (!trimmedText) {
      setErrorMessage('Please write a review before submitting.');
      return;
    }

    if (!reviewForm.stars) {
      setErrorMessage('Please choose a rating.');
      return;
    }

    const review = {
      id: `review-${Date.now()}`,
      name: reviewForm.name.trim() || 'Bakery Guest',
      text: trimmedText,
      stars: Number(reviewForm.stars),
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);

      const response = await fetch('https://formspree.io/f/xzdwpwng', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'review',
          ...review,
        }),
      });

      if (!response.ok) {
        throw new Error('Review submission failed');
      }
    } catch {
      setErrorMessage('Could not submit review. Please try again.');
      return;
    } finally {
      setIsSubmitting(false);
    }

    onAddReview(review);

    setReviewForm({
      name: '',
      text: '',
      stars: '',
    });
    setSuccessMessage('Thanks. Your review was submitted and is visible here.');
  };

  return (
    <section id="reviews" className="py-24 bg-softBlack">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="uppercase tracking-[0.3em] text-gold text-sm font-bold mb-4 block">
            Guest Experiences
          </span>
          <h2 className="text-4xl md:text-6xl font-serif mb-6">Customer Reviews</h2>
          <div className="flex justify-center mb-4">
            <StarDisplay rating={averageRating} size="text-2xl" />
          </div>
          <p className="text-white/50 text-lg mb-6">
            {formatRating(averageRating)} average rating from {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
          <div className="w-24 h-[1px] bg-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <motion.form
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            onSubmit={submitReview}
            className="glass-morphism p-6 md:p-10 rounded-[2rem] border border-white/5"
          >
            <h3 className="text-2xl md:text-3xl font-serif mb-6 gold-gradient">Leave a Review</h3>
            <div className="space-y-6">
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-white/40 ml-2 mb-2 block">Name Optional</span>
                <input
                  name="name"
                  type="text"
                  value={reviewForm.name}
                  onChange={updateField}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-gold outline-none transition-all"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-white/40 ml-2 mb-2 block">Rating</span>
                <select
                  required
                  name="stars"
                  value={reviewForm.stars}
                  onChange={updateField}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-gold outline-none transition-all"
                >
                  <option className="bg-softBlack" value="">Select rating</option>
                  <option className="bg-softBlack" value="5">5 stars</option>
                  <option className="bg-softBlack" value="4">4 stars</option>
                  <option className="bg-softBlack" value="3">3 stars</option>
                  <option className="bg-softBlack" value="2">2 stars</option>
                  <option className="bg-softBlack" value="1">1 star</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-widest text-white/40 ml-2 mb-2 block">Review</span>
                <textarea
                  required
                  name="text"
                  value={reviewForm.text}
                  onChange={updateField}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-5 py-4 focus:border-gold outline-none transition-all h-36"
                  placeholder="Tell us what you loved"
                />
              </label>
            </div>

            {successMessage && (
              <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-4 text-sm text-gold">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-red-300/30 bg-red-500/10 px-5 py-4 text-sm text-red-100">
                {errorMessage}
              </div>
            )}

            <button
              disabled={isSubmitting}
              className="gold-button w-full mt-6 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Publish Review'}
            </button>
          </motion.form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(() => {
              const displayedReviews = reviews.filter((r) => !r.id.startsWith('seed-'));
              if (displayedReviews.length === 0) {
                return (
                  <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-16 px-6 border border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.02] text-center">
                    <span className="text-4xl mb-4 animate-bounce">✍️</span>
                    <h4 className="font-serif text-xl text-white mb-2 font-bold">No Guest Reviews Yet</h4>
                    <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                      Be the first to share your artisanal dessert experience with us! Use the form on the left to publish yours.
                    </p>
                  </div>
                );
              }
              return displayedReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.08, 0.4) }}
                  className="glass-morphism p-7 md:p-8 rounded-[2rem] border border-white/5 relative"
                >
                  <div className="mb-5">
                    <StarDisplay rating={review.stars} />
                  </div>
                  <p className="text-white/70 text-base md:text-lg font-light leading-relaxed mb-6 italic">
                    "{review.text}"
                  </p>
                  <div className="flex flex-col gap-1">
                    <h4 className="font-serif text-xl tracking-wide">- {review.name}</h4>
                    <span className="text-white/30 text-xs uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ));
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
