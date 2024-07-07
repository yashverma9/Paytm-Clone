import { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [token, setToken] = useState("");
    const [balance, setBalance] = useState("");
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        async function fetchBalance() {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                const resp = await axios.get(
                    "http://localhost:4000/api/v1/account/balance",
                    { headers: { Authorization: `Bearer ${storedToken}` } }
                );
                console.log("resp.data.balance:", resp.data.balance);
                if (resp.data.balance) setBalance(resp.data.balance);
            }
        }
        fetchBalance();
    }, []);

    useEffect(() => {
        async function fetchUsers() {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                const resp = await axios.get(
                    `http://localhost:4000/api/v1/user/bulk?filter=${filter}`,
                    { headers: { Authorization: `Bearer ${storedToken}` } }
                );
                console.log("resp.data:", resp.data);
                if (resp.data.users) setUsers(resp.data.users);
            }
        }
        fetchUsers();
    }, [filter]);

    function onFilter(e) {
        const filterVal = e.target.value;
        setFilter(filterVal);
    }

    const navigate = useNavigate();

    function handleSendMoney(e) {
        const { name } = e.target;
        navigate("/sendmoney", { state: { username: name } });
    }

    return (
        <>
            {token ? (
                <div>
                    <Header token={token} />
                    <div className="p-6">
                        <div className="text-xl font-medium tracking-tight flex">
                            Your Balance is
                            <p className="pl-2 font-bold">₹ {balance}</p>
                        </div>
                        <div className="text-xl font-bold tracking-tight mt-4">
                            Users
                        </div>
                        <div className="mt-4">
                            <label className="">
                                <input
                                    className="border border-gray-200 rounded-md w-full text-sm p-2 font-medium"
                                    name="search"
                                    type="text"
                                    placeholder="Search users..."
                                    onChange={onFilter}
                                />
                            </label>
                        </div>
                        <div className="mt-8">
                            {users.map((user, index) => (
                                <div
                                    className={
                                        index === 0
                                            ? "flex items-center"
                                            : "flex items-center mt-4"
                                    }
                                >
                                    <div className="flex gap-4 items-center">
                                        <div className=" flex items-center justify-center font-medium rounded-full w-9 h-9 bg-gray-200 ">
                                            U1
                                        </div>
                                        <div className="font-bold text-xl tracking-tight">
                                            {user.firstName}
                                        </div>
                                    </div>
                                    <div className=" grow  flex items-center justify-end">
                                        <button
                                            name={user.username}
                                            onClick={handleSendMoney}
                                            className="bg-black p-2 px-4 rounded-md text-white text-sm font-medium"
                                        >
                                            Send Money
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Not logged in yet, please sign up or login</p>
            )}
        </>
    );
}
export default Dashboard;
