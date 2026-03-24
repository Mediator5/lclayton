import { Webhook } from "svix";
import { headers } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";
import { clerkClient } from "@clerk/nextjs/server";

// ─── Clerk Webhook Handler ────────────────────────────────────────
// Listens for Clerk user events and syncs them to Supabase.
// Endpoint: POST /api/webhooks/clerk
//
// Events handled:
//   user.created → insert into public.users (status: pending)
//   user.updated → update email / full_name in public.users
//   user.deleted → delete from public.users

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req) {
  // ── Verify the webhook signature ────────────────────────────────
  if (!WEBHOOK_SECRET) {
    return new Response(
      JSON.stringify({ error: "CLERK_WEBHOOK_SECRET is not set" }),
      { status: 500 }
    );
  }

  const headerPayload = await headers();
  const svixId        = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response(
      JSON.stringify({ error: "Missing svix headers" }),
      { status: 400 }
    );
  }

  const body = await req.text();
  const wh   = new Webhook(WEBHOOK_SECRET);

  let event;
  try {
    event = wh.verify(body, {
      "svix-id":        svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return new Response(
      JSON.stringify({ error: "Invalid webhook signature" }),
      { status: 400 }
    );
  }

  // ── Handle each event type ──────────────────────────────────────
  const { type, data } = event;

  try {
    switch (type) {

      // ── New user signed up ──────────────────────────────────────
      case "user.created": {
        const email    = data.email_addresses?.[0]?.email_address ?? "";
        const fullName = [data.first_name, data.last_name]
          .filter(Boolean)
          .join(" ");

        // Insert into Supabase with status "pending"
        const { error } = await supabaseServer
          .from("users")
          .insert({
            clerk_id:  data.id,
            email,
            full_name: fullName,
            role:      "client",
            status:    "pending",
          });

        if (error) throw error;

        // Set public_metadata on Clerk so middleware can read it
        const clerk = await clerkClient();
        await clerk.users.updateUserMetadata(data.id, {
          publicMetadata: {
            role:   "client",
            status: "pending",
          },
        });

        console.log(`✓ New user synced to Supabase: ${email}`);
        break;
      }

      // ── User updated their profile ──────────────────────────────
      case "user.updated": {
        const email    = data.email_addresses?.[0]?.email_address ?? "";
        const fullName = [data.first_name, data.last_name]
          .filter(Boolean)
          .join(" ");

        const { error } = await supabaseServer
          .from("users")
          .update({ email, full_name: fullName })
          .eq("clerk_id", data.id);

        if (error) throw error;

        console.log(`✓ User updated in Supabase: ${email}`);
        break;
      }

      // ── User deleted their account ──────────────────────────────
      case "user.deleted": {
        const { error } = await supabaseServer
          .from("users")
          .delete()
          .eq("clerk_id", data.id);

        if (error) throw error;

        console.log(`✓ User deleted from Supabase: ${data.id}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${type}`);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error(`Webhook handler error (${type}):`, err.message);
    return new Response(
      JSON.stringify({ error: "Webhook handler failed" }),
      { status: 500 }
    );
  }
}