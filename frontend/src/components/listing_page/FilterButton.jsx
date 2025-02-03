const FilterButton = ({ label, active }) => {
    return (
        <button
            className={`px-4 py-2 border border-gray-300 rounded-lg ${
                active ? "bg-green-700 text-white" : "text-gray-500"
            }`}
        >
            {label}
        </button>
    );
};

export default FilterButton;
