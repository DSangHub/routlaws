export async function POST(request: Request) {
  try {
    const data = (await request.json()) as Record<string, unknown>;
    const name = String(data.name || "").trim().slice(0, 100);
    const email = String(data.email || "").trim().toLowerCase().slice(0, 254);
    const city = String(data.city || "").trim().slice(0, 100);
    const vehicle = String(data.vehicle || "").trim().slice(0, 120);
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || data.consent !== "yes")
      return Response.json({ error: "Please enter your name, a valid email, and consent to updates." }, { status: 400 });
    const webhook = process.env.ROUTLAWS_FORM_WEBHOOK_URL;
    if (!webhook) {
      console.error("waitlist submission failed", { reason: "ROUTLAWS_FORM_WEBHOOK_URL is not configured" });
      return Response.json({ error: "The waitlist is being connected. Please try again soon." }, { status: 503 });
    }
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "waitlist", name, email, city, vehicle, consent: true }),
    });
    if (!response.ok) throw new Error(`Waitlist webhook returned ${response.status}`);
    return Response.json({ joined: true }, { status: 201 });
  } catch (error) {
    console.error("waitlist submission failed", error);
    return Response.json({ error: "The waitlist is temporarily unavailable. Please try again." }, { status: 500 });
  }
}
