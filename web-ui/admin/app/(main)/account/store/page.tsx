"use client";

import Header from "@/components/Header";
import EditStoreModal from "@/components/modals/EditStoreModal";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/config/utils";
import {
  useGetStore,
  useUpdateStoreStatus,
  useUpdateStoreLogo,
} from "@/lib/hooks/store.hook";

import {
  Store,
  MapPin,
  Phone,
  Calendar,
  Star,
  Users,
  Upload,
  Edit2,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

import React, { useEffect, useRef, useState } from "react";

const StorePage = () => {
  const { data: store, isLoading } = useGetStore();
  const { mutate: updateStoreStatus } = useUpdateStoreStatus();
  const { mutate: uploadLogo, isPending: isUploadingLogo } =
    useUpdateStoreLogo();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload handler
  const handleUploadImage = (file: File) => {
    const formData = new FormData();
    formData.append("store_logo", file);

    uploadLogo(formData, {
      onSuccess: () => {},
      onError: () => alert("Unable to upload image. Try again."),
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Invalid file type");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    handleUploadImage(file);
  };

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const averageRating = store?.average_rating || 0;
  const totalReviews = store?.merchant_reviews?.length || 0;

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-medium">Loading store data...</div>
        </div>
      </div>
    );

  return (
    <div className="pb-8">
      {/* ------ HEADER ------ */}
      <Header
        title="Merchant Store"
        subtitle="Manage your store and view customer feedback"
        stats={[
          { title: "Average Rating", value: averageRating.toFixed(1) },
          { title: "Total Reviews", value: totalReviews.toString() },
          {
            title: "Total Sales",
            value: store?.total_sales?.toString() || "0",
          },
          { title: "Theme", value: "Modern" },
        ]}
      />

      <div className="space-y-6">
        {/* =================== STORE INFO CARD =================== */}
        <div className="bg-linear-to-br from-background to-muted/30 p-8 rounded-xl border border-border shadow-lg">
          {/* Status & Verification */}
          <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Store className="w-6 h-6" /> Store Information
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage your store details and visibility
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm ${
                  store?.verification_status === "verified"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {store?.verification_status}
              </span>

              <span
                className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                  store?.active_status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {store?.active_status}
              </span>

              <Button
                variant={
                  store?.active_status === "active" ? "destructive" : "default"
                }
                size="sm"
                onClick={() => updateStoreStatus()}
                className="h-8 text-xs"
              >
                {store?.active_status === "active" ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </div>

          {/* Logo + Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Logo */}
            <div className="space-y-4">
              <div className="flex gap-5">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-xl bg-primary/10 border shadow-md overflow-hidden flex items-center justify-center">
                    <Image
                      src={
                        imagePreview ||
                        store?.store_logo ||
                        "/default_store_logo.png"
                      }
                      alt="Store Logo"
                      className="w-full h-full object-cover"
                      width={400}
                      height={400}
                      unoptimized
                    />
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl"
                  >
                    {isUploadingLogo ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Upload className="w-6 h-6 text-white" />
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-2xl">{store?.store_name}</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    {store?.store_description}
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="mt-3 text-xs"
                  >
                    <Upload className="w-3.5 h-3.5 mr-2" />
                    {isUploadingLogo ? "Uploading..." : "Change Logo"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 bg-background/50 p-5 rounded-lg border">
              <h5 className="font-semibold text-xs uppercase">
                Contact Information
              </h5>

              {[
                { icon: MapPin, label: "Address", value: store?.store_address },
                { icon: Phone, label: "Phone", value: store?.store_phone },
                {
                  icon: Calendar,
                  label: "Member Since",
                  value: formatDate(store?.created_at || ""),
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground font-semibold">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {item.value || "Not provided"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-between items-center border-t mt-6 pt-6">
            <p className="text-sm text-muted-foreground">
              Keep your store information up-to-date
            </p>
            <Button onClick={() => setOpenEditModal(true)}>
              <Edit2 className="w-4 h-4 mr-2" /> Update Store
            </Button>
          </div>
        </div>

        <div className="bg-linear-to-br from-background to-muted/30 p-8 rounded-xl border shadow-lg">
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                Customer Reviews
              </h3>
              <p className="text-sm text-muted-foreground">
                What your customers are saying
              </p>
            </div>

            <div className="flex items-center gap-3 bg-yellow-50 px-5 py-3 rounded-lg border">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <div className="border-l pl-3">
                <p className="font-bold text-lg">{averageRating.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">
                  {totalReviews} reviews
                </p>
              </div>
            </div>
          </div>

          {totalReviews > 0 ? (
            <div className="space-y-4">
              {store!.merchant_reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-background/80 p-5 rounded-xl border hover:shadow-md"
                >
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 border flex items-center justify-center">
                        {review.avatar ? (
                          <img
                            src={review.avatar}
                            alt={review.user_names}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6 text-primary" />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold">{review.user_names}</p>
                        <p className="text-xs text-muted-foreground flex gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(review.created_at).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex bg-yellow-50 px-3 py-1.5 rounded-full gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm pl-16">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-xl">
              <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                <Star className="w-10 h-10 text-primary/50" />
              </div>
              <h4 className="font-semibold text-lg">No reviews yet</h4>
              <p className="text-sm text-muted-foreground">
                Reviews will appear here once customers start rating.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {store?.id && (
        <EditStoreModal
          isModalOpen={openEditModal}
          closeModal={() => setOpenEditModal(false)}
          storeId={store.id}
        />
      )}
    </div>
  );
};

export default StorePage;
