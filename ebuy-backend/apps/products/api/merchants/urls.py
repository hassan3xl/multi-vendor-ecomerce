from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ..merchants.views.views import ProductViewSet
from ..merchants.views.views import (
    ProductInventoryView,
    ProductFeatureView,
    ProductImagesViewSet,
    ProductSpecificationView,
    ProductFeatureView,
    CategoryListView
)

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="products")

urlpatterns = [
    path('', include(router.urls)),
    path('categories/', CategoryListView.as_view(), name="categories"),

    # (get & patch): product inventories
    path(
        "products/<uuid:pk>/inventory/", 
        ProductInventoryView.as_view(), 
        name="product-inventory"
    ),

    # (post): add features
    path(
        "products/<uuid:pk>/specifications/", 
        ProductSpecificationView.as_view(), 
        name="add-product-specifications"
    ),
    
    # (post): add product features
    path(
        "products/<uuid:pk>/features/", 
        ProductFeatureView.as_view(), 
        name="add-product-features"
    ),
    
    # (del): delete product specification
    path(
        'products/<uuid:product_pk>/specifications/<int:spec_pk>/',
        ProductSpecificationView.as_view(),
        name='delete spec'
    ),

    # (del): delete product feature
    path(
        "products/<uuid:product_pk>/features/<uuid:feature_pk>/",
        ProductFeatureView.as_view(),
        name="delete-feature",
    ),

    path(
        "products/<uuid:product_id>/images/",
        ProductImagesViewSet.as_view({
            "get": "list",
            "post": "create",
        }),
        name="product-images"
    ),

    path(
        "products/<uuid:product_id>/images/<int:pk>/",
        ProductImagesViewSet.as_view({
            "delete": "destroy",
        }),
        name="delete-product-images"
    ),

    path(
        "products/<uuid:product_id>/images/<int:pk>/set-primary/",
        ProductImagesViewSet.as_view({
            "post": "set_primary",
        }),
        name="set-primary"
    ),

]
