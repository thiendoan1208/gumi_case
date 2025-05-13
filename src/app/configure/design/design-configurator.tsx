"use client";

import HandleComponent from "@/components/handle-component";
import { cn, formatPrice } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { RadioGroup } from "@headlessui/react";
import { useRef, useState } from "react";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validators/option-validator";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { BASE_PRICE } from "@/config/products";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { SaveConfig, saveConfiguration } from "@/app/configure/design/actions";
import { useRouter } from "next/navigation";

interface DesignConfiguratorProps {
  configID: string;
  imageURL: string;
  imageDimensions: {
    width: number;
    height: number;
  };
}

function DesignConfigurator({
  configID,
  imageURL,
  imageDimensions,
}: DesignConfiguratorProps) {
  const router = useRouter();

  const { mutate: saveConfigData } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: saveConfiguration) => {
      await Promise.all([saveConfiguration(), SaveConfig(args)]);
    },
    onError: () => {
      toast.error("Something went wrong", {
        description:
          "There was some error on our application, Please try again later !",
      });
    },
    onSuccess: () => {
      router.push(`configure/preview?id=${configID}`);
    },
  });

  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  const [renderDimesion, setRenderDimesion] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });

  const [renderPosition, setRenderPosition] = useState({
    x: 150,
    y: 205,
  });

  const { startUpload } = useUploadThing("imageUploader");

  const saveConfiguration = async () => {
    try {
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();

      const { left: containerLeft, top: containerTop } =
        containerRef!.current?.getBoundingClientRect() as DOMRect;

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const acctualX = renderPosition.x - leftOffset;
      const acctualY = renderPosition.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const userImage = new Image();
      userImage.crossOrigin = "anoymous";
      userImage.src = imageURL;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        acctualX,
        acctualY,
        renderDimesion.width,
        renderDimesion.height
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBLob(base64Data, "image/png");
      const file = new File([blob], "filename.png", { type: "image/png" });

      await startUpload([file], { configID });
    } catch (error) {
      toast.error(`${error}`, {
        description: "Something went wrong, please try again later !",
      });
    }
  };

  const base64ToBLob = (base64: string, mimeType: string) => {
    const byteCharacter = atob(base64);
    const byteNumber = new Array(byteCharacter.length);

    for (let i = 0; i < byteCharacter.length; i++) {
      byteNumber[i] = byteCharacter.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumber);
    return new Blob([byteArray], { type: mimeType });
  };

  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20 mx-2">
      <div
        ref={containerRef}
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="relative w-60 bg-opacity-50  pointer-events-none aspect-[896/1831]">
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              alt="phone image"
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
              fill
              priority
              sizes="100"
            />
          </AspectRatio>
          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]"></div>
          <div
            className={cn(
              "absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]",
              `bg-${options.color.tw}`
            )}
          ></div>
        </div>

        <Rnd
          className="z-40 absolute border-[3px] border-primary"
          default={{
            x: 150,
            y: 205,
            width: imageDimensions.width / 4,
            height: imageDimensions.height / 4,
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderDimesion({
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            });

            setRenderPosition({ x, y });
          }}
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderPosition({ x, y });
          }}
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
        >
          <div className="relative w-full h-full">
            <NextImage
              priority
              src={imageURL}
              fill
              alt="your image"
              sizes="100"
            />
          </div>
        </Rnd>
      </div>

      <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />
          <div className="px-8 pb-12 pt-8">
            <h2 className="tracking-tight font-bold text-3xl">
              Customize your case
            </h2>
            <div className="w-full h-px bg-zinc-200 my-6"></div>

            <div className="relative mt-4 h-full flex flex-col justify-between">
              <div className="flex flex-col gap-6"></div>
              <RadioGroup
                value={options.color}
                onChange={(val) => {
                  setOptions((pre) => ({
                    ...pre,
                    color: val,
                  }));
                }}
              >
                <Label>Color: {options.color.label}</Label>
                <div className="mt-3 flex items-center space-x-2.5 gap-1.5">
                  {COLORS.map((color) => (
                    <RadioGroup.Option
                      key={color.label}
                      value={color}
                      className={({ active, checked }) =>
                        cn(
                          "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                          {
                            [`border-${color.tw}`]: active || checked,
                          }
                        )
                      }
                    >
                      <span
                        className={cn(
                          `bg-${color.tw}`,
                          "size-8 rounded-full border border-black border-opacity-10"
                        )}
                      ></span>
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>

              <div className="relative flex flex-col gap-3 w-full mt-4">
                <Label>Model</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="select-none">
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-center"
                    >
                      {options.model.label}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white z-50 border m-2 p-2 rounded-md w-full select-none">
                    {MODELS.options.map((model) => (
                      <DropdownMenuItem
                        key={model.label}
                        className={cn(
                          "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                          {
                            "bg-zinc-100": model.label === options.model.label,
                          }
                        )}
                        onClick={() => {
                          setOptions((pre) => ({ ...pre, model }));
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            model.label === options.model.label
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {model.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {[MATERIALS, FINISHES].map(
                ({ name, options: selectableOptions }) => (
                  <RadioGroup
                    className="select-none"
                    key={name}
                    value={options[name]}
                    onChange={(val) => {
                      setOptions((pre) => ({
                        ...pre,
                        [name]: val,
                      }));
                    }}
                  >
                    <Label className="mt-4">
                      {name.slice(0, 1).toUpperCase() + name.slice(1)}
                    </Label>
                    <div className="mt-3 space-y-4">
                      {selectableOptions.map((option) => (
                        <RadioGroup.Option
                          key={option.value}
                          value={option}
                          className={({ active, checked }) =>
                            cn(
                              "relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-center",
                              {
                                "border-primary": active || checked,
                              }
                            )
                          }
                        >
                          <span className="flex items-center">
                            <span className="flex flex-col text-sm">
                              <RadioGroup.Label
                                className="font-medium text-gray-900"
                                as="span"
                              >
                                {option.label}
                              </RadioGroup.Label>

                              {option.description ? (
                                <RadioGroup.Description
                                  as="span"
                                  className="text-gray-500"
                                >
                                  <span className="block sm:inline">
                                    {option.description}
                                  </span>
                                </RadioGroup.Description>
                              ) : null}
                            </span>
                          </span>

                          <RadioGroup.Description
                            className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                            as="span"
                          >
                            <span className="font-medium text-gray-900">
                              {formatPrice(option.price / 100)}
                            </span>
                          </RadioGroup.Description>
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                )
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="w-full px-8 h-16 bg-white">
          <div className="h-px w-full bg-zinc-200"></div>
          <div className="w-full h-full flex justify-end items-center">
            <div className="w-full flex gap-6 items-center justify-center mx-8">
              <div>
                <span className="text-sm leading-none">Total:</span>
                <p className="font-medium whitespace-nowrap">
                  {formatPrice(
                    (BASE_PRICE +
                      options.finish.price +
                      options.material.price) /
                      100
                  )}
                </p>
              </div>
              <Button
                onClick={() => {
                  saveConfigData({
                    configID,
                    color: options.color.value,
                    finish: options.finish.value,
                    material: options.material.value,
                    model: options.model.value,
                  });
                }}
                size="sm"
                className="w-full cursor-pointer"
              >
                <p>Continue</p>
                <ArrowRight className="size-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignConfigurator;
