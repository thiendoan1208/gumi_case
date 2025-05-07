import MaxWidthWrapper from "@/components/max-witdth-wrapper";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-white h-20 relative">
      <MaxWidthWrapper className="h-full">
        <div className="border-t border-gray-200 "></div>
        <div className="h-full w-full">
          <div className="h-full flex flex-col md:flex-row md:justify-between justify-center md:mx-6">
            <div className="md:flex md:items-center text-center md:text-left pb-2 md:pb-0">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} All rights reserved
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex space-x-8">
                <Link
                  href="#"
                  className="tex-sm text-muted-foreground hover:text-gray-600"
                >
                  Terms
                </Link>
                <Link
                  href="#"
                  className="tex-sm text-muted-foreground hover:text-gray-600"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="tex-sm text-muted-foreground hover:text-gray-600"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}

export default Footer;
