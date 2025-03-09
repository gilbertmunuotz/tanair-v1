/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../assets/authSlice";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/AuthSlice";
import { LoginUserInfo } from "../interfaces/interface";


export default function Login() {

    // State Hook Form
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // Destructure rtk Hook
    const [userLogin, { isLoading }] = useLoginMutation();

    // Destructure React Dom Hook
    const navigate = useNavigate();

    // Destructure Redux Hook
    const dispatch = useDispatch();

    // Handle Submit Logic
    async function HandleSubmit(event: React.FormEvent) {

        event.preventDefault();

        const userData: LoginUserInfo = { email, password };

        try {
            const user = await userLogin(userData).unwrap();
            dispatch(login(user));
            setEmail("");
            setPassword("");
            toast.success("Logged In Succesfully");

            // Handling Redirects based on the user's role
            if (user.role === "admin") {
                navigate("/admin");
            } else if (user.role === "user") {
                navigate("/user");
            } else {
                navigate("/"); // Default route if role is undefined or unknown
            }
        } catch (error: any) {
            console.error("Error During Logging In", error);
            if (error?.data.message) {
                toast.error(error.data.message);
            } else if (error) {
                toast.error("Error, During Sign In.!");
            } else {
                toast.error("Sorry, an error occurred.")
            }
        }

    }


    return (
        <div>
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg">
                    <h1 className="text-3xl font-bold text-center mb-6">Welcome Back.</h1>

                    <form className="space-y-5" onSubmit={HandleSubmit}>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                required
                                type="text"
                                value={email}
                                placeholder="E.g johnson@gmail.com"
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                required
                                id="password"
                                name="password"
                                value={password}
                                placeholder="E.g john@4545."
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                required
                                id="remember"
                                name="remember"
                                type="checkbox"
                                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                            />
                            <h1 className="ml-2">Remember Me</h1>
                        </div>


                        {isLoading ?
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                Signing In....
                            </button>
                            :
                            <button type="submit" className="w-full px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">Sign In </button>
                        }

                        {/* <div className="flex justify-between">
                            <h2 className='ml-2'>Don't have an account?<Link to={"/register"} className='text-sky-600'> Register</Link></h2>
                            <h3 className="ml-2"><Link to={"/forgot-password"} className='text-sky-600'> forgot Password</Link></h3> 
                        </div> */}

                    </form>

                </div>
            </div>
        </div>
    )
}