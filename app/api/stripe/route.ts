import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");

export async function GET() {
    try{
        const { userId } = auth();
        const user = await currentUser();
        if (!userId || !user) {
            return new NextResponse("unauthorised", {status: 401});
        }
        const userSubscription = await prismadb?.userSubscription.findUnique({
            where: {
                userId
            }
        });
        
        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsUrl,
            });

            return new NextResponse(JSON.stringify({url: stripeSession.url}));
        }

        const stripeSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "BAREBONE PRO",
                            description: "Unlimited AI generations",
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month"
                        }
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId,

            }
        });
        return new NextResponse(JSON.stringify({url: stripeSession.url}));

    } catch (error) {
        console.log("STRIPE ERROR:", error)
        return new NextResponse("internal error", {status: 500})
    }
}

