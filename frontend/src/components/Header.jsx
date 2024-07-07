import { jwtDecode } from "jwt-decode";

function Header({ token }) {
    const decoded = jwtDecode(token);
    console.log("decoded:", decoded);
    return (
        <div className="flex w-full p-4 border-b">
            <div className="font-bold text-2xl tracking-tight">
                Payments App
            </div>
            <div className="grow flex justify-end gap-4 items-center">
                <div className="font-medium">Hello, User</div>
                <div className="flex items-center justify-center font-medium rounded-full w-9 h-9 bg-gray-200 ">
                    U
                </div>
            </div>
        </div>
    );
}

export default Header;
