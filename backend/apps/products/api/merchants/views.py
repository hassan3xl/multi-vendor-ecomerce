from rest_framework import viewsets, generics
from products.models import Product, Category
from products.api import (
    ProductCategorySerializer,
    ProductSerializer,
    
)
from .serializers import (
    ProductCreateSerializer, 
    ProductImageWriteSerializer, 
    ProductFeatureWriteSerializer, 
    ProductInventoryWriteSerializer, 
    ProductSpecificationWriteSerializer
)
from products.models import ProductSpecification, ProductImage

# from ..config.permissions import IsMerchantUser, IsActiveVerifiedMerchant
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action

from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [AllowAny]

    
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [
        IsAuthenticated, 
        # IsMerchantUser, 
        # IsActiveVerifiedMerchant
    ]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer
        return ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(merchant=self.request.user.merchant)


class ProductInventoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        product = get_object_or_404(Product, pk=pk)

        serializer = ProductInventoryWriteSerializer(
            data=request.data,
        )
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(
                {"message": "Inventory updated successfully"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProductSpecificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """Create a new specification for a product"""
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSpecificationWriteSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    def delete(self, request, product_pk, spec_pk):
        """Delete a specific specification for a product"""
        product = get_object_or_404(Product, pk=product_pk)
        specification = get_object_or_404(
            ProductSpecification,
            pk=spec_pk,
            product=product
        )
        specification.delete()
        return Response(status=204)


class ProductFeatureView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductFeatureWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product)
            return Response(
                {"message": "Feature added successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, product_pk, feature_pk):
        product = get_object_or_404(Product, id=product_pk)
        feature = get_object_or_404(product.features, id=feature_pk)
        feature.delete()
        return Response({"message": "Feature deleted successfully"}, status=204)


class ProductImagesViewSet(viewsets.ViewSet):
    from rest_framework.parsers import MultiPartParser, FormParser
    parser_classes = (MultiPartParser, FormParser)

    # GET /products/<product_id>/images/
    def list(self, request, product_id=None):
        product = get_object_or_404(Product, id=product_id)
        images = product.images.all()
        serializer = ProductImageWriteSerializer(images, many=True)
        return Response(serializer.data)

    # POST /products/<product_id>/images/
    def create(self, request, product_id=None):
        product = get_object_or_404(Product, id=product_id)

        file = request.FILES.get("image")
        if not file:
            return Response({"error": "No image provided"}, status=400)

        image = ProductImage.objects.create(product=product, image=file)

        return Response({"status": "success", "id": image.id}, status=201)

    # DELETE /products/<product_id>/images/<image_id>/
    def destroy(self, request, product_id=None, pk=None):
        product = get_object_or_404(Product, id=product_id)
        image = get_object_or_404(ProductImage, id=pk, product=product)

        image.delete()
        return Response({"status": "image deleted"}, status=200)

    # POST /products/<product_id>/images/<image_id>/set-primary/
    @action(detail=True, methods=["post"])
    def set_primary(self, request, product_id=None, pk=None):
        product = get_object_or_404(Product, id=product_id)
        image = get_object_or_404(ProductImage, id=pk, product=product)

        # remove primary from all images first
        product.images.update(is_primary=False)

        image.is_primary = True
        image.save()

        return Response({"status": "primary image set", "image_id": image.id})



    