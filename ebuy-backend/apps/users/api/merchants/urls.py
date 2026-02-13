from django.urls import path
from ..views import views

urlpatterns = [
    path('', views.ProfileDetailView.as_view(), name='my-profile'),
]