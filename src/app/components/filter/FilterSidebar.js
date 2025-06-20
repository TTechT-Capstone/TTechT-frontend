import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FilterSidebar = ({ filters, onClear }) => {
  const [openFilters, setOpenFilters] = useState(
    filters.reduce((acc, filter) => ({ ...acc, [filter.name]: false }), {})
  );

  const toggleFilter = (filterName) => {
    setOpenFilters((prevState) => ({
      ...prevState,
      [filterName]: !prevState[filterName],
    }));
  };

  return (
    <aside className="w-full pr-4 rounded-lg overflow-y-auto font-roboto">
      {filters.map((filter) => (
        <div key={filter.name} className="mb-6">
          {/* Filter header */}
          <div
            className="flex justify-between items-center cursor-pointer hover:text-primary space-x-2"
            onClick={() => toggleFilter(filter.name)}
          >
            <h3 className="font-urbanist font-bold text-gray-700">
              {filter.name}
            </h3>
            {openFilters[filter.name] ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>

          {/* Filter options */}
          {openFilters[filter.name] && (
            <div className="mt-2 space-y-2 pl-1">
              {filter.options.map((option) => (
                <label key={option} className="block text-sm text-gray-800">
                  <input type="checkbox" className="mr-2 accent-primary" />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-gray-400 transition-colors duration-200"
        onClick={onClear}
      >
        Clear Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
