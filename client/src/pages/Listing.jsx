
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
