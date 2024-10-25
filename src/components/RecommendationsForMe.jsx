import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../providers/AuthProvider';

const RecommendationsForMe = () => {
    const [queries, setQueries] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchQueriesAndRecommendations = async () => {
            try {
                // Fetch recommendations made by the authenticated user
                const recommendationsResponse = await axios.get(`https://b9-a11-server-plum.vercel.app/api/recommendations-for-user/${user.email}`);
                setRecommendations(recommendationsResponse.data);

                // Extract unique query IDs from recommendations
                const queryIds = [...new Set(recommendationsResponse.data.map(rec => rec.queryId))];

                // Fetch queries related to the recommendations
                if (queryIds.length > 0) {
                    const queriesResponse = await axios.get('https://b9-a11-server-plum.vercel.app/api/recommendations/by-query-ids', {
                        params: { queryIds: queryIds.join(',') }
                    });
                    setQueries(queriesResponse.data);
                }

                setError(null);
            } catch (error) {
                console.error('Error fetching queries or recommendations:', error);
                setError(error.response ? error.response.data.message : 'Error fetching queries or recommendations');
            } finally {
                setLoading(false);
            }
        };

        if (user && user.email) {
            fetchQueriesAndRecommendations();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#FF6F61]"></div>
            </div>
        );
    }

    return (
        <section className="p-6 bg-white dark:bg-gray-800 text-black dark:text-white">
            <Helmet>
                <title>AlternativeZone | Recommendations For Me</title>
            </Helmet>
            <h1 className="text-2xl my-4 font-extrabold text-center">Recommendations For Me</h1>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            {recommendations.length === 0 ? (
                <div className="text-center mt-4">No recommendations found for your queries.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center">Query Title</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center">Product Name</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center">Recommendation Title</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center">Recommended Product</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center">Reason</th>
                                <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center">Recommender</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recommendations.map((rec) => (
                                <tr key={rec._id}>
                                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{rec.queryTitle}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{rec.productName}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{rec.recommendation_title}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">
                                        <img src={rec.recommended_product_image} alt={rec.recommended_product_name} className="w-20 h-20 object-cover mx-auto" />
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{rec.recommendation_reason}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{rec.recommenderName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default RecommendationsForMe;
