import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../providers/AuthProvider';

const MyRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [recommendationToDelete, setRecommendationToDelete] = useState(null);

    useEffect(() => {
        if (user && user.email) {
            const loadData = async () => {
                try {
                    const response = await axios.get('https://b9-a11-server-plum.vercel.app/api/my-recommendations', {
                        params: { user_email: user.email }
                    });
                    setRecommendations(response.data);
                    setError(null);
                } catch (error) {
                    console.error('Error fetching recommendations:', error);
                    setError(error.response ? error.response.data.message : 'Error fetching recommendations');
                } finally {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000); // Ensures the loading spinner shows for at least 1 second
                }
            };
            loadData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const openDeleteModal = (recommendation) => {
        setRecommendationToDelete(recommendation);
        setDeleteModalIsOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalIsOpen(false);
        setRecommendationToDelete(null);
    };

    const handleDelete = async () => {
        if (!recommendationToDelete) return;

        try {
            console.log("Deleting recommendation with ID:", recommendationToDelete._id);
            await axios.delete(`https://b9-a11-server-plum.vercel.app/api/recommendations/${recommendationToDelete._id}`);
            setRecommendations(recommendations.filter(r => r._id !== recommendationToDelete._id));
            await decreaseRecommendationCount(recommendationToDelete.queryId);
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting recommendation:', error);
            closeDeleteModal();
        }
    };

    const decreaseRecommendationCount = async (queryId) => {
        if (!queryId) {
            console.error('Query ID is required');
            return;
        }
        try {
            await axios.put(`https://b9-a11-server-plum.vercel.app/api/queries/${queryId}/decrement-recommendations`);
        } catch (error) {
            console.error('Error decreasing recommendation count:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#FF6F61]"></div>
            </div>
        );
    }

    return (
        <section className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 text-black dark:text-white">
            <Helmet>
                <title>AlternativeZone | My Recommendations</title>
            </Helmet>
            <h1 className="text-2xl my-4 font-extrabold text-center">My Recommendations</h1>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {recommendations.length === 0 ? (
                <div className="text-center mt-4">No recommendations found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center">Title</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center">Product Name</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center">Image</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center">Reason</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recommendations.map((rec) => (
                                <tr key={rec._id}>
                                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{rec.recommendation_title}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{rec.recommended_product_name}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">
                                        <img src={rec.recommended_product_image} alt={rec.recommended_product_name} className="w-20 h-20 object-cover inline-block" />
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{rec.recommendation_reason}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">
                                        <button onClick={() => openDeleteModal(rec)} className="btn bg-red-500 text-white">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {deleteModalIsOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full mx-4 sm:mx-6 md:mx-10 lg:mx-auto">
                        <h2 className="text-xl font-bold">Confirm Delete</h2>
                        <p>Are you sure you want to delete this recommendation?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={closeDeleteModal} className="btn bg-gray-500 text-white mr-2">Cancel</button>
                            <button onClick={handleDelete} className="btn bg-red-500 text-white">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MyRecommendations;
