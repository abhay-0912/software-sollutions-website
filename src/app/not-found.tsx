import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0D0F1A] px-6 text-white">
      <section className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111427] p-8 text-center shadow-[0_0_40px_rgba(59,130,246,0.15)]">
        <p className="text-sm uppercase tracking-[0.25em] text-[#8AB4FF]">404</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">This page does not exist</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-300">
          The page may have moved, or the link might be outdated. Explore our services or return home.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="rounded-full border border-[#3B82F6]/70 bg-[#3B82F6] px-5 py-2.5 font-semibold">
            Go to Homepage
          </Link>
          <Link href="/services" className="rounded-full border border-white/20 px-5 py-2.5 font-semibold text-slate-200">
            Explore Services
          </Link>
        </div>
      </section>
    </main>
  );
}
