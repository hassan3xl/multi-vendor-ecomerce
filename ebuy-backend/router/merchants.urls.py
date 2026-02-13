
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from apps.auth import urls as auth_urls
from apps.products.api.merchants import urls as products_urls 
from apps.users.api.merchants import urls as profile_urls
from apps.orders.api.merchants import urls as order_urls

urlpatterns = [
    path('auth/', include(auth_urls)),
    path('profile/', include(profile_urls)),
    path('products/', include(products_urls)),
    path('orders/', include(order_urls)),

]
