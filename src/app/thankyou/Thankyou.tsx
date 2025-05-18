"use client";

import { getPaymentState } from "@/app/thankyou/actions";
import PhonePreview from "@/components/PhonePreview";
import { formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Heart, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

function Thankyou() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  const { data } = useQuery({
    queryKey: ["get-payment-state"],
    queryFn: async () => await getPaymentState({ orderId }),
    retry: true,
    retryDelay: 500,
  });

  if (data === undefined) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Loading your order...</h3>
          <p>This won't take long.</p>
        </div>
      </div>
    );
  }

  if (data === false) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Verifying your payment...</h3>
          <p>This might take a moment.</p>
        </div>
      </div>
    );
  }

  const { configuration, billingAddress, shippingAddress, amount } = data;
  const { color } = configuration;

  return (
    <div className="bg-white mx-2">
      <div className="mx-auto max-w-3xl py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="text-base font-medium text-primary">Thank you!</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Your case is on the way!
          </h1>
          <p>We've received your order and now processing it.</p>

          <div className="mt-12 text-sm font-medium">
            <p className="text-zinc-900">Order number</p>
            <p className="mt-2 text-zinc-500">{orderId}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200">
          <div className="mt-10 flex flex-auto flex-col">
            <h4 className="font-semibold text-zinc-600">
              You made a great choice
            </h4>
            <p className="mt-2 text-sm text-zinc-600">
              We offer a 5-year print guarantee: If you case isn't of the
              highest quality, we'll replace it for free.
            </p>
          </div>
        </div>

        <div className="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
          <PhonePreview
            croppedImageURl={configuration.croppedImageUrl!}
            color={color!}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
          <div>
            <p className="font-medium text-gray-900">Shipping address</p>
            <div className="mt-2 text-zinc-700">
              <address className="not-italic">
                <span className="block">{shippingAddress?.name}</span>
                <span className="block">{shippingAddress?.street}</span>
                <span className="block">
                  {shippingAddress?.postalCode} {shippingAddress?.city}
                </span>
              </address>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-900">Billing address</p>
            <div className="mt-2 text-zinc-700">
              <address className="not-italic">
                <span className="block">{billingAddress?.name}</span>
                <span className="block">{billingAddress?.street}</span>
                <span className="block">
                  {billingAddress?.postalCode} {billingAddress?.city}
                </span>
              </address>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-zinc-200 py-10 text-sm">
          <div>
            <p className="font-medium text-zinc-900">Payment Status</p>
            <div className="flex items-center">
              <p className="mt-2 text-zinc-700 font-semibold">Paid</p>
              <CheckCircle2 className="mt-2 ml-1 text-green-500 size-4" />
            </div>
          </div>

          <div>
            <p className="font-medium text-zinc-900">Shipping Method</p>
            <p className="mt-2 text-zinc-700">
              {" "}
              DHL, take up to 3 working days
            </p>
          </div>
        </div>

        <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Subtotal</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Shipping</p>
            <p className="text-zinc-700">{formatPrice(0)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Total</p>
            <p className="text-zinc-700">{formatPrice(amount)}</p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center">
          <p className="italic">
            Thank you for choosing <span className="text-yellow-500">Gumi</span>
            Case!
          </p>
          <Heart className="size-4 ml-2 text-pink-500" />
        </div>
      </div>
    </div>
  );
}

export default Thankyou;
