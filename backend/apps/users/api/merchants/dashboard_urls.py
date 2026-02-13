from django.urls import path
from ....users.api.merchants.views.views import MerchantDashboardView

urlpatterns = [
    path("", MerchantDashboardView.as_view(), name="dashbboard"),
]
