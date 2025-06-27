/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Image from "next/image";
import { useAppDispatch } from "@/app/redux/features/hooks";
import { useGetMeQuery } from "@/app/redux/api/auth/authApi";
import { useUpdateProfileMutation } from "@/app/redux/api/auth/updateProfileApi";
import { useChangePasswordMutation } from "@/app/redux/api/auth/changePasswordApi";
import { updateUser } from "@/app/redux/api/auth/authSlice";

interface FormValues {
  oldPassword: string;
  newPassword: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alterNumber: string;
  file: any;
}

type ValidationError = {
  path: string;
  message: string;
};

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading: getMeLoading } = useGetMeQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  //  console.log(data)
  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateProfileMutation();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [error, setError] = useState<ValidationError[]>([]);
  const [selectedTab, setSelectedTab] = useState<"profile" | "transactions">(
    "profile"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    data?.profilePicture || null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues & FormData>();

  // Handle Image Selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // console.log(file)

    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle Profile Update
  const handleProfileUpdate: SubmitHandler<FormData> = async (data) => { 

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const res = await updateProfile(formData).unwrap();

      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: res?.message,
          showConfirmButton: false,
          timer: 3000,
        });
        dispatch(updateUser(res?.data));
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // console.log(data)
    try {
      const res = await changePassword(data).unwrap();
      console.log(res);
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: res?.message,
          showConfirmButton: false,
          timer: 1000,
        });
      }
      // console.log(res)
    } catch (err) {
      // console.log(err)
      setError((err as any)?.data?.errorSources);
    }
  };

  const passwordErrors = error?.find((error) => error?.path === "forbidden");

  if (getMeLoading) {
    return <p>Loading...</p>;
  }
 
  return (
    <section className="container mx-auto p-6">
      <div></div>

      {/* Tab Navigation */}
      <div className="flex border-b pb-4 mb-4 space-x-4">
        <button
          className={`px-6 py-2 rounded transition-all duration-300 ${
            selectedTab === "profile"
              ? "bg-primary text-gray-100 font-bold shadow-md"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => setSelectedTab("profile")}
        >
          Profile
        </button>

        <button
          className={`px-6 py-2 rounded transition-all duration-300 ${
            selectedTab === "transactions"
              ? "bg-primary text-gray-100 font-bold shadow-md"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => setSelectedTab("transactions")}
        >
          Change Password
        </button>
      </div>

      {/* Profile Section */}
      {selectedTab === "profile" && (
        <div className="grid grid-cols-1 ">
          {/* Profile Image Upload */}
          <div className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-4">
              <div
                className="w-32 h-32 rounded-full border overflow-hidden mb-2 cursor-pointer"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                {previewImage || data?.data?.image ? (
                  <Image
                    src={previewImage || data?.data?.image}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    
                  </div>
                )}
              </div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Profile Form */}
            <div className="space-y-4 p-4 w-full bg-secondary/5 rounded-2xl">
              <form
                onSubmit={handleSubmit(handleProfileUpdate)}
                className=""
              >
                <div className="flex flex-col gap-6 w-full">
                  <div className="w-full">
                    <label htmlFor="firstName" className="block mb-2 text-sm">
                      First Name
                    </label>
                    <input
                      type="text"
                      {...register("firstName")}
                      defaultValue={data?.data?.firstName}
                      className="w-full p-2 border rounded bg-secondary/5 border-secondary/10 text-secondary/50 focus:border-primary"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="lastName" className="block mb-2 text-sm">
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...register("lastName")}
                      defaultValue={data?.data?.lastName}
                      className="w-full p-2 border rounded bg-secondary/5 border-secondary/10 text-secondary/50 focus:border-primary"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="phone" className="block mb-2 text-sm">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      {...register("phone")}
                      defaultValue={data?.data?.phone}
                      disabled
                      className="w-full p-2 border rounded bg-secondary/5 border-secondary/10 text-secondary/50 focus:border-primary"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="email" className="block mb-2 text-sm">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={data?.data?.email}
                      {...register("email")}
                      disabled
                      readOnly
                      className="w-full p-2 border rounded bg-secondary/5 border-secondary/10 text-secondary/50 focus:border-primary"
                    />
                  </div>

                  {/* Alternative Mobile Number (Editable) */}
                  <div className="w-full">
                    <label htmlFor="alterNumber" className="block mb-2 text-sm">
                      Alternative Mobile Number
                    </label>
                    <input
                      type="text"
                      {...register("alterNumber")}
                      defaultValue={data?.data?.alterNumber}
                      className="w-full p-2 border rounded bg-secondary/5 border-secondary/10 text-secondary/50 focus:border-primary"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 border-2 border-primary font-bold rounded-xl transition-all ease-in-out hover:bg-primary hover:text-black text-primary"
                  >
                    {updateLoading ? "Loading..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>

     
        </div>
      )}

      {/* Transactions Section */}
      {selectedTab === "transactions" && <div>
             {/* Update Password Section */}
          <div className="space-y-4 p-4 w-full bg-secondary/5 rounded-2xl">
            <h2 className="text-xl font-semibold">Update Password</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
               

                {passwordErrors && (
                  <p className="text-red-400 text-[18px] font-normal">
                    {passwordErrors?.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  {...register("newPassword", {
                    required: "New Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  })}
                  placeholder="New password"
                  className={`w-full p-2 border rounded bg-secondary/5 border-secondary/10 text-secondary/50 focus:border-primary ${
                    errors.newPassword ? "border-red-500" : "border-transparent"
                  }`}
                />

                {errors.newPassword && (
                  <span className="text-red-500">
                    {errors.newPassword.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full mt-8 py-3 border-2 border-primary font-bold rounded-xl transition-all ease-in-out hover:bg-primary hover:text-black text-primary"
              >
                {isLoading ? "Loading..." : "Update Password"}
              </button>
            </form>
          </div>
          </div>}
    </section>
  );
};

export default ProfilePage;
