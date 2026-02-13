from .views import SidebarStatsView

from django.urls import path

urlpatterns = [
    path('', SidebarStatsView.as_view(), name='wishlist'),
]