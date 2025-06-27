"use client";

import { useLogoutUserMutation } from "@/app/redux/api/auth/authApi";
import { logout, selectCurrentUser } from "@/app/redux/api/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/features/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";

const StudentHeader = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [logoutUser] = useLogoutUserMutation();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser("");
      dispatch(logout());

      Object.keys(localStorage).forEach((key) => {
        if (key === "isDataVisible" || key === "persist:auth") {
          localStorage.removeItem(key);
        }
      });

      sessionStorage.clear();
      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.split("=");
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      });

      window.location.href = "/signin";
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    router.back();
  };
  return (
    <div className="container mx-auto mt-5 pb-10 mb-10 border-b-[1px] border-white">
      <div className="flex justify-between ">
        <div className="flex items-center gap-6">
         
              <h1 className="text-3xl font-bold">
            Welcome <span className="text-primary">{user?.firstName} </span>
            to 
            <span className="capitalize text-primary font-bold">
              
             { " "}{user?.role }
            </span> Dashboard
          </h1>
        </div>
        <div className="flex gap-6">
          <Link href="/"
            className="px-5 py-3 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            Home
          </Link>
          <Link href={`/${user?.role}/profile`}
            className="px-5 py-3 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            Profile
          </Link>
          
          <button
            onClick={handleLogout}
            className="px-5 py-3 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;
