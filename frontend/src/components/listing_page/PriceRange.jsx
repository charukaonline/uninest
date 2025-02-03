const PriceRange = ({ priceRange, setPriceRange }) => {
    return (
        <div className="flex flex-col items-center">
            <span className="text-sm font-medium">Price: ${priceRange[0]} - ${priceRange[1]}</span>
            <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-24 cursor-pointer accent-green-700"
            />
            <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-24 cursor-pointer accent-green-700"
            />
        </div>
    );
};

export default PriceRange;
