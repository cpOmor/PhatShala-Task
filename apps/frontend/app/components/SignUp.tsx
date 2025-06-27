/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useRegistationMutation } from "../redux/api/auth/registerApi";
import { useAppSelector } from "../redux/features/hooks";
import { selectCurrentUser } from "../redux/api/auth/authSlice";

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

const SignUp = () => {
  const user = useAppSelector(selectCurrentUser)
   useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user]);
  const [registation, { isLoading }] = useRegistationMutation();
  const [error, setError] = useState<ValidationError[]>([]);
  const router = useRouter();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async(data) => {
    // console.log(data)
     try {
      const res = await registation(data).unwrap();
      // console.log(res)
      if (res?.success) {
        // Store the email in localStorage
        localStorage.setItem('usesjhdtevdfsdswrEmailskjstshxcsewsd', data?.email);
        Swal.fire({
          
          icon: "success",
          title: res?.message,
          showConfirmButton: false,
          timer: 1000,
        });
        router.push('/verify-account');
      }
      // console.log(res)
    } catch (err) {
      console.log(err)
      setError((err as any)?.data?.errorSources);
    }
  };
  const emailError = error?.find((error) => error?.path === "not_found");


  return (
    <section>
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
        <div className="grid grid-cols-1 justify-items-center gap-6 z-50">
          <div className="bg-gradient-to-b from-[#101010]/10 py-10 px-12 to-[#101010]/0 rounded-3xl">
            {/* /\\\\heading */}
            <div className="flex items-center gap-6 mb-3 pb-3 border-b border-secondary/10">
         

              <div className="flex flex-col justify-center gap-3">
                <h2 className="text-4xl font-black text-secondary">Sign Up</h2>
                <p className="text-base text-secondary/70">
                  Enter your email and phone number to sign up{" "}
                </p>
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w-full"
            >
              {/* Name Fields */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* First Name */}
                <div className="flex flex-col gap-2 w-full relative">
                  <label
                    className={`${
                      errors.firstName ? "text-red-500" : "text-secondary/80"
                    }`}
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register("firstName", {
                      required: "First Name is required",
                    })}
                    placeholder="Enter your first name"
                    className={`bg-secondary/10 rounded-xl text-base py-4 px-6 text-secondary/80 w-full border ${
                      errors.firstName ? "border-red-500" : "border-transparent"
                    }`}
                  />
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-2 w-full relative">
                  <label
                    className={`${
                      errors.lastName ? "text-red-500" : "text-secondary/80"
                    }`}
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register("lastName", {
                      required: "Last Name is required",
                    })}
                    placeholder="Enter your last name"
                    className={`bg-secondary/10 rounded-xl text-base py-4 px-6 text-secondary/80 w-full border ${
                      errors.lastName ? "border-red-500" : "border-transparent"
                    }`}
                  />
                </div>
              </div>

              {/* Email & Phone Fields */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Email */}
                <div className="flex flex-col gap-2 w-full relative">
                  <label
                    className={`${
                      errors.email ? "text-red-500" : "text-secondary/80"
                    }`}
                    htmlFor="email"
                  >
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
                      errors.email || emailError ? "border-red-500" : "border-transparent"
                    }`}
                  />
                       {/* backend error */}
                      {emailError && (
                      <p className="text-red-400 text-[18px]  font-normal">
                        {emailError?.message}
                      </p>
                    )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2 w-full relative">
                  <label
                    className={`${
                      errors.phone ? "text-red-500" : "text-secondary/80"
                    }`}
                    htmlFor="phone"
                  >
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Mobile number is required",
                    })}
                    placeholder="Enter your mobile number"
                    className={`bg-secondary/10 rounded-xl text-base py-4 px-6 text-secondary/80 w-full border ${
                      errors.phone ? "border-red-500" : "border-transparent"
                    }`}
                  />
                </div>
              </div>
              {/* Password */}
              <div className="flex flex-col gap-2 w-full relative">
                <label
                  className={`${
                    errors.password ? "text-red-500" : "text-secondary/80"
                  }`}
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className={`bg-secondary/10 rounded-xl text-base py-4 px-6 text-secondary/80 w-full border ${
                    errors.password ? "border-red-500" : "border-transparent"
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
              </div>
              <button type="submit" className="auth-form-btn">
                 {isLoading ? "Loading...":"Sign Up"}
              </button>
              <p className="text-center text-base font-bold">Or Sign Up With</p>
             
              <p className="text-secondary/50 text-center text-base font-semibold">
                Already have an account?{" "}
                <Link href="/signin" className="text-primary-white font-bold">
                  Sign In 
                </Link>
              </p>
            </form>
          </div>
        </div>

      
      </div>
    </section>
  );
};

export default SignUp;
