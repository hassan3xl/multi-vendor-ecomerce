from rest_framework.views import APIView
from products.models import Product
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from ..config.permissions import IsMerchantUser

class MerchantDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsMerchantUser]

    def get(self, request):
        merchant = request.user.merchant
        products = Product.objects.filter(merchant=merchant)

        total_products = products.count()
        active_products = products.filter(is_active=True).count()
        inactive_products = products.filter(is_active=False).count()

        data = {
            "merchant": {
                "store_name": merchant.store_name,
                "verification_status": merchant.verification_status,
                "active_status": merchant.active_status,
                "total_sales": merchant.total_sales,
            },
            "stats": {
                "total_products": total_products,
                "active_products": active_products,
                "inactive_products": inactive_products,
            }
        }

        return Response(data)