
from django.urls import path, include
from ..views.merchants_views import MerchantViewSet, MerchantReviewCreateView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"merchants", MerchantViewSet, basename="merchants")


urlpatterns = [
    path("", include(router.urls)),
    path("merchants/<uuid:merchant_id>/reviews/", MerchantReviewCreateView.as_view(), name="merchant-reviews"),
]