import { apiService } from "../services/apiService";

export const profileApi = {
  getProfile: async () => {
    try {
      const res = await apiService.get("/profile/");
      return res;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },
  updateProfile: async (profileData: any) => {
    try {
      const res = await apiService.patch("/profile/", profileData);
      console.log("profile details", res);
      return res;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  UpdateProfileAvatar: async (formData: FormData) => {
    const res = await apiService.postFormData(
      "/profile/upload-avatar/",
      formData
    );
    return res;
  },
};
