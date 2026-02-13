from django.urls import path
from ....users.api.merchants.views import views

urlpatterns = [
    path('', views.MerchantStoreView.as_view(), name='my-store'),
    path('toggle-status/', views.ToggleStoreActiveStatus.as_view(), name='my-store-status'),
    path('upload-logo/', views.UploadStoreLogoView.as_view(), name='upload-logo'),
]