export const getAverageRating = (reviews) => {
  if (!reviews.length) {
    return 0;
  }

  const total = reviews.reduce((sum, review) => sum + Number(review.stars || 0), 0);
  return total / reviews.length;
};

export const formatRating = (rating) => rating.toFixed(1);
