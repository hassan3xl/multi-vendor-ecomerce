import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import { Profile } from "../types/user.types";

export function useGetProfile() {
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: profileApi.getProfile,
  });
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: any) => {
      return await profileApi.updateProfile(profileData as any);
    },
    onSuccess: () => {
      // Invalidate store cache to refetch updated list
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUpdateProfileAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await profileApi.UpdateProfileAvatar(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
