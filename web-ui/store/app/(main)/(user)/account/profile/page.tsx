"use client";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetProfile,
  useUpdateProfile,
  useUpdateProfileAvatar,
} from "@/lib/hooks/profile.hook";
import { Profile } from "@/lib/types/user.types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  first_name: string;
  last_name: string;
  bio: string;
  phone: string;
  email_notifications: boolean;
}

const ProfilePage = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { data: profile, isLoading: loading } = useGetProfile();
  const { mutateAsync: updateAvatar, isPending: uploadingAvatar } =
    useUpdateProfileAvatar();
  const { mutateAsync: updateProfile, isPending: updatingProfile } =
    useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
        email_notifications: profile.email_notifications || false,
      });

      // Set avatar preview if exists
      if (profile.avatar) {
        setAvatarPreview(profile.avatar);
      }
    }
  }, [profile, reset]);

  // Handle avatar file selection and upload immediately
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload avatar immediately
        const formData = new FormData();
        formData.append("avatar", file);
        await updateAvatar(formData);

        alert("Avatar updated successfully!");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        alert("Failed to upload avatar. Please try again.");
      }
    }
  };

  // Handle profile form submission (separate from avatar)
  const onSubmit = async (data: FormData) => {
    try {
      // Update profile with JSON data
      const profileData = {
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio,
        phone: data.phone,
        email_notifications: data.email_notifications,
      };

      await updateProfile(profileData);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) return <Loader title="loading profile..." />;
  if (!profile) return null;

  return (
    <div className="border mx-auto bg-card border-border p-4 sm:p-6 rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-primary">My Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <Image
              src={avatarPreview || "/default_avatar.png"}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border mb-3"
              width={96}
              height={96}
              unoptimized
            />
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <span className="text-white text-xs">Uploading...</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={uploadingAvatar}
            className="text-sm text-gray-600"
          />
          <p className="text-xs text-gray-500 mt-1">
            Avatar uploads immediately
          </p>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              name="first_name"
              register={register}
              type="input"
              label="First Name"
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
            {errors.first_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div>
            <Input
              name="last_name"
              register={register}
              type="input"
              label="Last Name"
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
            {errors.last_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone Field */}
        <div>
          <Input
            label="Phone"
            name="phone"
            register={register}
            type="input"
            className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Bio Field */}
        <div>
          <Input
            label="Bio"
            name="bio"
            register={register}
            type="textarea"
            field="textarea"
            rows={3}
            className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
          />
          {errors.bio && (
            <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>
          )}
        </div>

        {/* Email Notifications Checkbox */}
        <div className="flex items-center space-x-2">
          <Input
            className=""
            type="checkbox"
            name="email_notifications"
            register={register}
          />
          <label className="text-sm text-gray-700">
            Receive Email Notifications
          </label>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={updatingProfile} className="w-full">
          {updatingProfile ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
