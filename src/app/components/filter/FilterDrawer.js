// FilterDrawer.jsx
"use client";

import { X } from "lucide-react";

export default function FilterDrawer({
  isOpen,
  isAnimating,
  onClose,
  onFilterChange, // Function to update filters in the parent
  isMobile,
  filtersFromParent, // The full list of available filter options (colors, sizes, etc.)
  activeFilters, // The current state of selected filters
}) {

  console.log("FilterDrawer Props:", { isOpen, filtersFromParent, activeFilters });


  if (!isOpen) {
    return null;
  }

  const drawerClassName = isMobile
    ? `fixed inset-x-0 bottom-0 h-4/5 bg-white shadow-lg z-[101] transform transition-transform duration-300 ease-in-out ${
        isAnimating ? "translate-y-0" : "translate-y-full"
      }`
    : `fixed inset-y-0 right-0 w-full sm:w-1/3 bg-white shadow-lg z-[101] transform transition-transform duration-300 ease-in-out ${
        isAnimating ? "translate-x-0" : "translate-x-full"
      }`;

  // This function updates the active filters and sends the new state to the parent
  const handleChange = (key, value, type = "checkbox") => {
    const current = activeFilters[key] || [];
    let updated;

    if (type === "checkbox") {
      updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    } else if (type === "range") {
      updated = value;
    }

    // Call the parent's handler with the new, updated state
    const newState = { ...activeFilters, [key]: updated };
    onFilterChange(newState);
  };

  const handleClear = () => {
    // Clear all filters by sending an empty object to the parent
    onFilterChange({});
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] w-full transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={drawerClassName}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 relative">
          <h2 className="font-inter text-lg sm:text-xl font-semibold text-black absolute left-1/2 -translate-x-1/2">
            FILTER
          </h2>
          <X
            className="h-6 w-6 cursor-pointer text-gray-500 hover:text-primary transition-colors ml-auto"
            onClick={onClose}
          />
        </div>

        {/* Filters */}
        <div className="overflow-y-auto h-[calc(100%-120px)]">
          {/* Colors */}
          {filtersFromParent?.colors?.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold mb-2">Colors</h3>
              <div className="space-y-2">
                {filtersFromParent.colors.map(color => (
                  <label key={color} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={activeFilters.colors?.includes(color) || false}
                      onChange={() => handleChange("colors", color)}
                    />
                    <span>{color}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {/* Sizes */}
          {filtersFromParent?.sizes?.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold mb-2">Sizes</h3>
              <div className="space-y-2">
                {filtersFromParent.sizes.map(size => (
                  <label key={size} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={activeFilters.sizes?.includes(size) || false}
                      onChange={() => handleChange("sizes", size)}
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {/* Categories */}
          {filtersFromParent?.categories?.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold mb-2">Categories</h3>
              <div className="space-y-2">
                {filtersFromParent.categories.map(cat => (
                  <label key={cat} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={activeFilters.categories?.includes(cat) || false}
                      onChange={() => handleChange("categories", cat)}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {/* Price Range */}
          {filtersFromParent && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold mb-2">Price Range</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={filtersFromParent.minPrice}
                  max={filtersFromParent.maxPrice}
                  value={activeFilters.priceRange?.[0] ?? 0}
                  onChange={(e) =>
                    handleChange("priceRange", [
                      +e.target.value,
                      activeFilters.priceRange?.[1] ?? 0,
                    ], "range")
                  }
                  className="border rounded px-2 py-1 w-20"
                />
                <span>-</span>
                <input
                  type="number"
                  min={filtersFromParent.minPrice}
                  max={filtersFromParent.maxPrice}
                  value={activeFilters.priceRange?.[1] ?? 0}
                  onChange={(e) =>
                    handleChange("priceRange", [
                      activeFilters.priceRange?.[0] ?? 0,
                      +e.target.value,
                    ], "range")
                  }
                  className="border rounded px-2 py-1 w-20"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Min: {filtersFromParent.minPrice} - Max: {filtersFromParent.maxPrice}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4 p-4 justify-center items-center w-full border-t border-gray-200">
          <button
            className="flex-1 px-4 py-2 bg-white border border-black text-black text-md sm:text-lg font-inter disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClear}
          >
            CLEAR
          </button>
          <button
            className="flex-1 px-4 py-2 bg-black text-white font-inter text-md sm:text-lg"
            onClick={onClose}
          >
            APPLY
          </button>
        </div>
      </div>
    </>
  );
}