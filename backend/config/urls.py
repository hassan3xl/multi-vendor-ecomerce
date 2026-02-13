
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('router.shop_urls')),
    # path('api/v2/', include('api.merchant_api.urls')),
    # path('api/v3/', include('api.admin_api.urls')),


] 
