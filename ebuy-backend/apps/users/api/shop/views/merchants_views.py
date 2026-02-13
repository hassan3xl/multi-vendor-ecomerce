from apps.users.models import Merchant

from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly

from apps.users.api import MerchantSerializer, MerchantReviewSerializer
# user_manager/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from apps.users.models import Merchant, MerchantReview
from django.db import models
from django.db.models import Avg

# class MerchantViewSet(viewsets.ModelViewSet):
class MerchantViewSet(viewsets.ModelViewSet):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer
    authentication_classes = []
    permission_classes = []


class MerchantReviewCreateView(generics.CreateAPIView):
    queryset = MerchantReview.objects.all()
    serializer_class = MerchantReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        merchant_id = self.kwargs.get('merchant_id')
        merchant = Merchant.objects.get(id=merchant_id)
        serializer.save(user=self.request.user, merchant=merchant)