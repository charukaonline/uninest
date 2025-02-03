import { FaSearch } from "react-icons/fa";

const SearchBox = () => {
    return (
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
            <input
                type="text"
                placeholder="Search Here...."
                className="outline-none border-none bg-transparent w-full"
            />
            <FaSearch className="text-green-700 cursor-pointer" />
        </div>
    );
};

export default SearchBox;
