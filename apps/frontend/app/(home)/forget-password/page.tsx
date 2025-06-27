/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgetPasswordMutation } from "@/app/redux/api/auth/forgotpasswordApi";


interface FormValues {
  email: string;
}
type ValidationError = {
  path: string;
  message: string;
};


const ForgetPassword = () => {
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const [error, setError] = useState<ValidationError[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async(data) => {
    

    try {
      const res = await forgetPassword({ email: data.email }).unwrap();
      console.log(res)
      if (res?.success) {
        Swal.fire({
          
          icon: "success",
          title: res?.message,
          showConfirmButton: false,
          timer: 2000,
        });
        router.push('/verify-code');
      }
      localStorage.setItem("email", data.email);
    } catch (err) {
      console.log(err)
      setError((err as any)?.data?.errorSources);
    }
    
  };
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
                  Forgot password
                  </h2>
                  <p className="text-sm lg:text-base text-secondary/70">
                  We will send 6 digit code to your email
                  </p>
                </div>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full"
              >
                {/* Email */}
                <div className="flex flex-col gap-2 w-full relative">
                  <label
                  className="text-secondary/80"
                    htmlFor="email"
                  >
                    
                 Enter Your Email
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
                  {errors.email && (
                    <span className="text-red-500 absolute top-0 right-0">{errors.email.message}</span>
                  )}

                 {emailError && (
                  <p className="text-red-500">
                    {emailError?.message}
                  </p>
                )}
                </div>

             
                <button type="submit" className="auth-form-btn">
                    {isLoading ?"Loading..":"Send Code"}
                </button>
                
               
               
              </form>
            </div>
          </div>

         
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
