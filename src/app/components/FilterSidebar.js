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
    <aside className="w-full p-4 rounded-lg overflow-y-auto font-roboto">
      {filters.map((filter) => (
        <div key={filter.name} className="mb-6">
          <div
            className="flex justify-between items-center cursor-pointer hover:text-primary"
            onClick={() => toggleFilter(filter.name)}
          >
            <h3 className="font-semibold text-lg">{filter.name}</h3>
            {openFilters[filter.name] ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
          {openFilters[filter.name] && (
            <div className="mt-2 space-y-2">
              {filter.options.map((option) => (
                <label key={option} className="block">
                  <input type="checkbox" className="mr-2" />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      <button
        className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-gray-80 transition"
        onClick={onClear}
      >
        Clear Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
