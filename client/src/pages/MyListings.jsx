
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


// // MyListings.jsx
// import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';

// export default function MyListings() {
//   const [userListings, setUserListings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { currentUser } = useSelector((state) => state.user);

//   useEffect(() => {
//     const fetchUserListings = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const res = await fetch(`/api/user/listings/${currentUser._id}`);
//         const data = await res.json();
//         if (data.success === false) {
//           setError(data.message);
//           return;
//         }
//         setUserListings(data);
//       } catch (error) {
//         setError('Failed to fetch listings');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (currentUser?._id) {
//       fetchUserListings();
//     }
//   }, [currentUser?._id]);

//   const handleDeleteListing = async (listingId) => {
//     try {
//       const res = await fetch(`/api/listing/delete/${listingId}`, {
//         method: 'DELETE',
//       });
//       const data = await res.json();
//       if (data.success === false) {
//         console.log(data.message);
//         return;
//       }
//       setUserListings((prev) =>
//         prev.filter((listing) => listing._id !== listingId)
//       );
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   if (loading) {
//     return <div className="text-center p-6">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500 text-center p-6">{error}</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-semibold mb-6">My Listings</h1>
//       {userListings.length === 0 ? (
//         <div className="text-center">
//           <p className="mb-4">You haven't created any listings yet.</p>
//           <Link
//             to="/create-listing"
//             className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800"
//           >
//             Create a Listing
//           </Link>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {userListings.map((listing) => (
//             <div
//               key={listing._id}
//               className="bg-white rounded-lg shadow-md overflow-hidden"
//             >
//               <img
//                 src={listing.imageUrls[0]}
//                 alt={listing.name}
//                 className="h-48 w-full object-cover"
//               />
//               <div className="p-4">
//                 <h3 className="text-xl font-semibold mb-2 truncate">
//                   {listing.name}
//                 </h3>
//                 <p className="text-gray-600 mb-2 truncate">
//                   {listing.address}
//                 </p>
//                 <p className="text-gray-800 mb-2">
//                   ${listing.regularPrice.toLocaleString()}
//                   {listing.type === 'rent' && ' / month'}
//                 </p>
//                 <div className="flex gap-2">
//                   <Link
//                     to={`/update-listing/${listing._id}`}
//                     className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 flex-1 text-center"
//                   >
//                     Edit
//                   </Link>
//                   <button
//                     onClick={() => handleDeleteListing(listing._id)}
//                     className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 flex-1"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// Profile.jsx component remains the same as before...
