
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/review/listing/${params.listingId}`);
        const data = await res.json();
        setReviews(data);
        // Check if current user has already reviewed
        if (currentUser) {
          const userReview = data.find(review => review.userRef?._id === currentUser._id);
          setHasUserReviewed(!!userReview);
        }
      } catch (error) {
        console.error('Error fetching reviews', error);
      }
    };

    fetchListing();
    fetchReviews();
  }, [params.listingId, currentUser]);

  const handleReviewSubmit = (newReview) => {
    setReviews([...reviews, newReview]);
    setEditingReview(null);
    setHasUserReviewed(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await fetch(`/api/review/delete/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        // Remove the deleted review from the reviews array
        setReviews(reviews.filter(review => review._id !== reviewId));
        // Reset hasUserReviewed if the user's review was deleted
        if (currentUser) {
          const remainingUserReview = reviews.find(review => review.userRef?._id === currentUser._id);
          setHasUserReviewed(!remainingUserReview);
        }
      } else {
        const errorData = await res.json();
        console.error('Error deleting review:', errorData);
        alert(errorData.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const handleUpdateReview = async (updatedReview) => {
    try {
      const res = await fetch(`/api/review/update/${updatedReview._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: updatedReview.rating,
          comment: updatedReview.comment
        }),
      });
  
      if (res.ok) {
        const updated = await res.json();
        // Update the review in the reviews array
        setReviews(reviews.map(review => 
          review._id === updated._id ? updated : review
        ));
        setEditingReview(null);
      } else {
        const errorData = await res.text();
        console.error('Error updating review:', errorData);
        alert(errorData || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review');
    }
  };


            {/* Reviews Section */}
            <div className="mt-8 bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
              <h2 className="text-2xl font-bold text-white mb-6">Property Reviews</h2>
              
              {/* Review Form - Only for logged-in users who didn't list this property */}
              {currentUser && listing.userRef !== currentUser._id && !hasUserReviewed && (
                <ReviewForm 
                  listingId={params.listingId} 
                  onReviewSubmit={handleReviewSubmit}
                  initialReview={editingReview}
                  onUpdateReview={handleUpdateReview}
                />
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
              <div className="grid gap-4 mt-6">
                {reviews.map((review) => (
                  <div 
                    key={review._id} 
                    className="bg-neutral-900 rounded-xl p-6 border border-neutral-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {/* Star Rating */}
                        <div className="flex items-center mr-4">
                          {[...Array(5)].map((_, index) => (
                            <FaStar 
                              key={index} 
                              className={`mr-1 ${index < review.rating ? 'text-amber-500' : 'text-neutral-600'}`} 
                            />
                          ))}
                          <span className="ml-2 text-neutral-400 text-sm">
                            {review.rating}/5
                          </span>
                        </div>
                        
                        {/* Username */}
                        <span className="text-neutral-300 text-sm font-medium">
                          - {review.userRef?.username || review.userRef || 'Anonymous User'}
                        </span>
                      </div>

                      {/* Delete Button (only for review owner) */}
                      {currentUser && review.userRef?._id === currentUser._id && (
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleDeleteReview(review._id)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-neutral-300">{review.comment}</p>
                  </div>
                ))}
              </div>
           
