import Header from "@/components/Header";
import React from "react";

const DashboardPage = () => {
  return (
    <div>
      {/* Page Header */}
      <Header
        title="Your Dashboard"
        subtitle="Welcome back! Here is a quick summary of your recent activities."
      />

      {/* Recent Orders */}
      <div className="bg-muted p-6 rounded-lg border border-border mt-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Recent Orders
        </h3>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div>
                <p className="font-medium text-primary">Order #{5231 + i}</p>
                <p className="text-sm text-gray-500">Placed recently</p>
              </div>

              <div className="text-right">
                <p className="font-medium text-primary">
                  ${(Math.random() * 80 + 20).toFixed(2)}
                </p>

                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Processing
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
