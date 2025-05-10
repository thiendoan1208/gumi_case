import MaxWidthWrapper from "@/components/max-witdth-wrapper";
import Steps from "@/components/steps";
import { ReactNode } from "react";

function UploadLayout({ children }: { children: ReactNode }) {
  return (
    <MaxWidthWrapper className="flex-1 flex flex-col">
      <Steps />
      {children}
    </MaxWidthWrapper>
  );
}

export default UploadLayout;
