from ....users.api.merchants.serializers.serializers import MerchantStoreSerializer, Merchant
from rest_framework import generics
from ..config.permissions import IsActiveVerifiedMerchant, IsMerchantUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class MerchantStoreView(generics.RetrieveUpdateAPIView):
    serializer_class = MerchantStoreSerializer
    permission_classes = [IsAuthenticated, IsMerchantUser]
    
    def get_object(self):
        # Get or create profile for the current user
        profile = Merchant.objects.get(user=self.request.user)
        return profile


class ToggleStoreActiveStatus(APIView):
    def post(self, request, *args, **kwargs):
        merchant = Merchant.objects.get(user=self.request.user)
        merchant.active_status = "active" if merchant.active_status == "inactive" else "inactive"
        merchant.save()
        return Response({"status": merchant.active_status})


class UploadStoreLogoView(APIView):
    from rest_framework.parsers import MultiPartParser, FormParser
    parser_classes = (MultiPartParser, FormParser)


    def post(self, request, *args, **kwargs):
        merchant = Merchant.objects.get(user=self.request.user)
        merchant.store_logo = request.FILES.get('store_logo')
        merchant.save()
        return Response({"status": "success"})