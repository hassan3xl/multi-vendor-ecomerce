from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..products.serializers import ProductSerializer

from products.models import Wishlist, Product, Category
from 

class SidebarStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.all().count()
        wishlist = Wishlist.objects.filter(user=request.user).count()
        category = Category.objects.all().count()

        data = {
            "products": products,
            "wishlist": wishlist,
            "category": category
        }

        return Response(data)