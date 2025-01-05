
{/* Contact Button */}
{currentUser && listing.userRef !== currentUser._id && !contact && (
  <button
    onClick={() => setContact(true)}
    className="w-full bg-amber-700 text-white py-4 rounded-xl hover:bg-amber-800 transition-colors duration-300 font-semibold mt-6"
  >
    Contact Owner
  </button>
)}
{contact && <Contact listing={listing} />}
</div>
