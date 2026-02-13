from django.urls import path
from ..views.profile_views import ProfileDetailView, UploadProfileAvatarView

urlpatterns = [
    path('', ProfileDetailView.as_view(), name='my-profile'),
    path('upload-avatar/', UploadProfileAvatarView.as_view(), name='upload-avatar'),
]