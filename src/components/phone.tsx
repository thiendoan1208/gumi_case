import { cn } from "@/lib/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  dark?: boolean;
}

function Phone({ imgSrc, className, dark = false, ...props }: PhoneProps) {
  return (
    <div
      className={cn(
        "relative pointer-events-none z-50 overflow-hidden",
        className
      )}
      {...props}
    >
      <Image
        src={
          dark
            ? "/phone-template-dark-edges.png"
            : "/phone-template-white-edges.png"
        }
        className="pointer-events-none z-50 select-none w-full h-auto"
        alt="phone image"
        width={100}
        height={100}
        priority
      />
      <div className="absolute -z-10 inset-0 w-full h-auto">
        <Image
          className="object-cover min-w-full min-h-full w-full h-auto"
          src={imgSrc}
          alt="overlay phone image"
          width={100}
          height={100}
          priority
        />
      </div>
    </div>
  );
}

export default Phone;
