import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { CaseColor } from "@prisma/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function PhonePreview({
  croppedImageURl,
  color,
}: {
  croppedImageURl: string;
  color: CaseColor;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [renderDimension, setRenderDimension] = useState({
    width: 0,
    height: 0,
  });

  const handleResize = () => {
    if (!ref.current) {
      return;
    }

    const { width, height } = ref.current.getBoundingClientRect();
    setRenderDimension({ width, height });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return window.removeEventListener("resize", handleResize);
  }, []);

  let caseBackgroundColor = "bg-zinc-950";
  if (color === "blue") caseBackgroundColor = "bg-blue-950";
  if (color === "rose") caseBackgroundColor = "bg-rose-950";

  return (
    <AspectRatio ref={ref} ratio={3000 / 2001} className="relative">
      <div
        style={{
          left:
            renderDimension.width / 2 - renderDimension.width / (1216 / 121),
          top: renderDimension.height / 6.22,
        }}
        className="absolute z-20 scale-[1.0352]"
      >
        <Image
          src={croppedImageURl}
          width={renderDimension.width / (3000 / 637)}
          height={100}
          className={cn(
            "select-none phone-skew relative z-20 rounded-t-[15px] rounded-b-[10px] md:rounded-t-[30px] md:rounded-b-[20px]",
            caseBackgroundColor
          )}
          alt="phone preview"
          priority
        />
      </div>

      <div className="relative h-full w-full z-40">
        <Image
          alt="phone"
          width={100}
          height={100}
          src="/clearphone.png"
          className="select-none pointer-events-none h-full w-full antialiased rounded-md"
        />
      </div>
    </AspectRatio>
  );
}

export default PhonePreview;
