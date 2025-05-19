"use client";

import { changeOrderStatus } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Order, OrderStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Dot, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
  awaiting_shipment: "Awaiting Shipment",
  fulfilled: "Delivered",
  shipped: "Shipped",
};

function Status({ id, orderStatus }: { id: string; orderStatus: OrderStatus }) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["change-order-status"],
    mutationFn: changeOrderStatus,
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-52 flex justify-between items-center"
        >
          {isPending ? (
            <>
              <p>Loading...</p>
              <div className="flex">
                <Dot className="size-3 animate-bounce animation-duration-[1s]" />
                <Dot className="size-3 animate-bounce duration-75 animation-duration-[1.2s]" />
                <Dot className="size-3 animate-bounce duration-50 animation-duration-[1.3s]" />
              </div>
            </>
          ) : (
            <>
              {LABEL_MAP[orderStatus]}
              <ChevronsUpDown className="size-4 ml-2 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        {Object.keys(OrderStatus).map((status) => (
          <DropdownMenuItem
            onClick={() => {
              mutate({ id, newStatus: status as OrderStatus });
            }}
            key={status}
            className={cn(
              "flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100",
              { "bg-zinc-100": orderStatus === status }
            )}
          >
            <Check
              className={cn(
                "mr-2 size-4 text-green-500",
                orderStatus === status ? "opacity-100" : "opacity-0"
              )}
            />
            {LABEL_MAP[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Status;
