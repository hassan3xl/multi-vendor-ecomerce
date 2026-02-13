import React, { useState } from "react";
import BaseModal from "./BaseModal";
import { Button } from "../ui/button";
import {
  useAcceptOrder,
  useGetOrder,
  useRejectOrder,
  useShipOrDeliverOrder,
} from "@/lib/hooks/orders.hook";
import Image from "next/image";
import {
  Package,
  Calendar,
  Truck,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface ViewOrderItemModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  orderId: string | null;
}

const ViewOrderItemModal = ({
  isModalOpen,
  closeModal,
  orderId,
}: ViewOrderItemModalProps) => {
  const { data: order, isLoading } = useGetOrder(orderId);
  const { mutateAsync: acceptOrderAsync } = useAcceptOrder(orderId);
  const { mutateAsync: rejectOrderAsync } = useRejectOrder(orderId);
  const { mutateAsync: shipOrDeliverOrderAsync } =
    useShipOrDeliverOrder(orderId);

  const [isProcessing, setIsProcessing] = useState(false);
  console.log("order", order);
  const queryClient = useQueryClient();

  const handleAcceptOrder = async () => {
    setIsProcessing(true);
    try {
      await acceptOrderAsync(); // WAIT FOR SERVER RESPONSE

      // Wait for React Query to finish refetching the order before closing
      await queryClient.refetchQueries({ queryKey: ["order", orderId] });

      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectOrder = async () => {
    setIsProcessing(true);
    try {
      await rejectOrderAsync();
      await queryClient.refetchQueries({ queryKey: ["order", orderId] });
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShipOrDeliverOrder = async () => {
    setIsProcessing(true);
    try {
      await shipOrDeliverOrderAsync();
      await queryClient.refetchQueries({ queryKey: ["order", orderId] });
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="w-3 h-3" />,
      },
      accepted: {
        bg: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      rejected: {
        bg: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="w-3 h-3" />,
      },
      shipped: {
        bg: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <Truck className="w-3 h-3" />,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.bg}`}
      >
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <BaseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Order Details"
        description="Loading order information..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </BaseModal>
    );
  }

  if (!order) {
    return (
      <BaseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Order Details"
        description="Order not found"
      >
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Unable to load order details</p>
        </div>
      </BaseModal>
    );
  }

  return (
    <BaseModal
      isOpen={isModalOpen}
      onClose={closeModal}
      title="Order Details"
      description="Review and manage order"
    >
      <div className="space-y-6">
        {/* Order Header */}
        <div className="bg-accent rounded-xl p-4 border border-border">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Order Number
              </p>
              <p className="font-mono font-semibold text-primary dark:text-white">
                {order.sub_order_number}
              </p>
            </div>
            {getStatusBadge(order.status)}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Created
                </p>
                <p className="text-sm font-medium text-primary dark:text-white">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Subtotal
                </p>
                <p className="text-sm font-medium text-primary dark:text-white">
                  ${parseFloat(order.subtotal).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information (if available) */}
        {(order.tracking_number ||
          order.carrier ||
          order.estimated_delivery) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Shipping Information
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              {order.carrier && (
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">
                    Carrier:
                  </span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    {order.carrier}
                  </span>
                </div>
              )}
              {order.tracking_number && (
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">
                    Tracking:
                  </span>
                  <span className="font-mono font-medium text-blue-900 dark:text-blue-100">
                    {order.tracking_number}
                  </span>
                </div>
              )}
              {order.estimated_delivery && (
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">
                    Est. Delivery:
                  </span>
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    {formatDate(order.estimated_delivery)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-primary dark:text-white">
              Order Items ({order.items.length})
            </h3>
          </div>

          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-accent rounded-lg border border-border hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {item.product_image ? (
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-primary dark:text-white mb-1 line-clamp-2">
                    {item.product_name}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    {item.sku && (
                      <span className="font-mono text-xs">SKU: {item.sku}</span>
                    )}
                    {item.variant && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        {item.variant}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Qty:{" "}
                        <span className="font-semibold text-primary dark:text-white">
                          {item.quantity}
                        </span>
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Price:{" "}
                        <span className="font-semibold text-primary dark:text-white">
                          ${parseFloat(item.price).toFixed(2)}
                        </span>
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Total
                      </p>
                      <p className="text-lg font-bold text-primary dark:text-white">
                        ${parseFloat(item.item_total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-accent rounded-lg p-4 border border-border">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              Order Subtotal
            </span>
            <span className="text-2xl font-bold text-primary dark:text-white">
              ${parseFloat(order.subtotal).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {order.status === "pending" ? (
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleRejectOrder}
              disabled={isProcessing}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Reject Order"}
            </Button>

            <Button
              onClick={handleAcceptOrder}
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Accept Order"}
            </Button>
          </div>
        ) : order.status === "processing" ? (
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleRejectOrder}
              disabled={isProcessing}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Cancel Order"}
            </Button>

            <Button
              onClick={handleShipOrDeliverOrder}
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Ship Order"}
            </Button>
          </div>
        ) : order.status === "shipped" ? (
          <div className="bg-card rounded-lg p-4 text-center border border-border">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This order has already been {order.status}
            </p>
          </div>
        ) : order.status === "delivered" ? (
          <div className="bg-card rounded-lg p-4 text-center border border-border">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This order has already been {order.status}
            </p>
          </div>
        ) : (
          order.status === "cancelled" && (
            <div className="bg-card rounded-lg p-4 text-center border border-border">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This order has already been {order.status}
              </p>
            </div>
          )
        )}
      </div>
    </BaseModal>
  );
};

export default ViewOrderItemModal;
