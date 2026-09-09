import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { waitlist } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as Record<string, unknown>;
    const name = String(data.name || "").trim().slice(0, 100);
    const email = String(data.email || "").trim().toLowerCase().slice(0, 254);
    const city = String(data.city || "").trim().slice(0, 100);
    const vehicle = String(data.vehicle || "").trim().slice(0, 120);
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || data.consent !== "yes")
      return Response.json({ error: "Please enter your name, a valid email, and consent to updates." }, { status: 400 });
    const db = getDb();
    const existing = await db.select({ id: waitlist.id }).from(waitlist).where(eq(waitlist.email, email)).limit(1);
    if (existing.length) return Response.json({ joined: true });
    await db.insert(waitlist).values({ name, email, city, vehicle, consent: true });
    return Response.json({ joined: true }, { status: 201 });
  } catch (error) {
    console.error("waitlist submission failed", error);
    return Response.json({ error: "The waitlist is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
