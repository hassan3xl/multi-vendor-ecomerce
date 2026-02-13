
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from apps.auth import urls as auth_urls
from apps.products.api.shop.routes import products_urls 
from apps.products.api.shop.routes import category_urls 
from apps.users.api.shop.routes import merchants_urls
from apps.users.api.shop.routes import profile_urls
from apps.orders.api.shop import urls as order_urls
from apps.carts.api.shop import urls as cart_urls

urlpatterns = [
    path('auth/', include(auth_urls)),
    path('profile/', include(profile_urls)),
    path('merchants/', include(merchants_urls)),
    path('categories/', include(category_urls)),
    path('products/', include(products_urls)),
    path('cart/', include(cart_urls)),
    path('orders/', include(order_urls)),

]
