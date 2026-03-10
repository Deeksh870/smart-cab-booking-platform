import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const rideId = body.rideId;
    const amount = body.amount;

    if (!rideId || !amount) {
      return NextResponse.json(
        { error: "Missing rideId or amount" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Cab Ride Payment",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `http://localhost:3000/payment-success?rideId=${rideId}`,
      cancel_url: `http://localhost:3000/rider`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {

    console.error("Stripe Error:", error);

    return NextResponse.json(
      { error: "Stripe session failed" },
      { status: 500 }
    );
  }
}