"use client";
import { useEffect } from "react";
import StudentDashboard from "./dashboard/page";
import { useAppSelector } from "@/app/redux/features/hooks";
import { selectCurrentUser, TUser } from "@/app/redux/api/auth/authSlice";
import { useRouter } from "next/navigation";

const Student = () => {
  const router = useRouter();

  const user = useAppSelector(selectCurrentUser) as TUser;
  useEffect(() => {
    if (user.role !== "student") {
      router.push("/unauthorized");
    }
  }, [user]);

  return (
    <>
      <StudentDashboard />
    </>
  );
};
export default Student;
