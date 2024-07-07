import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signin() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        console.log("handleSubmit clicked");
        const resp = await axios.post(
            "http://localhost:4000/api/v1/user/signin",
            {
                username: formData.email,
                password: formData.password,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                validateStatus: () => true,
            }
        );
        console.log("resp:", resp);
        if (resp.status === 200) {
            localStorage.setItem("token", resp.data.token);
            navigate("/dashboard");
        } else alert(resp.data);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        console.log("handle Change", name, value);
        setFormData({ ...formData, [name]: value });
    }

    console.log("formData:", formData);

    return (
        <>
            <div className="bg-bd-gray min-h-screen p-14 flex justify-center items-center">
                <div className="flex flex-col bg-white w-96 rounded-lg h-full">
                    <div className="flex justify-center font-bold text-3xl p-5 pb-3 ">
                        Sign In
                    </div>
                    <div className="text-gray-400 font-medium px-8 text-l text-center">
                        Enter your credentials to access your acount
                    </div>
                    <div id="form" className="p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="p-1 mt-2">
                                <label className="flex flex-col">
                                    <div className="font-medium pb-2">
                                        Email
                                    </div>
                                    <input
                                        className="border-gray-300 border border-1 p-2 rounded-md"
                                        type="text"
                                        name="email"
                                        onChange={handleChange}
                                        value={formData.email}
                                    />
                                </label>
                            </div>
                            <div className="p-1 mt-2">
                                <label className="flex flex-col">
                                    <div className="font-medium pb-2">
                                        Password
                                    </div>
                                    <input
                                        className="border-gray-300 border border-1 p-2 rounded-md"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="bg-black text-white p-2 w-full rounded-md font-medium"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="flex justify-center pb-6 font-medium">
                        Don't have an account? Sign Up
                    </div>
                </div>
            </div>
        </>
    );
}
export default Signin;
