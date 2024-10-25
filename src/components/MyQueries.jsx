import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from "../providers/AuthProvider";

const MyQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [queryToDelete, setQueryToDelete] = useState(null);
    const [queryToEdit, setQueryToEdit] = useState(null);
    const [updatedQuery, setUpdatedQuery] = useState({
        product_name: '',
        product_brand: '',
        product_image: '',
        query_title: '',
        boycotting_reason: ''
    });

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const response = await axios.get('https://b9-a11-server-plum.vercel.app/api/queries', {
                params: { user_email: user.email }
            });
            // Sort queries by timestamp in descending order
            const sortedQueries = response.data.sort((a, b) => new Date(b.current_date) - new Date(a.current_date));
            setQueries(sortedQueries);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching queries:', error);
            setLoading(false);
        }
    };

    const openDeleteModal = (query) => {
        setQueryToDelete(query);
        setDeleteModalIsOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalIsOpen(false);
        setQueryToDelete(null);
    };

    const handleDelete = async () => {
        if (!queryToDelete) return;

        try {
            await axios.delete(`https://b9-a11-server-plum.vercel.app/api/queries/${queryToDelete._id}`);
            setQueries(queries.filter(query => query._id !== queryToDelete._id));
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting query:', error);
            closeDeleteModal();
        }
    };

    const openEditModal = (query) => {
        setQueryToEdit(query);
        setUpdatedQuery(query);
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setEditModalIsOpen(false);
        setQueryToEdit(null);
        setUpdatedQuery({
            product_name: '',
            product_brand: '',
            product_image: '',
            query_title: '',
            boycotting_reason: ''
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setUpdatedQuery(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!queryToEdit) return;

        try {
            const { _id, ...updateData } = updatedQuery; // Exclude _id field
            const response = await axios.put(`https://b9-a11-server-plum.vercel.app/api/queries/${queryToEdit._id}`, updateData);
            if (response.status === 200) {
                const updatedQueries = queries.map(query =>
                    query._id === queryToEdit._id ? { ...query, ...updateData } : query
                );
                setQueries(updatedQueries);
                closeEditModal();
            } else {
                console.error('Error updating query:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating query:', error);
            closeEditModal();
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#FF6F61]"></div>
        </div>;
    }

    return (
        <section className="p-6 bg-white dark:bg-gray-800 text-black dark:text-white">
            <Helmet>
                <title>AlternativeZone | My Queries</title>
            </Helmet>
            <div className="p-6 py-12 rounded-lg bg-[#6CBF40] dark:text-gray-50 mb-4">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <h2 className="text-center text-6xl tracking-tighter font-bold">Add Your Queries</h2>
                        <div className="flex justify-between items-center mb-4">
                            <Link to="/addquery" className="btn border-none bg-[#FF6F61] text-white">Add Query</Link>
                        </div>
                    </div>
                </div>
            </div>
            {queries.length === 0 ? (
                <div className="flex flex-col text-center mt-4"><p>No queries found.</p>
                    <Link to="/addquery" className="btn border-none bg-[#FF6F61] text-white">Add Query</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full w-full">
                    {queries.map((query) => (
                        <div key={query._id} className="shadow-xl border-solid border-2 border-[#FF6F61]">
                            <div className="bg-white dark:bg-gray-800 text-black dark:text-white">
                                <img src={query.product_image} alt={query.product_name} className="w-full h-1/2 object-cover mb-4" />
                                <div className='p-4'>
                                    <h2 className="card-title">{query.query_title}</h2>
                                    <p>Product Name: {query.product_name}</p>
                                    <p>Brand: {query.product_brand}</p>
                                    <p>Reason: {query.boycotting_reason}</p>
                                    <p>Submitted: {new Date(query.current_date).toLocaleString()}</p>
                                    <div className="flex items-center mt-4">
                                        <img src={query.user_image} alt={query.user_name} className="w-8 h-8 rounded-full mr-2" />
                                        <p>{query.user_name}</p>
                                    </div>
                                    <div className="card-actions justify-end mt-4">
                                        <Link to={`/viewdetail/${query._id}`} className="btn bg-[#FF6F61] text-white">View</Link>
                                        <button onClick={() => openEditModal(query)} className="btn bg-blue-500 text-white ml-2">Edit</button>
                                        <button onClick={() => openDeleteModal(query)} className="btn bg-red-500 text-white ml-2">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteModalIsOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full mx-4 sm:mx-6 md:mx-10 lg:mx-auto">
                        <h2 className="text-xl font-bold">Confirm Delete</h2>
                        <p>Are you sure you want to delete this query?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={closeDeleteModal} className="btn bg-gray-500 text-white mr-2">Cancel</button>
                            <button onClick={handleDelete} className="btn bg-red-500 text-white">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {editModalIsOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full mx-4 sm:mx-6 md:mx-10 lg:mx-auto overflow-y-auto max-h-screen">
                        <h2 className="text-xl font-bold">Edit Query</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2" htmlFor="query_title">Query Title</label>
                                <input
                                    type="text"
                                    id="query_title"
                                    name="query_title"
                                    value={updatedQuery.query_title}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded bg-white text-black"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2" htmlFor="product_name">Product Name</label>
                                <input
                                    type="text"
                                    id="product_name"
                                    name="product_name"
                                    value={updatedQuery.product_name}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded bg-white text-black"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2" htmlFor="product_brand">Product Brand</label>
                                <input
                                    type="text"
                                    id="product_brand"
                                    name="product_brand"
                                    value={updatedQuery.product_brand}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded bg-white text-black"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2" htmlFor="product_image">Product Image URL</label>
                                <input
                                    type="text"
                                    id="product_image"
                                    name="product_image"
                                    value={updatedQuery.product_image}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded bg-white text-black"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2" htmlFor="boycotting_reason">Boycotting Reason</label>
                                <textarea
                                    id="boycotting_reason"
                                    name="boycotting_reason"
                                    value={updatedQuery.boycotting_reason}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded bg-white text-black"
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button type="button" onClick={closeEditModal} className="btn bg-gray-500 text-white mr-2">Cancel</button>
                                <button type="submit" className="btn bg-blue-500 text-white">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MyQueries;
