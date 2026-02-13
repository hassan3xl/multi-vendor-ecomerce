"use client";

import Header from "@/components/Header";
import Loader from "@/components/Loader";
import ViewOrderItemModal from "@/components/modals/ViewOrderItemModal";
import { Button } from "@/components/ui/button";
import { useGetOrders } from "@/lib/hooks/orders.hook";
import { formatCurrency, formatDate } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const MerchantOrdersPage = () => {
  const { data: subOrders, isLoading, error } = useGetOrders();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-green-100 text-green-800",
      delivered: "bg-green-200 text-green-900",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-200 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-accent py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-red-600">Failed to load orders</div>
        </div>
      </div>
    );
  }

  const totalOrders = subOrders?.length || 0;

  return (
    <div>
      <Header
        title="Orders"
        subtitle="Manage customer orders assigned to your store"
        stats={[
          { title: "Total Orders", value: totalOrders },
          {
            title: "Pending",
            value: subOrders?.filter((o: any) => o.status === "pending").length,
          },
          {
            title: "Processing",
            value: subOrders?.filter((o: any) => o.status === "processing")
              .length,
          },
          {
            title: "Shipped",
            value: subOrders?.filter((o: any) => o.status === "shipped").length,
          },
          {
            title: "Delivered",
            value: subOrders?.filter((o: any) => o.status === "delivered")
              .length,
          },

          {
            title: "Cancelled",
            value: subOrders?.filter((o: any) => o.status === "cancelled")
              .length,
          },
        ]}
      />

      {totalOrders === 0 ? (
        <div className="text-center py-12">
          <div className="text-primary">No orders available</div>
        </div>
      ) : (
        <div className="space-y-6 bg-card rounded-md">
          <div className="divide-y divide-border">
            {subOrders.map((subOrder: any) => (
              <div key={subOrder.id}>
                <div className="p-6">
                  {/* SubOrder Header */}
                  <div className="flex justify-between">
                    <h4 className="font-medium text-primary">
                      {subOrder.sub_order_number}
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(subOrder.created_at)}
                    </span>
                  </div>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center mt-1 space-x-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          subOrder.status
                        )}`}
                      >
                        {subOrder.status.charAt(0).toUpperCase() +
                          subOrder.status.slice(1)}
                      </span>

                      {subOrder.tracking_number && (
                        <span className="text-sm text-primary">
                          Tracking: {subOrder.tracking_number}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {subOrder.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4"
                      >
                        <div className="shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          {item.product_image ? (
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-16 h-16 object-cover rounded-lg"
                              width={100}
                              height={100}
                              unoptimized
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">
                              No Image
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary truncate">
                            {item.product_name}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {/* SKU: {item.product_description} */}
                            Description:{" "}
                            {item.product_description ||
                              "product description not available, here soon from the backend"}
                          </p>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-primary">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-primary">
                            {formatCurrency(item.price)} each
                          </span>
                          <span className="text-sm font-medium text-primary">
                            {formatCurrency(item.item_total)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-sm flex justify-between text-primary">
                    <span> Subtotal: {formatCurrency(subOrder.subtotal)}</span>
                    <Button onClick={() => setSelectedOrderId(subOrder.id)}>
                      View order
                    </Button>
                  </div>

                  {/* Delivery Info */}
                  {subOrder.estimated_delivery && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm text-primary">
                        Estimated Delivery:{" "}
                        {formatDate(subOrder.estimated_delivery)}
                      </p>
                    </div>
                  )}
                </div>
                <ViewOrderItemModal
                  isModalOpen={selectedOrderId !== null}
                  closeModal={() => setSelectedOrderId(null)}
                  orderId={selectedOrderId}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantOrdersPage;
