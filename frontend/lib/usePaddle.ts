"use client";

import { useCallback, useEffect, useState } from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import {
  isPaddleCheckoutReady,
  PADDLE_CLIENT_TOKEN,
  PADDLE_ENV,
  priceIdFor,
  type PaidPlanId,
} from "@/lib/paddle-catalog";

type OpenCheckoutOpts = {
  plan: PaidPlanId;
  uid: string;
  email?: string;
  onCompleted?: () => void;
};

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle | null>(null);

  useEffect(() => {
    if (!PADDLE_CLIENT_TOKEN) return;
    let live = true;
    void initializePaddle({
      environment: PADDLE_ENV,
      token: PADDLE_CLIENT_TOKEN,
      eventCallback: (event) => {
        if (event.name === "checkout.completed") {
          // Handled per-open via opts; global refresh can be added later
          void event;
        }
      },
    })
      .then((instance) => {
        if (live && instance) setPaddle(instance);
      })
      .catch((err) => {
        console.warn("[paddle] init failed", err);
      });
    return () => {
      live = false;
    };
  }, []);

  const openCheckout = useCallback(
    (opts: OpenCheckoutOpts) => {
      const priceId = priceIdFor(opts.plan);
      if (!paddle || !priceId) return false;

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: { uid: opts.uid },
        ...(opts.email ? { customer: { email: opts.email } } : {}),
        settings: {
          displayMode: "overlay",
          theme: "light",
          successUrl:
            typeof window !== "undefined"
              ? `${window.location.origin}/dashboard/settings?tab=storage&paid=1`
              : undefined,
        },
      });

      // Soft success path — webhook is source of truth for plan unlock
      window.setTimeout(() => opts.onCompleted?.(), 2500);
      return true;
    },
    [paddle],
  );

  return {
    paddle,
    ready: Boolean(paddle) && isPaddleCheckoutReady(),
    configured: isPaddleCheckoutReady(),
    openCheckout,
  };
}
