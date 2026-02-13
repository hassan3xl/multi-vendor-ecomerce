from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.models import User
from users.models.models import Profile
from ..serializers.serializers import ProfileSerializer, serializers
from rest_framework.permissions import IsAuthenticated
from ..config.permissions import IsMerchantUser

class ProfileDetailView(generics.RetrieveUpdateAPIView):

    serializer_class = ProfileSerializer
    permission_classes = [IsMerchantUser]    
    def get_queryset(self):
        # Users can only access their own profile
        return Profile.objects.filter(user=self.request.user, )
    
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