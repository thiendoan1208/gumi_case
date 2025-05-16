import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { DialogDescription } from "@radix-ui/react-dialog";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { buttonVariants } from "@/components/ui/button";

function LoginModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="absolute z-[99999]">
        <DialogHeader>
          <div className="relative mx-auto size-24 mb-2">
            <Image
              src="/gumi-case-logo.png"
              alt="logo"
              fill
              sizes="100"
              className="object-contain w-full h-auto"
              priority
            />
          </div>
        </DialogHeader>
        <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">
          Login to continue
        </DialogTitle>
        <DialogDescription className="text-base text-center py-2">
          <span className="font-medium text-zinc-900">
            Your configuration was saved!
          </span>{" "}
          Please Login or create an account to complete your purchase.
        </DialogDescription>

        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <LoginLink className={buttonVariants({ variant: "outline" })}>
            Login
          </LoginLink>
          <RegisterLink className={buttonVariants({ variant: "default" })}>
            Sign up
          </RegisterLink>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LoginModal;
