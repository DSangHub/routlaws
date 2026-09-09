"use client";

import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight, Camera, Check, ChevronDown, Mail, Menu,
  ShieldCheck, Shirt, Upload, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Notice = { type: "success" | "error"; message: string } | null;

const merch = [
  { name: "Roadmark Tee", detail: "Heavyweight cotton · coming soon" },
  { name: "Midnight Hoodie", detail: "Road-ready fleece · coming soon" },
  { name: "Outlaw Trucker", detail: "Structured cap · coming soon" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [waitlistNotice, setWaitlistNotice] = useState<Notice>(null);
  const [photoNotice, setPhotoNotice] = useState<Notice>(null);
  const [waitlistBusy, setWaitlistBusy] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [fileName, setFileName] = useState("");
  const waitlistRef = useRef<HTMLFormElement>(null);
  const photoRef = useRef<HTMLFormElement>(null);

  async function submitWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWaitlistBusy(true);
    setWaitlistNotice(null);
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to join right now.");
      setWaitlistNotice({ type: "success", message: "You're on the list. Watch your inbox for launch updates." });
      waitlistRef.current?.reset();
    } catch (error) {
      setWaitlistNotice({ type: "error", message: error instanceof Error ? error.message : "Unable to join right now." });
    } finally {
      setWaitlistBusy(false);
    }
  }

  async function submitPhoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPhotoBusy(true);
    setPhotoNotice(null);
    try {
      const response = await fetch("/api/submissions", { method: "POST", body: new FormData(event.currentTarget) });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to submit right now.");
      setPhotoNotice({ type: "success", message: "Photo received. Our team will review it before anything is shared." });
      photoRef.current?.reset();
      setFileName("");
    } catch (error) {
      setPhotoNotice({ type: "error", message: error instanceof Error ? error.message : "Unable to submit right now." });
    } finally {
      setPhotoBusy(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080b0b] text-[#f7f1e6]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080b0b]/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Primary navigation">
          <a href="#top" className="flex items-center gap-3" aria-label="Routlaws home">
            <Image src="/routlaws-logo.png" alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" priority />
            <span className="font-display text-xl tracking-[0.12em]">ROUTLAWS</span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold text-white/70 md:flex">
            <a className="transition hover:text-[#f36a21]" href="#culture">The culture</a>
            <a className="transition hover:text-[#f36a21]" href="#merch">Merch</a>
            <a className="transition hover:text-[#f36a21]" href="#submit">Submit your ride</a>
            <Button asChild className="rounded-none bg-[#f36a21] px-5 font-black text-black hover:bg-[#ff7b32]"><a href="#waitlist">JOIN THE WAITLIST</a></Button>
          </div>
          <button className="p-2 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
        </nav>
        {menuOpen && <div className="border-t border-white/10 bg-[#080b0b] px-5 py-5 md:hidden"><div className="flex flex-col gap-4 font-semibold">
          <a href="#culture" onClick={() => setMenuOpen(false)}>The culture</a><a href="#merch" onClick={() => setMenuOpen(false)}>Merch</a>
          <a href="#submit" onClick={() => setMenuOpen(false)}>Submit your ride</a><a className="text-[#f36a21]" href="#waitlist" onClick={() => setMenuOpen(false)}>Join the waitlist</a>
        </div></div>}
      </header>

      <section id="top" className="relative min-h-[780px] pt-20">
        <div className="road-grid absolute inset-0 opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[#080b0b] to-transparent" />
        <div className="relative mx-auto grid min-h-[700px] max-w-7xl items-center gap-8 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="z-10 max-w-3xl">
            <p className="mb-5 flex items-center gap-3 text-sm font-black uppercase tracking-[0.25em] text-[#f36a21]"><span className="h-px w-12 bg-[#f36a21]" /> A new road-culture community</p>
            <h1 className="font-display text-[clamp(4.3rem,11vw,9rem)] leading-[0.76] tracking-[-0.035em]">BUILT<br /><span className="text-outline">DIFFERENT.</span></h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/68">Show your build. Meet the community. Find legal places to unleash it—and get real backup when the road wins.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-14 rounded-none bg-[#f36a21] px-7 font-black text-black hover:bg-[#ff7b32]"><a href="#waitlist">CLAIM YOUR SPOT <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
              <Button asChild variant="outline" size="lg" className="h-14 rounded-none border-white/25 bg-black/20 px-7 font-black text-white hover:bg-white hover:text-black"><a href="#submit">SHOW US YOUR RIDE</a></Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[590px]"><div className="absolute inset-8 rounded-full bg-[#f36a21]/20 blur-3xl" /><Image src="/routlaws-logo.png" alt="Routlaws logo featuring an eyepatch-wearing alligator, snake, and open road" width={944} height={944} className="relative h-auto w-full drop-shadow-[0_30px_50px_rgba(0,0,0,.65)]" priority /></div>
        </div>
        <a href="#culture" aria-label="Scroll to learn more" className="absolute bottom-7 left-1/2 -translate-x-1/2 text-white/45"><ChevronDown className="h-7 w-7 animate-bounce" /></a>
      </section>

      <section id="culture" className="border-y border-white/10 bg-[#0e1211] py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div><p className="eyebrow">THE CODE</p><h2 className="font-display mt-3 text-5xl leading-none sm:text-7xl">WILD STYLE.<br />CLEAR RULES.</h2></div>
          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            {[
              ["01", "Respect the road", "Families, seniors, riders, pedestrians, and older vehicles share every mile."],
              ["02", "Keep speed legal", "Save racing for licensed tracks and off-road action for approved locations."],
              ["03", "Post responsibly", "No active crimes, victims, unsafe filming, police evasion, or exposed license plates."],
              ["04", "Help your people", "Share knowledge, spotlight responsible builds, and lend a hand when someone is stranded."],
            ].map(([n, title, copy]) => <article key={n} className="bg-[#0e1211] p-7 sm:p-9"><span className="font-display text-3xl text-[#f36a21]">{n}</span><h3 className="mt-8 text-xl font-black uppercase">{title}</h3><p className="mt-3 leading-7 text-white/58">{copy}</p></article>)}
          </div>
        </div></div>
      </section>

      <section id="merch" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">FIRST DROP</p><h2 className="font-display mt-3 text-5xl sm:text-7xl">WEAR THE MARK.</h2></div><p className="max-w-md text-white/55">Founding members get first access when the initial Routlaws merchandise collection lands.</p></div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {merch.map((item, index) => <article key={item.name} className="group border border-white/12 bg-[#0f1312]">
              <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,#263028_0%,#111513_60%,#090c0b_100%)] p-10">
                <span className="absolute left-5 top-5 border border-[#f36a21]/60 px-3 py-1 text-xs font-black tracking-widest text-[#f36a21]">0{index + 1}</span>
                {index === 2 ? <div className="relative"><div className="h-28 w-44 rounded-t-[55%] border-4 border-white/55 border-b-0" /><div className="h-7 w-56 -translate-x-6 skew-x-[-18deg] border-4 border-white/55" /><Image src="/routlaws-logo.png" alt="" width={74} height={74} className="absolute left-1/2 top-8 -translate-x-1/2 rounded-full" /></div> : <div className={index === 1 ? "hoodie-shape" : "tee-shape"}><Image src="/routlaws-logo.png" alt="" width={140} height={140} className="h-28 w-28 object-contain" /></div>}
              </div>
              <div className="flex items-center justify-between p-6"><div><h3 className="text-lg font-black uppercase">{item.name}</h3><p className="mt-1 text-sm text-white/48">{item.detail}</p></div><Shirt className="h-5 w-5 text-[#f36a21]" /></div>
            </article>)}
          </div>
        </div>
      </section>

      <section id="submit" className="bg-[#f0eadf] py-24 text-[#111513] sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[.85fr_1.15fr] lg:px-8">
          <div><p className="eyebrow text-[#c3480c]">MEMBER SPOTLIGHT</p><h2 className="font-display mt-3 text-5xl leading-none sm:text-7xl">PUT YOUR<br />RIDE ON DECK.</h2><p className="mt-6 max-w-md text-lg leading-8 text-black/62">Send one strong photo and the story behind your build. Every submission is reviewed before it can appear.</p>
            <div className="mt-9 space-y-4 text-sm font-semibold">{["Park before taking photos", "Hide plates and personal information", "Only upload photos you own", "No illegal activity or unsafe content"].map((rule) => <div key={rule} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-[#c3480c]" />{rule}</div>)}</div>
          </div>
          <form ref={photoRef} onSubmit={submitPhoto} className="grid gap-5 border-t-4 border-[#111513] bg-white p-6 shadow-[12px_12px_0_#c3480c] sm:p-9">
            <div className="grid gap-5 sm:grid-cols-2"><label className="field-label">Your name<Input required name="name" placeholder="First and last name" /></label><label className="field-label">Email<Input required type="email" name="email" placeholder="you@example.com" /></label></div>
            <label className="field-label">Vehicle<Input required name="vehicle" placeholder="Year, make, model, nickname" maxLength={120} /></label>
            <label className="field-label">Build story<Textarea required name="story" placeholder="What makes your ride yours?" maxLength={800} className="min-h-28" /></label>
            <label className="group flex min-h-36 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-black/25 bg-black/[.025] p-5 text-center transition hover:border-[#c3480c]"><Camera className="mb-3 h-7 w-7 text-[#c3480c]" /><span className="font-black">{fileName || "Choose one vehicle photo"}</span><span className="mt-1 text-sm text-black/50">JPG, PNG, or WebP · 8 MB maximum</span><input required className="sr-only" name="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} /></label>
            <label className="flex items-start gap-3 text-sm leading-6 text-black/65"><input required name="consent" value="yes" type="checkbox" className="mt-1 h-4 w-4 accent-[#c3480c]" />I own this photo, consent to review and possible publication by Routlaws, and confirm it does not show unsafe or illegal activity.</label>
            <Button disabled={photoBusy} className="h-14 rounded-none bg-[#111513] font-black text-white hover:bg-[#c3480c]">{photoBusy ? "SENDING…" : <><Upload className="mr-2 h-4 w-4" /> SUBMIT FOR REVIEW</>}</Button>
            {photoNotice && <p role="status" className={photoNotice.type === "success" ? "notice-success" : "notice-error"}>{photoNotice.message}</p>}
          </form>
        </div>
      </section>

      <section id="waitlist" className="relative py-24 sm:py-32">
        <div className="orange-stripe absolute inset-x-0 top-0 h-2" />
        <div className="mx-auto max-w-3xl px-5 text-center"><Mail className="mx-auto h-9 w-9 text-[#f36a21]" /><p className="eyebrow mt-7">BE FIRST OUT</p><h2 className="font-display mt-3 text-5xl sm:text-7xl">JOIN THE WAITLIST.</h2><p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/58">Get launch news, founding-member access, lawful event updates, and the first merchandise drop.</p>
          <form ref={waitlistRef} onSubmit={submitWaitlist} className="mx-auto mt-9 grid max-w-2xl gap-3 sm:grid-cols-2">
            <Input required name="name" placeholder="Your name" className="h-14 rounded-none border-white/20 bg-white/5 text-white placeholder:text-white/35" /><Input required name="email" type="email" placeholder="Email address" className="h-14 rounded-none border-white/20 bg-white/5 text-white placeholder:text-white/35" /><Input name="city" placeholder="City" className="h-14 rounded-none border-white/20 bg-white/5 text-white placeholder:text-white/35" /><Input name="vehicle" placeholder="What do you drive?" className="h-14 rounded-none border-white/20 bg-white/5 text-white placeholder:text-white/35" />
            <label className="flex items-start gap-3 py-2 text-left text-sm leading-6 text-white/52 sm:col-span-2"><input required name="consent" value="yes" type="checkbox" className="mt-1 h-4 w-4 accent-[#f36a21]" />I agree to receive Routlaws launch and merchandise emails. I can unsubscribe anytime.</label>
            <Button disabled={waitlistBusy} className="h-14 rounded-none bg-[#f36a21] font-black text-black hover:bg-[#ff7b32] sm:col-span-2">{waitlistBusy ? "JOINING…" : "CLAIM MY SPOT"}</Button>
            {waitlistNotice && <p role="status" className={(waitlistNotice.type === "success" ? "notice-success-dark" : "notice-error-dark") + " sm:col-span-2"}>{waitlistNotice.message}</p>}
          </form>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e1211] py-12"><div className="mx-auto flex max-w-5xl items-start gap-5 px-5"><ShieldCheck className="mt-1 h-8 w-8 shrink-0 text-[#f36a21]" /><div><h2 className="text-lg font-black uppercase">Our line in the asphalt</h2><p className="mt-2 leading-7 text-white/55">Routlaws celebrates automotive culture—not street racing, reckless driving, driving without a valid license or insurance, fleeing law enforcement, or unsafe filming. Use licensed tracks and approved off-road locations. Respect everyone sharing the road.</p></div></div></section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-3"><Image src="/routlaws-logo.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full" /><div><p className="font-display text-lg tracking-widest">ROUTLAWS</p><p className="text-xs text-white/38">Outlaws on the road. Responsible in the community.</p></div></div>
        <div className="flex items-center gap-3" aria-label="Social media links"><a className="social-link" href="https://instagram.com/routlaws" target="_blank" rel="noreferrer" aria-label="Routlaws on Instagram"><span className="text-xs font-black">IG</span></a><a className="social-link" href="https://tiktok.com/@routlaws" target="_blank" rel="noreferrer" aria-label="Routlaws on TikTok"><span className="text-lg font-black">♪</span></a><a className="social-link" href="https://youtube.com/@routlaws" target="_blank" rel="noreferrer" aria-label="Routlaws on YouTube"><span className="text-xs font-black">YT</span></a><a className="social-link" href="mailto:hello@routlaws.com" aria-label="Email Routlaws"><Mail /></a></div>
        <p className="text-xs text-white/35">© {new Date().getFullYear()} Routlaws. All rights reserved.</p>
      </footer>
    </main>
  );
}
