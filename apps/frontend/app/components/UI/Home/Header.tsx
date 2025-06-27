"use client";

import { useLogoutUserMutation } from "@/app/redux/api/auth/authApi";
import { logout, selectCurrentUser } from "@/app/redux/api/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/features/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
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
           Paatshala
          </h1>
        </div>

        


         {user ? (
       

        <div
          className="bg-secondary/5 active:bg-primary/5 text-secondary px-6 py-3 text-lg font-semibold capitalize"
         
        >
         {user && <Link href={`/${user?.role}/dashboard`}>Dashboard</Link>}
        </div>
     
      ) : (
        <Link href={"/signin"}>
         <div
             className="px-5 py-3 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300" 
            >
              <span className="">Signin</span>
            </div>
        </Link>

       
      )}
      </div>
    </div>
  );
};

export default Header;
