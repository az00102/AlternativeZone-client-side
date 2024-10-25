import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";

const Register = () => {
    const { createUser } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const onSubmit = async (data) => {
        const { email, password, name, photoURL } = data;

        try {
            // Password verification
            if (!/(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password)) {
                throw new Error("Password must contain at least 6 characters including at least one uppercase and one lowercase letter.");
            }

            const user = await createUser(email, password, name, photoURL);
            console.log("User registered: ", user);
            // Redirect to login page after successful registration
            toast.success("Registration successful! Redirecting to login page...");
            navigate("/");
        } catch (error) {
            console.error("Error in user registration: ", error);
            toast.error(error.message || "An error occurred during registration.");
        }
    };

    return (
        <div className="w-full flex justify-center py-10 bg-white dark:bg-slate-900">
            <Helmet>
                <title>AlternativeZone | Register</title>
            </Helmet>
            <ToastContainer />
            <div className="w-full max-w-md p-4 rounded-md shadow sm:p-8 bg-gray-50 text-gray-800 border-2 border-[#FF6F61] dark:bg-black dark:text-white">
                <h2 className="mb-3 text-3xl font-semibold text-center">Create your account</h2>
                <p className="text-sm text-center dark:text-gray-600">Already have an account?
                    <Link to={`/login`} rel="noopener noreferrer" className="ml-2 underline text-[#FF6F61] font-bold">Sign in here</Link>
                </p>

                <div className="flex items-center w-full my-4">
                    <hr className="w-full dark:text-gray-600" />
                    <p className="px-3 dark:text-gray-600">OR</p>
                    <hr className="w-full dark:text-gray-600" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm">Name</label>
                            <input
                                type="text"
                                {...register("name", { required: true })}
                                id="name"
                                placeholder="John Doe"
                                className={`w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800 ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && <p className="text-sm text-red-500">Name is required</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm">Email address</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                id="email"
                                placeholder="leroy@jenkins.com"
                                className={`w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800 ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <p className="text-sm text-red-500">Email is required</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="photoURL" className="block text-sm">Photo URL</label>
                            <input
                                type="text"
                                {...register("photoURL")}
                                id="photoURL"
                                placeholder="https://example.com/photo.jpg"
                                className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {
                                        required: true,
                                    })}
                                    id="password"
                                    placeholder="*****"
                                    className={`w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800 focus:dark:border-violet-600 ${errors.password ? 'border-red-500' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <img src="/show.png" alt="" />
                                    ) : (
                                        <img src="/eye.png" alt="" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="w-full px-8 py-3 font-semibold rounded-md bg-[#FF6F61] text-gray-50">Register</button>
                </form>
            </div>

        </div>
    );
};

export default Register;
