import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Helmet } from "react-helmet-async";
import axios from "axios";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Link } from "react-router-dom";
import { Bounce, Fade } from "react-awesome-reveal";

const Home = () => {
    const [recentQueries, setRecentQueries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            fetchRecentQueries();
        }, 1000);
    }, []);

    const fetchRecentQueries = async () => {
        try {
            const response = await axios.get('https://b9-a11-server-plum.vercel.app/api/recent-queries');
            setRecentQueries(response.data);
        } catch (error) {
            console.error('Error fetching recent queries:', error);
        } finally {
            setLoading(false);
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
        <div className="">
            <Helmet>
                <title>AlternativeZone | Home</title>
            </Helmet>
            {/* Banner Section */}
            <section>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[Pagination, Navigation, Autoplay]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <div className="hero min-h-screen bg-[url('/carsl1.jpeg')]">
                            <div className="hero-overlay bg-opacity-80"></div>
                            <div className="hero-content text-center text-neutral-content">
                                <div className="max-w-md">
                                    <Bounce triggerOnce>
                                        <h1 className="text-4xl font-bold leading-none sm:text-5xl text-[#FF6F61]">Welcome to AlternativeZone!</h1>
                                        <p className="px-8 mt-8 mb-12 text-lg text-[#FF6F61]">Discover the best alternative products easily.</p>
                                    </Bounce>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="hero min-h-screen bg-[url('/carsl2.jpeg')]">
                            <div className="hero-overlay bg-opacity-80"></div>
                            <div className="hero-content text-center text-neutral-content">
                                <div className="max-w-lg">
                                    <Bounce triggerOnce>
                                        <h1 className="text-4xl font-bold leading-none sm:text-5xl text-[#FF6F61]">Join our community!</h1>
                                        <p className="px-8 mt-8 mb-12 text-lg text-[#FF6F61]">Share your product experiences and recommendations.</p>
                                    </Bounce>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="hero min-h-screen bg-[url('/carsl3.jpeg')]">
                            <div className="hero-overlay bg-opacity-80"></div>
                            <div className="hero-content text-center text-neutral-content">
                                <div className="max-w-md">
                                    <Bounce triggerOnce>
                                        <h1 className="text-4xl font-bold leading-none sm:text-5xl text-[#FF6F61]">Get reliable product recommendations from real users.</h1>
                                    </Bounce>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>

                <div className="p-6 py-12 dark:bg-[#FF6F61] dark:text-gray-50">
                    <div className="container mx-auto">
                        <div className="flex flex-col lg:flex-row items-center justify-between">
                            <h2 className="text-center text-6xl tracking-tighter font-bold">Best Product Alternatives!</h2>
                            <div className="space-x-2 text-center py-2 lg:py-0">
                                <span>Find the perfect alternatives tailored to your needs.</span>
                            </div>
                            <Link to="/queries" className="btn border-none bg-gray-900 text-white">Explore Queries</Link>
                        </div>
                    </div>
                </div>
            </section>
            <Fade duration={2000}>
                {/* Recent Queries Section */}
                <section className="bg-white dark:bg-gray-800 text-black dark:text-white">
                    <div className="container mx-auto p-4">
                        <h2 className="text-3xl font-bold mb-2 text-center">Recent Queries</h2>
                        <p className="text-center mb-10">Check out the latest queries submitted by our users.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentQueries
                                .sort((a, b) => new Date(b.current_date) - new Date(a.current_date))
                                .slice(0, 6)
                                .map(query => (
                                    <div key={query._id} className="shadow-xl border-solid border-2 border-[#FF6F61]">
                                        <div className="bg-white dark:bg-gray-800 text-black dark:text-white">
                                            <img src={query.product_image} alt={query.product_name} className="w-full h-1/2 object-cover mb-4" />
                                            <div className="p-4">
                                                <h2 className="card-title text-xl font-bold mb-2">{query.query_title}</h2>
                                                <p>Product Name: {query.product_name}</p>
                                                <p>Brand: {query.product_brand}</p>
                                                <p>Reason: {query.boycotting_reason}</p>
                                                <p>Submitted: {new Date(query.current_date).toLocaleString()}</p>
                                                <div className="flex items-center mt-4">
                                                    <img src={query.user_image} alt={query.user_name} className="w-8 h-8 rounded-full mr-2" />
                                                    <p>{query.user_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>

                {/* Featured Categories Section */}
                <section className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white py-12">
                    <div className="container mx-auto p-4">
                        <h2 className="text-3xl font-bold mb-2 text-center">Featured Categories</h2>
                        <p className="text-center mb-10">Explore our top product categories.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-2 border-[#FF6F61]">
                                <h3 className="text-lg font-semibold mb-2">Electronics</h3>
                                <p>Find the best alternatives for your electronic needs.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-2 border-[#FF6F61]">
                                <h3 className="text-lg font-semibold mb-2">Home Appliances</h3>
                                <p>Explore top-rated home appliances that fit your budget.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-2 border-[#FF6F61]">
                                <h3 className="text-lg font-semibold mb-2">Fashion</h3>
                                <p>Discover trendy and sustainable fashion alternatives.</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-2 border-[#FF6F61]">
                                <h3 className="text-lg font-semibold mb-2">Health & Beauty</h3>
                                <p>Find the best health and beauty products recommended by users.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* User Testimonials Section */}
                <section className="bg-white dark:bg-gray-800 text-black dark:text-white py-12">
                    <div className="container mx-auto p-4">
                        <h2 className="text-3xl font-bold mb-2 text-center">What Our Users Say</h2>
                        <p className="text-center mb-10">Read the testimonials from our satisfied users.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-md border-2 border-[#FF6F61]">
                                <p>"AlternativeZone helped me find the best alternatives for my tech gadgets. Highly recommend!"</p>
                                <div className="flex items-center mt-4">
                                    <img src="/john doe.webp" alt="User 1" className="w-8 h-8 rounded-full mr-2" />
                                    <p>John Doe</p>
                                </div>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-md border-2 border-[#FF6F61]">
                                <p>"I love the variety of products recommended on this platform. Great community!"</p>
                                <div className="flex items-center mt-4">
                                    <img src="/jane simth.webp" alt="User 2" className="w-8 h-8 rounded-full mr-2" />
                                    <p>Jane Smith</p>
                                </div>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-md border-2 border-[#FF6F61]">
                                <p>"The best place to find alternative products that are eco-friendly and affordable."</p>
                                <div className="flex items-center mt-4">
                                    <img src="/jane lee.webp" alt="User 3" className="w-8 h-8 rounded-full mr-2" />
                                    <p>Michael Lee</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Fade>
        </div>
    );
};

export default Home;
