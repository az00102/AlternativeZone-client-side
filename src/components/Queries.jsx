import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Queries = () => {
    const [queries, setQueries] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [gridLayout, setGridLayout] = useState("grid-cols-1 md:grid-cols-2 lg:grid-cols-3");
    const [queriesPerPage, setQueriesPerPage] = useState(6);

    useEffect(() => {
        setTimeout(() => {
            fetchQueries();
        }, 1000);
    }, []);

    const fetchQueries = async () => {
        try {
            const response = await axios.get('https://b9-a11-server-plum.vercel.app/api/allqueries');
            const sortedQueries = response.data.sort((a, b) => new Date(b.current_date) - new Date(a.current_date));
            setQueries(sortedQueries);
        } catch (error) {
            console.error('Error fetching queries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleGridChange = (layout, perPage) => {
        setGridLayout(layout);
        setQueriesPerPage(perPage);
        setCurrentPage(1); // Reset to first page on layout change
    };

    const filteredQueries = queries.filter(query =>
        query.product_name.toLowerCase().includes(searchText.toLowerCase())
    );

    // Get current queries
    const indexOfLastQuery = currentPage * queriesPerPage;
    const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
    const currentQueries = filteredQueries.slice(indexOfFirstQuery, indexOfLastQuery);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#FF6F61]"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-200 dark:bg-gray-700">
            <h2 className="text-3xl font-bold mb-4 text-center p-2">Queries</h2>
            <h3 className="text-xl mb-6 text-center p-2">Explore the latest queries and find the best product alternatives.</h3>
            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    placeholder="Search by product name"
                    value={searchText}
                    onChange={handleSearchChange}
                    className="p-2 border rounded-md"
                />
            </div>
            <div className="flex justify-center mb-4">
                <button onClick={() => handleGridChange("grid-cols-1", 2)} className="px-4 py-2 mx-2 bg-[#FF6F61] text-white rounded">1 Column</button>
                <button onClick={() => handleGridChange("grid-cols-1 md:grid-cols-2", 4)} className="px-4 py-2 mx-2 bg-[#FF6F61] text-white rounded">2 Columns</button>
                <button onClick={() => handleGridChange("grid-cols-1 md:grid-cols-2 lg:grid-cols-3", 6)} className="px-4 py-2 mx-2 bg-[#FF6F61] text-white rounded">3 Columns</button>
            </div>
            <div className={`grid ${gridLayout} gap-4 p-4`}>
                {currentQueries.map(query => (
                    <div key={query._id} className="shadow-xl border-solid border-2 border-[#FF6F61]">
                        <div className="bg-white dark:bg-gray-800 text-black dark:text-white">
                            <img src={query.product_image} alt={query.product_name} className="w-full h-1/2 object-cover mb-4" />
                            <div className="p-4">
                                <h2 className="card-title">{query.query_title}</h2>
                                <p>Product Name: {query.product_name}</p>
                                <p>Brand: {query.product_brand}</p>
                                <p>Reason: {query.boycotting_reason}</p>
                                <p>Submitted: {new Date(query.current_date).toLocaleString()}</p>
                                <div className="flex items-center mt-4">
                                    <img src={query.user_image} alt={query.user_name} className="w-8 h-8 rounded-full mr-2" />
                                    <p>{query.user_name}</p>
                                </div>
                                <p className="mt-4">Recommendations: {query.recommendationCount}</p>
                                <div className="card-actions justify-end mt-4">
                                    <Link to={`/viewdetail/${query._id}`} className="btn bg-[#FF6F61] border-none text-white">Recommend</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4 pb-4">
                {Array.from({ length: Math.ceil(filteredQueries.length / queriesPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-[#FF6F61] text-white' : 'bg-white dark:bg-gray-800 text-black dark:text-white'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Queries;
