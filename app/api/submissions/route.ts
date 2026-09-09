import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { submissions } from "@/db/schema";

const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  let objectKey = "";
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
    if (!env.BUCKET) throw new Error("Upload storage is unavailable");
    const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
    objectKey = `submissions/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
    await env.BUCKET.put(objectKey, photo.stream(), { httpMetadata: { contentType: photo.type }, customMetadata: { status: "pending" } });
    await getDb().insert(submissions).values({ name, email, vehicle, story, objectKey, originalFilename: photo.name.slice(0, 255), contentType: photo.type, status: "pending", consent: true });
    return Response.json({ submitted: true }, { status: 201 });
  } catch (error) {
    if (objectKey && env.BUCKET) await env.BUCKET.delete(objectKey).catch(() => undefined);
    console.error("photo submission failed", error);
    return Response.json({ error: "Photo submission is temporarily unavailable. Your information was not published." }, { status: 500 });
  }
}
