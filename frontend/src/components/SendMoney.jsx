import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function SendMoney() {
    const [amount, setAmount] = useState("");
    const [friend, setFriend] = useState("");
    const [token, setToken] = useState("");
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.username)
            setFriend(location.state.username);
        console.log("send money props:", location.state.username);

        const storedToken = localStorage.getItem("token");
        if (storedToken) setToken(storedToken);
    }, []);

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        console.log("handle Change", name, value);
        setAmount(value);
    }

    async function initiateTransfer(e) {
        e.preventDefault();
        console.log("handleSubmit clicked");
        const resp = await axios.post(
            "http://localhost:4000/api/v1/account/transfer",
            {
                to: friend,
                amount: Number(amount),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                validateStatus: () => true,
            }
        );
        if (resp.status === 200) {
            alert(resp.data.message);
            navigate("/dashboard");
        } else alert(resp.data.message);
    }

    return (
        <>
            <div className="bg-pay-gray-bg min-h-screen p-14 flex justify-center items-center">
                <div className="flex flex-col bg-white w-96 rounded-lg h-full shadow-md">
                    <div className="flex justify-center font-bold text-3xl p-5 pb-3 ">
                        Send Money
                    </div>
                    <div className="flex justify-start items-center gap-4 m-8 mb-1">
                        <div className="flex items-center justify-center font-basic rounded-full w-12 h-12 bg-green-500 text-white text-3xl">
                            U
                        </div>
                        <div className="font-bold text-2xl">{friend}</div>
                    </div>
                    <div className="ml-8 font-medium">Amount (in ₹)</div>
                    <div id="form" className="mx-8">
                        <div className=" mt-2">
                            <label className="flex flex-col">
                                <input
                                    className="border-gray-200 border border-1 p-2 rounded-md text-md tracking-tight text-gray-500 font-basic"
                                    type="text"
                                    name="email"
                                    placeholder="Enter amount"
                                    onChange={handleChange}
                                    value={amount}
                                />
                            </label>
                        </div>
                        <div className="pt-4 pb-8">
                            <button
                                type="submit"
                                className="bg-green-500 text-white p-2 w-full rounded-md font-medium"
                                onClick={initiateTransfer}
                            >
                                Initiate Transfer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default SendMoney;
