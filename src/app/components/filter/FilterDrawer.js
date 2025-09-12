// FilterDrawer.jsx
"use client";

import { useState } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

export default function FilterDrawer({
  isOpen,
  isAnimating,
  onClose,
  isMobile,
  filtersFromParent,
  onFilterChange,
  activeFilters,
  onApply,
  onClear,
}) {
  const [currentView, setCurrentView] = useState("main");

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

  const handleChange = (key, value) => {
    let updated;
    const current = activeFilters[key] || [];
    updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...activeFilters, [key]: updated });
  };

  const handlePriceChange = (type, value) => {
    const [currentMin, currentMax] = activeFilters.priceRange || [
      filtersFromParent.minPrice,
      filtersFromParent.maxPrice,
    ];
    const newPrice = +value;
    let updatedPriceRange;

    if (type === "minPrice") {
      updatedPriceRange = [newPrice, currentMax];
    } else {
      updatedPriceRange = [currentMin, newPrice];
    }
    onFilterChange({ ...activeFilters, priceRange: updatedPriceRange });
  };

  const renderMainView = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 relative">
        <h2 className="font-inter text-lg sm:text-xl font-semibold text-black absolute left-1/2 -translate-x-1/2">
          FILTERS
        </h2>
        <X
          className="h-6 w-6 cursor-pointer text-gray-500 hover:text-primary transition-colors ml-auto"
          onClick={onClose}
        />
      </div>
      <div className="overflow-y-auto h-[calc(100%-120px)]">
        {filtersFromParent && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold mb-2">Price Range</h3>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={filtersFromParent.minPrice}
                max={
                  activeFilters.priceRange?.[1] || filtersFromParent.maxPrice
                }
                value={
                  activeFilters.priceRange?.[0] ?? filtersFromParent.minPrice
                }
                onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                className="border rounded px-2 py-1 w-20"
              />
              <span>-</span>
              <input
                type="number"
                min={
                  activeFilters.priceRange?.[0] || filtersFromParent.minPrice
                }
                max={filtersFromParent.maxPrice}
                value={
                  activeFilters.priceRange?.[1] ?? filtersFromParent.maxPrice
                }
                onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                className="border rounded px-2 py-1 w-20"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Min: {filtersFromParent.minPrice} - Max:{" "}
              {filtersFromParent.maxPrice}
            </p>
          </div>
        )}
        <div
          className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
          onClick={() => setCurrentView("colors")}
        >
          <span className="font-semibold">Colors</span>
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </div>
        <div
          className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
          onClick={() => setCurrentView("sizes")}
        >
          <span className="font-semibold">Sizes</span>
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </div>
        <div
          className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
          onClick={() => setCurrentView("categories")}
        >
          <span className="font-semibold">Categories</span>
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </div>
      </div>
    </>
  );

  const renderColorView = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 relative">
        <ChevronLeft
          className="h-6 w-6 cursor-pointer text-gray-500 hover:text-primary transition-colors"
          onClick={() => setCurrentView("main")}
        />
        <h2 className="font-inter text-lg sm:text-xl font-semibold text-black absolute left-1/2 -translate-x-1/2">
          COLORS
        </h2>
        <X
          className="h-6 w-6 cursor-pointer text-gray-500 hover:text-primary transition-colors"
          onClick={onClose}
        />
      </div>
      <div className="overflow-y-auto p-4 h-[calc(100%-120px)]">
        <div className="space-y-2">
          {filtersFromParent.colors.map((color) => (
            <label
              key={color}
              className="flex items-center justify-between space-x-2"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={activeFilters.colors?.includes(color) || false}
                  onChange={() => handleChange("colors", color)}
                />
                <span>{color}</span>
              </div>
              <span
                className="h-5 w-5 rounded-full"
                style={{ backgroundColor: color }}
              ></span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  const renderSizeView = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 relative">
        <ChevronLeft
          className="h-6 w-6 cursor-pointer text-gray-500 hover:text-primary transition-colors"
          onClick={() => setCurrentView("main")}
        />
        <h2 className="font-inter text-lg sm:text-xl font-semibold text-black absolute left-1/2 -translate-x-1/2">
          SIZES
        </h2>
        <X
          className="h-6 w-6 cursor-pointer text-gray-500 hover:text-primary transition-colors"
          onClick={onClose}
        />
      </div>
      <div className="overflow-y-auto p-4 h-[calc(100%-120px)]">
        <div className="space-y-2">
          {filtersFromParent.sizes.map((size) => (
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
    </>
  );

  const renderCategoryView = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 relative">
        <ChevronLeft
          className="h-6 w-6 cursor-pointer text-gray-500 hover:text-primary transition-colors"
          onClick={() => setCurrentView("main")}
        />
        <h2 className="font-inter text-lg sm:text-xl font-semibold text-black absolute left-1/2 -translate-x-1/2">
          CATEGORIES
        </h2>
        <X
          className="h-6 w-6 cursor-pointer text-gray-500 hover:text-primary transition-colors"
          onClick={onClose}
        />
      </div>
      <div className="overflow-y-auto p-4">
        <div className="space-y-2">
          {filtersFromParent.categories.map((cat) => (
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
    </>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case "main":
        return renderMainView();
      case "colors":
        return renderColorView();
      case "sizes":
        return renderSizeView();
        break;
      case "categories":
        return renderCategoryView();
        break;
      default:
        return renderMainView();
    }
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
        <div className="flex flex-col h-full">
    {/* Content */}
    <div className="flex-1 overflow-y-auto">
      {renderCurrentView()}
    </div>

        <div className="flex space-x-4 p-4 justify-center items-center w-full border-t border-gray-200">
          <button
            className="flex-1 px-4 py-2 bg-white border border-black text-black text-md sm:text-lg font-inter disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClear}
          >
            CLEAR
          </button>
          <button
            className="flex-1 px-4 py-2 bg-black text-white font-inter text-md sm:text-lg"
            onClick={onApply}
          >
            APPLY
          </button>
          </div>
        </div>
      </div>
    </>
  );
}
