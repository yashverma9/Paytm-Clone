import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import SendMoney from "./components/SendMoney";
import Dashboard from "./components/Dashboard";
import Signin from "./components/Signin";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sendmoney" element={<SendMoney />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
