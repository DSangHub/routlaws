const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const name = String(data.get("name") || "").trim().slice(0, 100);
    const email = String(data.get("email") || "").trim().toLowerCase().slice(0, 254);
    const vehicle = String(data.get("vehicle") || "").trim().slice(0, 120);
    const story = String(data.get("story") || "").trim().slice(0, 800);
    const photo = data.get("photo");
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !vehicle || !story || data.get("consent") !== "yes")
      return Response.json({ error: "Please complete every field and confirm the submission agreement." }, { status: 400 });
    if (!(photo instanceof File) || !photo.size || !allowed.has(photo.type))
      return Response.json({ error: "Choose a JPG, PNG, or WebP vehicle photo." }, { status: 400 });
    if (photo.size > 8 * 1024 * 1024)
      return Response.json({ error: "The photo must be 8 MB or smaller." }, { status: 413 });
    const webhook = process.env.ROUTLAWS_FORM_WEBHOOK_URL;
    if (!webhook) {
      console.error("photo submission failed", { reason: "ROUTLAWS_FORM_WEBHOOK_URL is not configured" });
      return Response.json({ error: "Photo submissions are being connected. Please try again soon." }, { status: 503 });
    }
    const forwarded = new FormData();
    forwarded.set("type", "member-photo");
    forwarded.set("name", name);
    forwarded.set("email", email);
    forwarded.set("vehicle", vehicle);
    forwarded.set("story", story);
    forwarded.set("consent", "yes");
    forwarded.set("photo", photo, photo.name.slice(0, 255));
    const response = await fetch(webhook, { method: "POST", body: forwarded });
    if (!response.ok) throw new Error(`Photo webhook returned ${response.status}`);
    return Response.json({ submitted: true }, { status: 201 });
  } catch (error) {
    console.error("photo submission failed", error);
    return Response.json({ error: "Photo submission is temporarily unavailable. Your information was not published." }, { status: 500 });
  }
}
