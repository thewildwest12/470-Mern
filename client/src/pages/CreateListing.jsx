

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-800 to-slate-900">
      {/* Hero Section */}
      <div className="border-b border-slate-700 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            Create a New Listing
          </h1>
          <div className="w-24 h-1 bg-amber-400 mx-auto mb-8"></div>
        </div>
      </div>

      {/* Main Form Section */}
      <main className="p-6 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-8 text-slate-200">
          <div className="flex flex-col gap-6 flex-1">
            <input
              type="text"
              placeholder="Property Name"
              className="border border-slate-600 p-4 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
              id="name"
              maxLength="62"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type="text"
              placeholder="Description"
              className="border border-slate-600 p-4 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Address"
              className="border border-slate-600 p-4 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />
            
            {/* Checkboxes for parking debugged  */} 
            <div className="flex gap-6 flex-wrap">
            {[
                  { id: 'sale', label: 'Sale' },
                  { id: 'rent', label: 'Rent' },
                  { id: 'parking', label: 'Parking' },
                  { id: 'furnished', label: 'Furnished' },
                  { id: 'offer', label: 'Offer' }
                ].map((item) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      id={item.id}
                      className="w-5 h-5 rounded border-slate-600 text-amber-400 focus:ring-amber-400 bg-slate-800"
                      onChange={handleChange}
                      checked={
                        item.id === 'sale' || item.id === 'rent'
                          ? formData.type === item.id
                          : formData[item.id]
                      }
                    />
                    <span>{item.label}</span>
                  </div>
                ))}
            </div>

            {/* Number Inputs */}
            <div className="flex gap-6 flex-wrap">
              {[
                { id: 'bedrooms', label: 'Bedrooms', min: 1, max: 10 },
                { id: 'bathrooms', label: 'Bathrooms', min: 1, max: 10 },
                { id: 'regularPrice', label: 'Regular Price', min: 50, max: 10000000 },
                formData.offer && {
                  id: 'discountPrice',
                  label: 'Discounted Price',
                  min: 0,
                  max: 10000000,
                },
              ]
                .filter(Boolean)
                .map((field) => (
                  <div key={field.id} className="flex flex-col items-center gap-2">
                    <input
                      type="number"
                      id={field.id}
                      min={field.min}
                      max={field.max}
                      required
                      className="p-4 border border-slate-600 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-amber-400"
                      onChange={handleChange}
                      value={formData[field.id]}
                    />
                    <p className="text-center">{field.label}</p>
                    {(field.id === 'regularPrice' || field.id === 'discountPrice') &&
                      formData.type === 'rent' && (
                        <span className="text-xs text-slate-400">($ / month)</span>
                      )}
                  </div>
                ))}
            </div>
          </div>
