
// MyListings.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function MyListings() {
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setUserListings(data);
      } catch (error) {
        setError('Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchUserListings();
    }
  }, [currentUser?._id]);

  const handleDeleteClick = (listing) => {
    setListingToDelete(listing);
    setShowDeleteModal(true);
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-800 to-slate-900">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Delete Listing</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete "{listingToDelete?.name}"? This action can not be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteListing(listingToDelete?._id)}
                className="px-4 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition border border-red-400"
              >
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}
