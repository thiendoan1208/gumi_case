import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import OrderRecievedEmail from "@/components/emails/OrderRecievedEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return new Response("Invalid Signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOKS_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email");
      }

      const session = event.data.object as Stripe.Checkout.Session;

      const { userId, orderId } = session.metadata || {
        orderId: null,
        userId: null,
      };

      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }

      const billingAddress = session.customer_details!.address;
      const shippingAdress =
        session.collected_information!.shipping_details!.address;

      const updateOrder = await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          shippingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: shippingAdress!.city!,
              country: shippingAdress!.country!,
              postalCode: shippingAdress!.postal_code!,
              street: shippingAdress!.line1!,
              state: shippingAdress!.state,
            },
          },
          billingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: billingAddress!.city!,
              country: billingAddress!.country!,
              postalCode: billingAddress!.postal_code!,
              street: billingAddress!.line1!,
              state: billingAddress!.state,
            },
          },
        },
      });

      await resend.emails.send({
        from: "GumiCase <thienmacro1234@gmail.com>",
        to: [event.data.object.customer_details.email],
        subject: "Thanks for your order!",
        react: OrderRecievedEmail({
          orderId,
          orderDate: updateOrder.createdAt.toLocaleDateString(),
          shippingAddress: {
            name: session.customer_details!.name!,
            city: shippingAdress!.city!,
            country: shippingAdress!.country!,
            postalCode: shippingAdress!.postal_code!,
            street: shippingAdress!.line1!,
            state: shippingAdress!.state,
            id: "",
            phoneNumber: null,
          },
        }),
      });
    }

    return NextResponse.json({
      result: event,
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
