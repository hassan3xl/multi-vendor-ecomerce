from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from apps.users.models import Profile, User
from apps.users.api import (
    ProfileSerializer, 
)
from rest_framework.views import APIView

class ProfileDetailView(generics.RetrieveUpdateAPIView):
    """
    View for retrieving and updating user's own profile
    Users can only access their own profile for detailed view and updates
    """
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users can only access their own profile
        return Profile.objects.filter(user=self.request.user)
    
    def get_object(self):
        # Get or create profile for the current user
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile

    def update(self, request, *args, **kwargs):
        # Update the profile
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=status.HTTP_200_OK)


class UploadProfileAvatarView(APIView):
    from rest_framework.parsers import MultiPartParser, FormParser
    parser_classes = (MultiPartParser, FormParser)


    def post(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=self.request.user)
        profile.avatar = request.FILES.get('avatar')
        profile.save()
        return Response({"status": "success"})