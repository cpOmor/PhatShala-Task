"use client";
import Image from "next/image";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useSetNewPasswordMutation } from "@/app/redux/api/auth/setnewpasswordApi";

interface FormValues {
  password: string;
  confirmPassword: string;
}
const NewPassword = () => {
  const [setNewPassword, { isLoading }] = useSetNewPasswordMutation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // console.log("Form Submitted:", data);
    const { password } = data;
    //  console.log(password)

    try {
      const res = await setNewPassword({ password }).unwrap();
      //  console.log(res)
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: res?.message,
          showConfirmButton: false,
          timer: 3000,
        });
        router.push("/signin");
      }
    } catch (err) {
      // console.log(err)
      const error = err as { data: { message: string } };

      Swal.fire({
        icon: "error",
        title: error?.data?.message,
      });
    }
  };
  const passwordValue = watch("password");

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
                    Set new password
                  </h2>
                  <p className="text-sm lg:text-base text-secondary/70">
                    Create a new password. Different from the <br /> previous
                    password for security
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full"
              >
                {/* Password */}
                <div className="flex flex-col gap-2 w-full relative">
                  <label className="text-secondary/80" htmlFor="password">
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

                {/* Confirm Password */}
                <div className="flex flex-col gap-2 w-full relative">
                  <label
                    className="text-secondary/80"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <input
                    className={`bg-secondary/10 rounded-xl text-base py-4 px-6 text-secondary/80 w-full border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-transparent"
                    }`}
                    type="password"
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === passwordValue || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-500 absolute top-0 right-0">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>

                <button type="submit" className="auth-form-btn">
                  {isLoading ? "Loading..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewPassword;
