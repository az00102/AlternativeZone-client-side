import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddQuery = () => {
    const { register, handleSubmit, setValue } = useForm();
    const { user } = useContext(AuthContext);

    const onSubmit = async (data) => {
        const currentDate = new Date();
        const queryObject = {
            ...data,
            user_email: user.email,
            user_name: user.displayName,
            user_image: user.photoURL,  // Ensure this field is set
            current_date: currentDate.toISOString(),
            recommendationCount: 0,
        };

        try {
            const response = await axios.post("https://b9-a11-server-plum.vercel.app/api/queries", queryObject);
            console.log(response.data);
            toast.success("Query added successfully!");
            // history.push('/my-queries'); // Uncomment this if you are using react-router for navigation
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to add query.");
        }
    };

    useEffect(() => {
        if (user) {
            setValue("user_email", user.email);
            setValue("user_name", user.displayName);
            setValue("user_image", user.photoURL); // Set this field
        }
    }, [user, setValue]);

    return (
        <section className="p-6 bg-white dark:bg-gray-800 text-black dark:text-white ">
            <Helmet>
                <title>AlternativeZone | Add Query</title>
            </Helmet>
            <form noValidate className="flex rounded-3xl border-[#FF6F61] border-2 p-3 flex-col mx-auto space-y-12" onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-white dark:bg-gray-800 text-[#FF6F61] ">
                    <div className="space-y-2 col-span-full lg:col-span-1">
                        <p className="font-medium">Add Your Query</p>
                        <p className="text-xs">Fill in the details of your product query:</p>
                    </div>
                    <div className="grid grid-cols-6 gap-4 col-span-full lg:col-span-3">
                        <div className="col-span-full sm:col-span-3">
                            <label htmlFor="product_name" className="text-sm">Product Name</label>
                            <input id="product_name" type="text" placeholder="Product Name" className="w-full p-2 rounded-md focus:ring focus:ring-opacity-75 focus:dark:ring-violet-600 dark:border-gray-300  border-2 bg-gray-300 dark:bg-gray-800" {...register("product_name")} />
                        </div>
                        <div className="col-span-full sm:col-span-3">
                            <label htmlFor="product_brand" className="text-sm">Product Brand</label>
                            <input id="product_brand" type="text" placeholder="Product Brand" className="w-full rounded-md focus:ring focus:ring-opacity-75  focus:dark:ring-violet-600 dark:border-gray-300 p-2 border-2 bg-gray-300 dark:bg-gray-800" {...register("product_brand")} />
                        </div>
                        <div className="col-span-full">
                            <label htmlFor="product_image" className="text-sm">Product Image URL</label>
                            <input id="product_image" type="url" placeholder="Product Image URL" className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:dark:ring-violet-600 dark:border-gray-300 p-2 border-2 bg-gray-300 dark:bg-gray-800" {...register("product_image")} />
                        </div>
                        <div className="col-span-full">
                            <label htmlFor="query_title" className="text-sm">Query Title</label>
                            <input id="query_title" type="text" placeholder="Query Title" className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:dark:ring-violet-600 dark:border-gray-300 border-2 p-2  bg-gray-300 dark:bg-gray-800" {...register("query_title")} />
                        </div>
                        <div className="col-span-full">
                            <label htmlFor="boycotting_reason" className="text-sm ">Boycotting Reason Details</label>
                            <textarea id="boycotting_reason" placeholder="Boycotting Reason Details" className="w-full rounded-md focus:ring focus:ring-opacity-75 focus:dark:ring-violet-600 dark:border-gray-300 bg-gray-300 dark:bg-gray-800 border-2 p-2" {...register("boycotting_reason")} />
                        </div>
                        <div className="col-span-full sm:col-span-3">
                            <label htmlFor="user_email" className="text-sm">User Email</label>
                            <input id="user_email" type="email" placeholder="User Email" className="w-full rounded-md focus:ring focus:ring-opacity-75  focus:dark:ring-violet-600 dark:border-gray-300 p-2 border-2 text-white bg-gray-300 dark:bg-gray-800" {...register("user_email")} disabled />
                        </div>
                        <div className="col-span-full sm:col-span-3">
                            <label htmlFor="user_name" className="text-sm">User Name</label>
                            <input id="user_name" type="text" placeholder="User Name" className="w-full rounded-md focus:ring focus:ring-opacity-75  focus:dark:ring-violet-600 dark:border-gray-300 p-2 border-2 text-white bg-gray-300 dark:bg-gray-800" {...register("user_name")} disabled />
                        </div>
                        <div className="col-span-full sm:col-span-3">
                            <label htmlFor="user_image" className="text-sm">User Image URL</label>
                            <input id="user_image" type="text" placeholder="User Image URL" className="w-full rounded-md focus:ring focus:ring-opacity-75  focus:dark:ring-violet-600 dark:border-gray-300 border-2 p-2 text-white bg-gray-300 dark:bg-gray-800" {...register("user_image")} disabled />
                        </div>
                    </div>
                </fieldset>
                <button type="submit" className="px-4 py-2 bg-[#FF6F61] text-white rounded-md hover:bg-red-600">Add Query</button>
            </form>
            <ToastContainer />
        </section>
    );
};

export default AddQuery;
