from ..serializers.products_serializers import ProductSerializer, ReviewSerializer
from apps.products.models import Product

from rest_framework import permissions
from rest_framework import generics, viewsets
from apps.products.models import Product, Wishlist, Review
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework import status

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import F

class ShopProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = []
    permission_classes = []


class ProductReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        product_id = self.kwargs.get('product_id')
        product = Product.objects.get(id=product_id)
        serializer.save(user=self.request.user, product=product)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def add_or_remove_to_wishlist(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    wishlist = Wishlist.objects.filter(product=product, user=request.user).first()

    if request.method == 'GET':
        return Response({
            "added": True if wishlist else False
        }, status=status.HTTP_200_OK)

    # POST → Toggle the like
    if wishlist:
        # Unwishlist
        wishlist.delete()

        return Response({
            'removed': False,
        }, status=status.HTTP_200_OK)
    else:
        # Like
        Wishlist.objects.create(product=product, user=request.user)
        Product.objects.filter(id=product_id).update(likes_count=F('likes_count') + 1)
        product.refresh_from_db()

        return Response({
            'liked': True,
            'likes_count': product.likes_count
        }, status=status.HTTP_201_CREATED)

