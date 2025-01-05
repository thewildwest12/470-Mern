
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
