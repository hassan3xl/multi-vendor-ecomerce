from django.contrib import admin
from .models import (
    Product, Category, ProductImage, ProductInventory, Review, ProductSpecification, 
    Feature, 
    Wishlist)


admin.site.register(Product)
admin.site.register(Category)
admin.site.register(ProductImage)
admin.site.register(ProductInventory)
admin.site.register(Review)
admin.site.register(ProductSpecification)
admin.site.register(Feature)
admin.site.register(Wishlist)