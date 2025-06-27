/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */

"use client";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { ChangeEvent, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useResendVerificationCodeMutation } from "@/app/redux/api/auth/resendVerificationCodeApi";
import { useVerifyAccountMutation } from "@/app/redux/api/auth/verifyAccount";

interface FormValues {
  codes: string[];
}

type ValidationError = {
  path: string;
  message: string;
};

const verifyAccount = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [error, setError] = useState<ValidationError[]>([]);
  const router = useRouter();
  const [resendVerificationCode, { isLoading: resendLoading }] =
    useResendVerificationCodeMutation();
  const handleInputChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newCode = [...code];

      if (/^[0-9]$/.test(value) || value === "") {
        newCode[index] = value;
        setCode(newCode);
        setValue(`codes.${index}`, value);

        if (value !== "" && index < code.length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      } else {
        newCode[index] = "";
        setCode(newCode);
        setValue(`codes.${index}`, "");
      }
    };

  const handleInputFocus = (index: number) => () => {
    inputRefs.current[index]?.select();
  };

  const email = localStorage.getItem("usesjhdtevdfsdswrEmailskjstshxcsewsd"); 


  const handleResendVerification = async () => {
   

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

  const [verifyAccount, { isLoading }] = useVerifyAccountMutation();


  const {
    register,
    handleSubmit,
    // formState: { errors },
    setValue,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const codeString = data.codes.join("");

    try {
      const res = await verifyAccount({ code: codeString, email }).unwrap();
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: res?.message,
          showConfirmButton: false,
          timer: 2000,
        });
        router.push("/signin");
      }
    } catch (err) {
      console.log(err);
      setError((err as any)?.data?.errorSources);
    }
  };

  const codeError = error?.find((error) => error?.path === "forbidden");

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
                    Check your email
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
                <div className="md:mt-[30px] mt-6 flex justify-center items-center md:gap-[30px] gap-[12px]">
                  {code.map((digit, index) => (
                    <input
                      {...register(`codes.${index}`)}
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      ref={(el) =>
                        void (inputRefs.current[index] = el as HTMLInputElement)
                      }
                      onChange={handleInputChange(index)}
                      onFocus={handleInputFocus(index)}
                      className={`md:w-[60px] md:h-[60px] w-[45px] h-[45px] rounded-[6px] border-[1px] ${
                        digit !== "" && !/^[0-9]$/.test(digit)
                          ? "border-[1.5px] border-errorColor"
                          : digit !== ""
                          ? "border-[1.5px] border-errorColor"
                          : "border-[1.5px] border-[#E5E5E5]"
                      } bg-black text-center text-[24px] text-white font-medium outline-0`}
                    />
                  ))}
                </div>

                {codeError && (
                  <div className="flex justify-between items-center">
                    <p className="text-red-400 text-[18px]  font-normal">
                      {codeError?.message}
                    </p>
                 
                      <button
                        className="text-primary"
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendLoading}
                      >
                        {resendLoading ? "Sending..." : "Resend Code"}
                      </button>
                    
                  </div>
                )}

                <button type="submit" className="auth-form-btn mt-5">
                  {isLoading ? "isLoading.." : "Verify the code"}
                </button>
              </form>
            </div>
          </div>

         
        </div>
      </div>
    </section>
  );
};

export default verifyAccount;
