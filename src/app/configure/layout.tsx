import MaxWidthWrapper from "@/components/max-witdth-wrapper";
import Steps from "@/components/steps";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create your Case",
};

function UploadLayout({ children }: { children: ReactNode }) {
  return (
    <MaxWidthWrapper className="flex-1 flex flex-col">
      <Steps />
      {children}
    </MaxWidthWrapper>
  );
}

export default UploadLayout;
