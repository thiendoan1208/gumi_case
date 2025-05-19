import Thankyou from "@/app/thankyou/Thankyou";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Summary",
};

function ThankyouPage() {
  return (
    <Suspense>
      <Thankyou />
    </Suspense>
  );
}

export default ThankyouPage;
