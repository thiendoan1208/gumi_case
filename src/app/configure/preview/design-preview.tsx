"use client";

import { useWindowSize } from "react-use";
import dynamic from "next/dynamic";
import Phone from "@/components/phone";
import { Configuration } from "@/generated/prisma";
import { COLORS, MODELS } from "@/validators/option-validator";
import { cn, formatPrice } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

function DesignPreview({ configuration }: { configuration: Configuration }) {
  const { width, height } = useWindowSize();
  const { color, model, finish, material } = configuration;

  const tw = COLORS.find(
    (supportedColor) => supportedColor.value === color
  )?.tw;

  let totalPrice = BASE_PRICE;
  if (material === "polycarbonate")
    totalPrice += PRODUCT_PRICES.material.polycarbonate;

  if (finish === "textured") {
    totalPrice += PRODUCT_PRICES.finish.textured;
  }

  const label = MODELS.options.find(
    (phoneLabel) => phoneLabel.value === model
  )?.label;

  const { mutate } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: 
  });
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti
          recycle={false}
          tweenDuration={1000}
          numberOfPieces={100}
          width={width}
          height={height}
        />
      </div>

      <div className="mx-2 mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
          <div className="md:flex md:items-center md:justify-center">
            <Phone
              className={cn(`bg-${tw}`)}
              imgSrc={configuration.croppedImageUrl!}
            />
          </div>
        </div>
        <div className="sm:col-span-8">
          <div className="mt-6 sm:mt-0">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900">
              Your {label} Case
            </h3>
            <div className="mt-3 flex items-center gap-1.5 text-base">
              <Check className="size-4 text-green-500" />
              In stock and ready to ship
            </div>
          </div>

          <div className="text-base">
            <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-4 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
              <div>
                <p className="font-medium text-zinc-950">Highlights</p>
                <ol className="mt-3 text-zinc-700 list-disc list-inside">
                  <li>Wireless charging compatible</li>
                  <li>TPU shock absorption</li>
                  <li>Packaging made from recycled materials</li>
                  <li>5 year print warranty</li>
                </ol>
              </div>
              <div>
                <p className="font-medium text-zinc-950">Materials</p>
                <ol className="mt-3 text-zinc-700 list-disc list-inside">
                  <li>High-quality, durable material</li>
                  <li>Scratch- and fingerprint resistant coating</li>
                </ol>
              </div>
            </div>

            <div className="mt-2">
              <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-4">
                <div className="flow-root text-sm">
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Base Price</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(BASE_PRICE / 100)}
                    </p>
                  </div>
                  {finish === "textured" ? (
                    <div>
                      <div className="flex items-center justify-between py-1 mt-2">
                        <p className="text-gray-600">Textured Finish</p>
                        <p className="font-medium text-gray-900">
                          {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                        </p>
                      </div>
                    </div>
                  ) : null}
                  {material === "polycarbonate" ? (
                    <div>
                      <div className="flex items-center justify-between py-1 mt-2">
                        <p className="text-gray-600">
                          Soft polycarbonate material
                        </p>
                        <p className="font-medium text-gray-900">
                          {formatPrice(
                            PRODUCT_PRICES.material.polycarbonate / 100
                          )}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="my-2 h-px bg-gray-200"></div>

                  <div className="flex items-center justify-between py-2">
                    <p className="font-semibold text-gray-900">Order Total</p>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(totalPrice / 100)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end pb-12">
                <Button className="px-4 sm:px-6 lg:px-8 cursor-pointer">
                  <div className="flex items-center">
                    <p> Check out</p>{" "}
                    <ArrowRight className="size-4 ml-1.5 translate-y-[1px]" />
                  </div>{" "}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DesignPreview;
