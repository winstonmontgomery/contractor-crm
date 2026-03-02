import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    )
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  )

  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(session, stripe, supabase)
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription, supabase)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCanceled(subscription, supabase)
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaid(invoice, supabase)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice, supabase)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any

async function handleCheckoutComplete(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
  supabase: SupabaseClient
) {
  const contractorId = session.metadata?.contractor_id
  if (!contractorId) return

  const subscriptionId = session.subscription as string
  const customerId = session.customer as string

  // Get subscription details
  const subscriptionResponse = await stripe.subscriptions.retrieve(subscriptionId)
  // Access the subscription data
  const subscription = subscriptionResponse as unknown as {
    items: { data: Array<{ price: { id: string } }> }
    current_period_start: number
    current_period_end: number
    status: string
    cancel_at_period_end: boolean
  }
  
  const priceId = subscription.items.data[0]?.price.id

  // Determine tier based on price ID
  let tier: "NETWORK" | "PERFORMANCE" = "NETWORK"
  if (priceId === process.env.STRIPE_PERFORMANCE_PRICE_ID) {
    tier = "PERFORMANCE"
  }

  const periodStart = subscription.current_period_start
  const periodEnd = subscription.current_period_end

  // Update or create membership
  await supabase.from("memberships").upsert({
    contractor_id: contractorId,
    tier,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    stripe_price_id: priceId,
    status: subscription.status,
    current_period_start: new Date(periodStart * 1000).toISOString(),
    current_period_end: new Date(periodEnd * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
  })
}

async function handleSubscriptionUpdate(
  subscriptionEvent: Stripe.Subscription,
  supabase: SupabaseClient
) {
  // Cast to access properties
  const subscription = subscriptionEvent as unknown as {
    id: string
    items: { data: Array<{ price: { id: string } }> }
    current_period_start: number
    current_period_end: number
    status: string
    cancel_at_period_end: boolean
  }

  const priceId = subscription.items.data[0]?.price.id

  // Determine tier based on price ID
  let tier: "NETWORK" | "PERFORMANCE" = "NETWORK"
  if (priceId === process.env.STRIPE_PERFORMANCE_PRICE_ID) {
    tier = "PERFORMANCE"
  }

  const periodStart = subscription.current_period_start
  const periodEnd = subscription.current_period_end

  await supabase
    .from("memberships")
    .update({
      tier,
      stripe_price_id: priceId,
      status: subscription.status,
      current_period_start: new Date(periodStart * 1000).toISOString(),
      current_period_end: new Date(periodEnd * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq("stripe_subscription_id", subscription.id)
}

async function handleSubscriptionCanceled(
  subscriptionEvent: Stripe.Subscription,
  supabase: SupabaseClient
) {
  const subscription = subscriptionEvent as unknown as { id: string }
  await supabase
    .from("memberships")
    .update({
      tier: "FREE",
      status: "canceled",
      cancel_at_period_end: false,
    })
    .eq("stripe_subscription_id", subscription.id)
}

async function handleInvoicePaid(
  invoiceEvent: Stripe.Invoice,
  supabase: SupabaseClient
) {
  // Update membership status to active
  const invoice = invoiceEvent as unknown as { subscription?: string }
  if (invoice.subscription) {
    await supabase
      .from("memberships")
      .update({ status: "active" })
      .eq("stripe_subscription_id", invoice.subscription)
  }
}

async function handleInvoicePaymentFailed(
  invoiceEvent: Stripe.Invoice,
  supabase: SupabaseClient
) {
  // Update membership status to past_due
  const invoice = invoiceEvent as unknown as { subscription?: string }
  if (invoice.subscription) {
    await supabase
      .from("memberships")
      .update({ status: "past_due" })
      .eq("stripe_subscription_id", invoice.subscription)
  }
}
