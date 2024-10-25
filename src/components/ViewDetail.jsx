import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { AuthContext } from '../providers/AuthProvider';

const ViewDetail = () => {
    const { queryId } = useParams();
    const [query, setQuery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [recommendationData, setRecommendationData] = useState({
        recommendation_title: '',
        recommended_product_name: '',
        recommended_product_image: '',
        recommendation_reason: ''
    });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        console.log("Current user in ViewDetail component:", user); // Add this line for debugging

        const fetchQueryData = async () => {
            try {
                const response = await axios.get(`https://b9-a11-server-plum.vercel.app/api/queries/${queryId}`);
                setQuery(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching query data:', error);
                setError('Failed to fetch query');
                setLoading(false);
            }
        };

        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(`https://b9-a11-server-plum.vercel.app/api/recommendations`, {
                    params: { queryId: queryId }
                });
                const recommendationsData = response.data;

                // Directly use recommender information from the recommendationsData
                const updatedRecommendations = recommendationsData.map(rec => ({
                    ...rec,
                    recommenderInfo: {
                        email: rec.recommenderEmail,
                        name: rec.recommenderName || "Unknown User",
                        image: null // Assuming no image is available in recommendation data
                    }
                }));

                setRecommendations(updatedRecommendations);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        if (queryId) {
            fetchQueryData();
            fetchRecommendations();
        }
    }, [queryId, user]); // Add user to dependency array

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecommendationData({
            ...recommendationData,
            [name]: value
        });
    };

    const handleAddRecommendation = async (e) => {
        e.preventDefault();

        if (!user) {
            console.error("No user is logged in");
            toast.error("You must be logged in to add a recommendation");
            return;
        }

        const newRecommendation = {
            ...recommendationData,
            queryId: query._id,
            queryTitle: query.query_title,
            productName: query.product_name,
            userEmail: query.user_email,
            userName: query.user_name,
            recommenderEmail: user.email,
            recommenderName: user.displayName || user.name, // Use displayName or name
            current_date: new Date().toISOString()
        };

        try {
            await axios.post('https://b9-a11-server-plum.vercel.app/api/recommendations', newRecommendation);
            await axios.put(`https://b9-a11-server-plum.vercel.app/api/queries/${query._id}/increment-recommendations`);
            setRecommendations([...recommendations, newRecommendation]);
            toast.success('Recommendation added successfully!');
            setRecommendationData({
                recommendation_title: '',
                recommended_product_name: '',
                recommended_product_image: '',
                recommendation_reason: ''
            });
        } catch (error) {
            console.error('Error adding recommendation:', error);
            toast.error('Failed to add recommendation');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#6CBF40]"></div>
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='p-6 bg-white dark:bg-gray-800 text-black dark:text-white '>
            <div className='flex flex-col lg:flex-row gap-20 lg:gap-32 justify-center p-4 '>
                <img className='max-h-[564px]' src={query?.product_image} alt={query?.product_name} />
                <div className='mx-6 lg:max-w-[50%] flex flex-col gap-4'>
                    <h1 className='font-bold text-3xl'>{query?.query_title}</h1>
                    <p>Product Name: {query?.product_name}</p>
                    <p>Brand: {query?.product_brand}</p>
                    <p>Reason: {query?.boycotting_reason}</p>
                    <p>Date Posted: {new Date(query?.current_date).toLocaleString()}</p>
                    <p>Recommendations: {query?.recommendationCount}</p>
                    <hr />
                    <h2 className='font-bold text-2xl mt-4'>User Information</h2>
                    <div className='flex items-center mt-2'>
                        <img src={query?.user_image} alt={query?.user_name} className="w-12 h-12 rounded-full mr-4" />
                        <p>{query?.user_name}</p>
                    </div>
                </div>
            </div>

            <div className='border-[#FF6F61] border-2 p-4 rounded-lg'>
                <h2 className='font-bold text-2xl mt-8'>Add A Recommendation</h2>
                <form onSubmit={handleAddRecommendation} className="mt-4  p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="recommendation_title"
                            value={recommendationData.recommendation_title}
                            onChange={handleInputChange}
                            placeholder="Recommendation Title"
                            className="p-2 border rounded bg-gray-200 dark:bg-black"
                            required
                        />
                        <input
                            type="text"
                            name="recommended_product_name"
                            value={recommendationData.recommended_product_name}
                            onChange={handleInputChange}
                            placeholder="Recommended Product Name"
                            className="p-2 border rounded bg-gray-200 dark:bg-black"
                            required
                        />
                        <input
                            type="text"
                            name="recommended_product_image"
                            value={recommendationData.recommended_product_image}
                            onChange={handleInputChange}
                            placeholder="Recommended Product Image URL"
                            className="p-2 border rounded bg-gray-200 dark:bg-black"
                            required
                        />
                        <textarea
                            name="recommendation_reason"
                            value={recommendationData.recommendation_reason}
                            onChange={handleInputChange}
                            placeholder="Recommendation Reason"
                            className="p-2 border rounded bg-gray-200 dark:bg-black"
                            required
                        />
                    </div>
                    <button type="submit" className="mt-4 w-full btn bg-[#FF6F61] border-none text-white">Add Recommendation</button>
                </form>

            </div>
            <h2 className='font-bold text-2xl mt-8'>All Recommendations</h2>
            <div className="mt-4">
                {recommendations.map(rec => (
                    <div key={rec._id} className="p-4 border rounded mb-4 bg-gray-100 dark:bg-gray-700">
                        <div className="flex items-center mb-2">
                            <img src={rec.recommended_product_image} alt={rec.recommended_product_name} className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <p className="font-bold">{rec.recommendation_title}</p>
                                <p>Recommended Product: {rec.recommended_product_name}</p>
                            </div>
                        </div>
                        <p>Reason: {rec.recommendation_reason}</p>
                        {rec.recommenderInfo && (
                            <p>Submitted by: {rec.recommenderInfo.name} ({rec.recommenderInfo.email}) on {new Date(rec.current_date).toLocaleString()}</p>
                        )}
                    </div>
                ))}
            </div>

            <ToastContainer />
        </div>
    );
};

export default ViewDetail;
