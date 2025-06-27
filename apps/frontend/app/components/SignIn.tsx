/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useLoginMutation } from "../redux/api/auth/authApi";
import { useResendVerificationCodeMutation } from "../redux/api/auth/resendVerificationCodeApi";
import { useAppDispatch } from "../redux/features/hooks";
import { TUser, setUser } from "../redux/api/auth/authSlice";
import { verifyToken } from "../lib/utils/verifyToken";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}
type ValidationError = {
  path: string;
  message: string;
};

const SignIn = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [resendVerificationCode, { isLoading: resendLoading }] =
    useResendVerificationCodeMutation();
  const [error, setError] = useState<ValidationError[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");


   useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.replace("/");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const userInfo = {
        email: data?.email,
        password: data?.password,
      };
      const res = await login(userInfo).unwrap();
      const user = verifyToken(res?.data?.accessToken) as TUser;
      dispatch(setUser({ user: user, token: res?.data?.accessToken }));
      Cookies.set("role", user?.role);
      Cookies.set("token", res?.data?.accessToken);

      

      if (redirect) {
        router.push(redirect);
      }
      else if (user?.role === "student") {
        router.push("/student");
      } 
      else if (user?.role === "teacher") {
        router.push("/teacher/dashboard");
      } 
      else if (user?.role === "admin") {
        router.push("/admin/dashboard");
      } 
      else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.data?.errorSources);
    }
  };

  const handleResendVerification = async () => {
    const email = getValues("email");

    try {
      const res = await resendVerificationCode({ email }).unwrap();
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: res?.message,
          showConfirmButton: false,
          timer: 1000,
        });
        router.push("/reset-user-verify");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const passwordErrors = error?.find((error) => error?.path === "forbidden");
  const emailError = error?.find((error) => error?.path === "not_found");

  return (
    <section>
      <div>
        <div className="sticky top-0 section-wrapper background-shadow-gradient overflow-hidden">
          {/* background decoration */}
          <div
            style={
              {
                "--initial-left": "-10%",
                "--left": "10%",
                "--height": "90vh",
              } as React.CSSProperties
            }
            className="absolute -left-[10%] -top-[10%] h-0 w-4 bg-secondary/40 rotate-[315deg] blur-3xl animate-smallToBig"
          />
          <div
            style={
              {
                "--initial-left": "95%",
                "--left": "87.5%",
                "--height": "90vh",
              } as React.CSSProperties
            }
            className="absolute left-1/4 -top-1/4 h-0 w-4 bg-secondary/40 rotate-[45deg] blur-3xl animate-smallToBig"
          />

          <div className="grid grid-cols-1 justify-items-center gap-6">
            <div className="bg-gradient-to-b from-[#101010]/10 py-5 lg:py-10 px-5 lg:px-12 to-[#101010]/0 rounded-3xl">
              {/* /\\\\heading */}
              <div className="flex items-center gap-6 mb-3 pb-3 border-b border-secondary/10">
               

                <div className="flex flex-col justify-center gap-3">
                  <h2 className="text-4xl font-black text-secondary">
                    Sign In
                  </h2>
                  <p className="text-2xl lg:text-base text-secondary/70">
                    Enter your email and phone number to Sign Number{" "}
                  </p>
                </div>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full"
              >
                {/* Email */}
                <div className="flex flex-col gap-2 w-full relative">
                  <label className="text-secondary/80" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email format",
                      },
                    })}
                    placeholder="Enter your email"
                    className={`bg-secondary/10 rounded-xl text-base py-4 px-6 text-secondary/80 w-full border ${
                      errors.email || emailError
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                  />

                  <div className="flex justify-between items-center">
                    {emailError && (
                      <p className="text-red-400 text-[18px] font-normal">
                        {emailError?.message}
                      </p>
                    )}

                    {emailError?.message === "You are not verified!" && (
                      <button
                        className="text-primary"
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendLoading}
                      >
                        {resendLoading ? "Sending..." : "Resend Code"}
                      </button>
                    )}
                  </div>

                  {errors.email && (
                    <span className="text-red-500 absolute top-0 right-0">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2 w-full relative">
                  <label className="text-secondary/80" htmlFor="password">
                    Password
                  </label>
                  <input
                    className={`bg-secondary/10 rounded-xl text-base py-4 px-6 text-secondary/80 w-full border ${
                      errors.password || passwordErrors
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                    })}
                  />
                  {errors.password && (
                    <span className="text-red-500 absolute top-0 right-0">
                      {errors.password.message}
                    </span>
                  )}

                  {passwordErrors && (
                    <p className="text-red-400 text-[18px] font-normal">
                      {passwordErrors?.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Link href={"/forget-password"}>Forgot Password</Link>
                </div>
                <button type="submit" className="auth-form-btn">
                  {isLoading ? "Loading.." : " Sign In"}
                </button>
               
               
                <p className="text-secondary/50 text-center text-base font-semibold">
                  Do not have an account?
                  <Link
                    href="/signup"
                    className="text-primary-white font-bold pl-1"
                  >
                    Sign Up
                  </Link>
                </p>
              </form>
            </div>
          </div>

       
        </div>
      </div>
    </section>
  );
};

export default SignIn;
