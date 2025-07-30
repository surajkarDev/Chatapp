import Link from "next/link";
import { Counter } from "@/app/Counter";
import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store/page";
import { callLoginUser } from "@/app/redux/features/page";
import { useRouter } from "next/navigation";

const SESSION_TIMEOUT = 1 * 60 * 1000; // 1 minute for demo

export default function Navbar() {
  const counterData = useContext(Counter);
  const inlineStatus = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const userStatusRedux = useDispatch<AppDispatch>();

  const logoutUser = async () => {
    if (inlineStatus.id !== 0) {
      try {
        const response = await fetch(`http://localhost:3001/users/${inlineStatus.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ onlineStatus: false })
        });
        if (response.ok) {
          const checkresponse = await response.json();
          localStorage.setItem('currentUserToChat', '0');
          userStatusRedux(callLoginUser(checkresponse));
          localStorage.setItem('user', '');
          
          router.push('/');
        }
      } catch (error) {
        console.log("Failed To Logout", error);
      }
    }
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-3 shadow-md rounded-b-lg">
      {/* Brand and Links */}
      <div className="flex items-center gap-6">
        <span className="text-xl font-bold text-blue-700 tracking-wide">MyChatApp</span>
        {!inlineStatus.onlineStatus && (
        <Link href="/" className="hover:text-blue-600 transition-colors font-medium">
          Home
        </Link>
        )}
        <Link href="/about" className="hover:text-blue-600 transition-colors font-medium">
          About
        </Link>
        <Link href="/contact" className="hover:text-blue-600 transition-colors font-medium">
          Contact
        </Link>
        {inlineStatus.onlineStatus && (
          <Link href="/chatApp" className="hover:text-blue-600 transition-colors font-medium">
            Chat App
          </Link>
        )}
      </div>
      {/* Status and Logout */}
      <div className="flex items-center gap-4">
        {/* User status indicator */}
        {inlineStatus.onlineStatus ? (
          <span className="flex items-center gap-1 text-green-600 font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
            Online
          </span>
        ) : (
          <span className="flex items-center gap-1 text-gray-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span>
            Offline
          </span>
        )}
        {/* Logout button */}
        {(inlineStatus.id !== 0 && inlineStatus.onlineStatus) && (
          <button
            onClick={logoutUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}