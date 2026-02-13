from apps.products.api import CategorySerializer
from rest_framework.permissions import AllowAny
from rest_framework import viewsets, generics
from apps.products.models import Category

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    authentication_classes = []

class CategoryDetailsView(generics.RetrieveAPIView):
    authentication_classes = []
    queryset = Category.objects.prefetch_related("products").all()
    serializer_class = CategorySerializer
    lookup_field = "name"