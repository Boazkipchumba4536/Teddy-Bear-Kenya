"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check, PackageX } from "lucide-react";
import { trackOrderSchema, type TrackOrderSchema } from "@/lib/validators";
import { fetchOrderByRef } from "@/lib/actions/orders";
import { getOrderProgress } from "@/store/authStore";
import { formatKES } from "@/lib/format";
import type { Order } from "@/types/order";

const STEPS = [
  { id: "received", label: "Order Received" },
  { id: "packed", label: "Packed" },
  { id: "out_for_delivery", label: "Out for Delivery" },
  { id: "delivered", label: "Delivered" },
] as const;

export default function TrackOrderClient() {
  const [loading, setLoading] = useState(false);
  const [tracked, setTracked] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackOrderSchema>({
    resolver: zodResolver(trackOrderSchema),
  });

  const onSubmit = async (data: TrackOrderSchema) => {
    setLoading(true);
    setNotFound(false);
    const found = await fetchOrderByRef(data.orderNumber, data.phone);
    setLoading(false);
    if (found) {
      setOrder(found);
      setTracked(true);
      setNotFound(false);
    } else {
      setOrder(null);
      setTracked(false);
      setNotFound(true);
    }
  };

  const activeStep = order ? getOrderProgress(order.status) : 0;

  return (
    <div className="container-main py-16 max-w-lg mx-auto">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl font-medium text-ink">Track Your Order</h1>
        <p className="text-ink-muted mt-2">
          Enter your order number and phone to see delivery status
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl p-6 shadow-card space-y-4"
      >
        <div>
          <label className="text-sm font-medium mb-1 block">Order Number</label>
          <input
            {...register("orderNumber")}
            className="input-field"
            placeholder="e.g. BH-12345"
          />
          {errors.orderNumber && (
            <p className="text-red-600 text-xs mt-1">{errors.orderNumber.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Phone Number</label>
          <input
            {...register("phone")}
            className="input-field"
            placeholder="+254 7XX XXX XXX"
          />
          {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Searching…
            </>
          ) : (
            "Track Order"
          )}
        </button>
      </form>

      {notFound && (
        <div className="mt-6 p-4 rounded-2xl bg-red-50 text-red-700 text-sm flex items-start gap-3">
          <PackageX className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Order not found</p>
            <p className="mt-1">
              Check your order number and phone. Orders appear here after checkout.
            </p>
          </div>
        </div>
      )}

      {tracked && order && (
        <div className="mt-10">
          <div className="bg-caramel/10 rounded-2xl p-4 mb-6 text-sm">
            <p className="font-semibold text-caramel">{order.id}</p>
            <p className="text-ink-muted mt-1">
              {order.items.length} item(s) · {formatKES(order.total)} · {order.shipping.county}
            </p>
          </div>
          <div className="relative">
            {STEPS.map((step, i) => {
              const isActive = i <= activeStep;
              const isCurrent = i === activeStep;
              return (
                <div key={step.id} className="flex gap-4 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isActive
                          ? isCurrent
                            ? "bg-caramel text-white ring-4 ring-caramel/20"
                            : "bg-caramel text-white"
                          : "bg-caramel/20 text-caramel/50"
                      }`}
                    >
                      {isActive && i < activeStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{i + 1}</span>
                      )}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 mt-2 min-h-[24px] ${
                          i < activeStep ? "bg-caramel" : "bg-caramel/20"
                        }`}
                      />
                    )}
                  </div>
                  <div className="pt-2">
                    <p
                      className={`font-medium ${
                        isCurrent ? "text-caramel" : isActive ? "text-ink" : "text-ink-light"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && order.status !== "delivered" && (
                      <p className="text-sm text-ink-muted mt-1">Your bear is on its way! 🧸</p>
                    )}
                    {isCurrent && order.status === "delivered" && (
                      <p className="text-sm text-mpesa mt-1">Delivered successfully! 🎉</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
