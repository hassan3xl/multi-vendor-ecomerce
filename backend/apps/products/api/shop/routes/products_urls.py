
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..views.products_views import(
    add_or_remove_to_wishlist,
    ProductReviewCreateView,
    ShopProductViewSet,
) 
router = DefaultRouter()
router.register(r"", ShopProductViewSet, basename="products")

urlpatterns = [
    path('', include(router.urls)),
    path(
        'products/<uuid:product_id>/wishlist/', 
        add_or_remove_to_wishlist, 
        name='product-like-unlike'
    ),
    path(
        "products/<uuid:product_id>/reviews/", 
         ProductReviewCreateView.as_view(), 
         name="product-reviews"
    ),

]
