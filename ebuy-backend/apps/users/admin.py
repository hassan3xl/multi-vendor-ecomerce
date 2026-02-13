from django.contrib import admin
from .models import Merchant, User, Profile, MerchantReview


admin.site.register(Merchant)
admin.site.register(User)
admin.site.register(Profile)
admin.site.register(MerchantReview)
# Register your models here.
