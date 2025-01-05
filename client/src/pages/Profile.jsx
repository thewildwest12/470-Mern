
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  // Keeping all the existing state and handlers
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showGoodbye, setShowGoodbye] = useState(false);
  const dispatch = useDispatch();
  const [showNoListingsModal, setShowNoListingsModal] = useState(false);

  // Keep all the existing useEffects and handlers
  useEffect(() => {
    setFormData({ ...currentUser });
  }, [currentUser]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // All existing handlers remain the same
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
          handleUpdateAvatar(downloadURL);
        });
      }
    );
  };

  // Keep all other handlers...
  const handleUpdateAvatar = async (avatarUrl) => {
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar: avatarUrl }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowGoodbye(true);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        setShowGoodbye(false);
        return;
      }
      setTimeout(() => {
        dispatch(deleteUserSuccess(data));
      }, 2000);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      setShowGoodbye(false);
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-800">
      {/* Modals remain the same */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4">Confirm Delete Account</h3>
            <p className="text-slate-300 mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteUser}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-500"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-slate-600 text-white py-2 rounded-lg hover:bg-slate-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Profile Dashboard</h1>
          <div className="w-24 h-1 bg-amber-400 mx-auto"></div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Profile Image */}
          <div className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700">
            <div className="text-center mb-8">
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
              />
              <img
                onClick={() => fileRef.current.click()}
                src={formData.avatar || currentUser.avatar}
                alt="profile"
                className="w-40 h-40 rounded-full mx-auto border-4 border-amber-400 cursor-pointer object-cover hover:opacity-90 transition"
              />
              <button
                onClick={() => fileRef.current.click()}
                className="mt-4 w-full bg-amber-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-amber-500 transition shadow-lg"
              >
                Change Profile Picture
              </button>
              <p className="text-sm mt-2">
                {fileUploadError ? (
                  <span className="text-red-400">Error Image upload (image must be less than 2 mb)</span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className="text-amber-400">{`Uploading ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span className="text-green-400">Image successfully uploaded!</span>
                ) : (
                  ''
                )}
              </p>
            </div>
          </div>

          {/* Right Column - Action Buttons */}
          <div className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700">
            <div className="space-y-4">
              <Link
                to="/update-profile"
                className="block w-full bg-amber-500 text-white py-4 rounded-xl text-center font-semibold hover:bg-amber-400 transition shadow-lg"
              >
                Update Profile Information
              </Link>
              <Link
                to="/create-listing"
                className="block w-full bg-amber-600 text-white py-4 rounded-xl text-center font-semibold hover:bg-amber-500 transition shadow-lg"
              >
                Create New Listing
              </Link>
              <Link
                to="/my-listings"
                className="block w-full bg-amber-700 text-white py-4 rounded-xl text-center font-semibold hover:bg-amber-600 transition shadow-lg"
              >
                View My Listings
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-red-800 text-white py-4 rounded-xl font-semibold hover:bg-red-700 transition shadow-lg"
              >
                Delete Account
              </button>
              <button
                onClick={handleSignOut}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold hover:bg-red-500 transition shadow-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

