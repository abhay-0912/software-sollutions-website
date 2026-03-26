"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Mail,
  Menu,
  MessageCircle,
  ShieldCheck,
  Star,
  X,
} from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type ContactPageProps = {
  initialService?: string;
  initialSubject?: string;
};

type FormData = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service_interest: string;
  budget: string;
  timeline: string;
  message: string;
  referral_source: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const LOCAL_STORAGE_KEY = "abaay-contact-form-v1";
const MAX_MESSAGE_LENGTH = 2000;
const CONTACT_EMAIL = "absrivastava999@gmail.com";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const serviceOptions = [
  "Web & Mobile App Development",
  "ERP / CRM System (Odoo or Custom)",
  "Automation & Integrations",
  "SaaS Product Development",
  "IT Consulting",
  "Something Else",
];

const budgetOptions = [
  "Under $1,000",
  "$1,000-$5,000",
  "$5,000-$15,000",
  "$15,000-$50,000",
  "$50,000+",
];

const timelineOptions = ["ASAP", "1-3 months", "3-6 months", "6+ months"];

const referralOptions = [
  "Google Search",
  "Upwork",
  "LinkedIn",
  "Referral from someone",
  "Twitter / X",
  "Other",
];

const faqItems = [
  {
    q: "Do you sign NDAs?",
    a: "Yes. We are happy to sign an NDA before discussing your project in detail.",
  },
  {
    q: "Can I see examples of similar work?",
    a: "Absolutely - visit our portfolio or ask us to share relevant case studies privately during our call.",
  },
  {
    q: "What if I am not sure what I need?",
    a: "That is completely fine. Book a discovery call and we will help you figure out the right solution and scope together.",
  },
  {
    q: "Do you take on small projects?",
    a: "Yes, we take projects starting from $500. If you are not sure if your budget fits, just reach out - we will be honest.",
  },
];

function validateForm(values: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Full name is required.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (values.name.trim().length > 100) {
    errors.name = "Name must be at most 100 characters.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (values.phone.trim() && !/^\+?[0-9()\-\s]{7,20}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number with country code.";
  }

  if (!values.service_interest) {
    errors.service_interest = "Please select a service.";
  } else if (!serviceOptions.includes(values.service_interest)) {
    errors.service_interest = "Select a valid service option.";
  }

  if (!values.budget) {
    errors.budget = "Please select a budget range.";
  } else if (!budgetOptions.includes(values.budget)) {
    errors.budget = "Select a valid budget range.";
  }

  if (!values.timeline) {
    errors.timeline = "Please select a timeline.";
  } else if (!timelineOptions.includes(values.timeline)) {
    errors.timeline = "Select a valid timeline.";
  }

  if (!values.message.trim()) {
    errors.message = "Please describe your project.";
  } else if (values.message.trim().length < 50) {
    errors.message = "Project details must be at least 50 characters.";
  } else if (values.message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `Project details must be at most ${MAX_MESSAGE_LENGTH} characters.`;
  }

  if (values.referral_source && !referralOptions.includes(values.referral_source)) {
    errors.referral_source = "Select a valid referral source.";
  }

  if (!values.consent) {
    errors.consent = "Please agree before sending your enquiry.";
  }

  return errors;
}

function buildInitialState(initialService: string, initialSubject: string): FormData {
  const subjectPrefix = initialSubject ? `Subject: ${initialSubject}\n\n` : "";

  return {
    name: "",
    email: "",
    company: "",
    phone: "",
    service_interest: initialService,
    budget: "",
    timeline: "",
    message: subjectPrefix,
    referral_source: "",
    consent: false,
  };
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-white/10 bg-[#0D0F1A]/75 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          abaay
          <span className="text-[#3B82F6]">.tech</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => {
            const isActive = item.href === "/contact";
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition ${
                  isActive ? "text-[#8AB4FF]" : "text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="rounded-full border border-[#3B82F6]/80 bg-[#3B82F6]/15 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.35)] transition hover:-translate-y-0.5 hover:bg-[#3B82F6]/25"
          >
            Get a Free Quote
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md border border-white/20 p-2 text-slate-200 lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/10 bg-[#0D0F1A]/95 px-6 py-4 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium ${
                  item.href === "/contact" ? "text-[#8AB4FF]" : "text-slate-200"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex w-fit rounded-full border border-[#3B82F6]/80 bg-[#3B82F6]/20 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Get a Free Quote
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0C1120]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-10">
        <div>
          <Link href="/" className="text-2xl font-bold text-white">
            abaay<span className="text-[#3B82F6]">.tech</span>
          </Link>
          <p className="mt-3 max-w-sm text-slate-300">Building tomorrow&apos;s software, today.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Company</h3>
          {navLinks.map((item) => (
            <Link key={item.label} href={item.href} className="text-slate-200 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Connect</h3>
          <div className="flex items-center gap-3">
            <Link
              href="https://www.linkedin.com"
              className="rounded-full border border-white/15 p-2 text-slate-300 transition hover:border-[#3B82F6]/60 hover:text-white"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com"
              className="rounded-full border border-white/15 p-2 text-slate-300 transition hover:border-[#3B82F6]/60 hover:text-white"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="h-4 w-4" />
            </Link>
            <Link
              href="https://x.com"
              className="rounded-full border border-white/15 p-2 text-slate-300 transition hover:border-[#3B82F6]/60 hover:text-white"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaXTwitter className="h-4 w-4" />
            </Link>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Serving international B2B clients
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-slate-400">
        © 2025 Abaay Tech. All rights reserved.
      </div>
    </footer>
  );
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {faqItems.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <article key={item.q} className="rounded-xl border border-white/10 bg-[#111427]/75">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-5 px-5 py-4 text-left"
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
            >
              <span className="font-semibold text-white">{item.q}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-300 transition ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden border-t border-white/10"
                >
                  <p className="px-5 py-4 text-slate-300">{item.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </article>
        );
      })}
    </div>
  );
}

export function ContactPage({ initialService = "", initialSubject = "" }: ContactPageProps) {
  const whatsappMessage = encodeURIComponent(
    "Hi, I found you on abaay.tech and would like to discuss a project.",
  );
  const whatsappUrl = `https://wa.me/910000000000?text=${whatsappMessage}`;

  const [form, setForm] = useState<FormData>(() => buildInitialState(initialService, initialSubject));
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return;

    try {
      const stored = JSON.parse(raw) as Partial<FormData>;
      setForm((prev) => ({
        ...prev,
        ...stored,
        service_interest: initialService || stored.service_interest || prev.service_interest,
      }));
    } catch {
      // Ignore malformed storage.
    }
  }, [initialService]);

  useEffect(() => {
    if (submitted) return;
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(form));
  }, [form, submitted]);

  const errors = useMemo(() => validateForm(form), [form]);

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const shouldShowError = (field: keyof FormData) => Boolean(errors[field] && (submitAttempted || touched[field]));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || submitted) return;

    setSubmitAttempted(true);
    setTouched({
      name: true,
      email: true,
      company: true,
      phone: true,
      service_interest: true,
      budget: true,
      timeline: true,
      message: true,
      referral_source: true,
      consent: true,
    });

    const nextErrors = validateForm(form);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setSubmitError(`Something went wrong. Please try again or email us directly at ${CONTACT_EMAIL}`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setRipple(true);
    window.setTimeout(() => setRipple(false), 500);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      company: form.company.trim() || null,
      service_interest: form.service_interest,
      budget: form.budget,
      timeline: form.timeline,
      message: form.message.trim(),
      referral_source: form.referral_source || null,
      status: "new",
    };

    const { error: insertError } = await supabase.from("leads").insert(payload);

    if (insertError) {
      setSubmitError(`Something went wrong. Please try again or email us directly at ${CONTACT_EMAIL}`);
      setIsSubmitting(false);
      return;
    }

    const { error: emailError } = await supabase.functions.invoke("send-lead-email", {
      body: payload,
    });

    if (emailError) {
      // Lead was saved successfully. Email notification failures should not block the user submission flow.
      console.error("send-lead-email function failed", emailError);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="relative overflow-hidden">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 pb-20 pt-10 lg:gap-20 lg:px-10">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          <p className="text-sm text-slate-300">
            <Link href="/" className="hover:text-white">
              Home
            </Link>{" "}
            → Contact
          </p>
          <span className="inline-flex items-center rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-4 py-1.5 text-sm font-medium text-[#9CC1FF]">
            💬 Usually respond within 24 hours
          </span>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Let&apos;s Build Something Together
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Tell us about your project and we&apos;ll get back to you within one business day with a free consultation and rough estimate.
          </p>
        </motion.section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/10 bg-[#111427]/75 p-6 lg:p-7"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-[560px] flex-col items-center justify-center text-center"
              >
                <motion.svg
                  width="92"
                  height="92"
                  viewBox="0 0 92 92"
                  fill="none"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <circle cx="46" cy="46" r="43" stroke="#3B82F6" strokeWidth="2" />
                  <motion.path
                    d="M28 47L40 58L64 34"
                    stroke="#60A5FA"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                  />
                </motion.svg>
                <h2 className="mt-6 text-3xl font-bold text-white">Message Received!</h2>
                <p className="mt-3 max-w-lg text-slate-300">
                  Thanks {form.name}, we&apos;ll get back to you at {form.email} within 24 hours.
                </p>
                <Link
                  href="/"
                  className="mt-8 rounded-lg border border-[#3B82F6]/70 bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#60A5FA]"
                >
                  Back to Home
                </Link>
              </motion.div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white">Tell us about your project</h2>

                <motion.form
                  onSubmit={handleSubmit}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.03,
                      },
                    },
                  }}
                  className="mt-6 space-y-5"
                >
                  <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Full Name *</span>
                      <input
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        placeholder="John Smith"
                        className="w-full rounded-lg border border-white/15 bg-[#0D0F1A] px-4 py-2.5 text-white placeholder:text-slate-500"
                      />
                      {shouldShowError("name") ? <p className="text-xs text-red-300">{errors.name}</p> : null}
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Email Address *</span>
                      <input
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        placeholder="john@company.com"
                        className="w-full rounded-lg border border-white/15 bg-[#0D0F1A] px-4 py-2.5 text-white placeholder:text-slate-500"
                      />
                      {shouldShowError("email") ? <p className="text-xs text-red-300">{errors.email}</p> : null}
                    </label>
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Company / Organization</span>
                      <input
                        value={form.company}
                        onChange={(e) => updateField("company", e.target.value)}
                        onBlur={() => handleBlur("company")}
                        placeholder="Acme Inc. (optional)"
                        className="w-full rounded-lg border border-white/15 bg-[#0D0F1A] px-4 py-2.5 text-white placeholder:text-slate-500"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Phone Number</span>
                      <input
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        placeholder="+1 234 567 8900 (optional)"
                        className="w-full rounded-lg border border-white/15 bg-[#0D0F1A] px-4 py-2.5 text-white placeholder:text-slate-500"
                      />
                      <p className="text-xs text-slate-500">Including country code</p>
                      {shouldShowError("phone") ? <p className="text-xs text-red-300">{errors.phone}</p> : null}
                    </label>
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Service Interested In *</span>
                      <select
                        value={form.service_interest}
                        onChange={(e) => updateField("service_interest", e.target.value)}
                        onBlur={() => handleBlur("service_interest")}
                        className="w-full rounded-lg border border-white/15 bg-[#0D0F1A] px-4 py-2.5 text-white"
                      >
                        <option value="">-- Select a service --</option>
                        {serviceOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {shouldShowError("service_interest") ? (
                        <p className="text-xs text-red-300">{errors.service_interest}</p>
                      ) : null}
                    </label>
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                    <span className="text-sm text-slate-300">Project Budget *</span>
                    <div className="flex flex-wrap gap-2">
                      {budgetOptions.map((option) => {
                        const active = form.budget === option;
                        return (
                          <motion.button
                            key={option}
                            type="button"
                            onClick={() => {
                              updateField("budget", option);
                              handleBlur("budget");
                            }}
                            whileTap={{ scale: 0.97 }}
                            animate={{ scale: active ? 1.02 : 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 18 }}
                            className={`rounded-full border px-3 py-1.5 text-sm transition ${
                              active
                                ? "border-[#3B82F6]/80 bg-[#3B82F6]/20 text-white"
                                : "border-white/15 bg-white/[0.03] text-slate-300 hover:border-[#3B82F6]/45"
                            }`}
                          >
                            {option}
                          </motion.button>
                        );
                      })}
                    </div>
                    {shouldShowError("budget") ? <p className="text-xs text-red-300">{errors.budget}</p> : null}
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                    <span className="text-sm text-slate-300">Project Timeline *</span>
                    <div className="flex flex-wrap gap-2">
                      {timelineOptions.map((option) => {
                        const active = form.timeline === option;
                        return (
                          <motion.button
                            key={option}
                            type="button"
                            onClick={() => {
                              updateField("timeline", option);
                              handleBlur("timeline");
                            }}
                            whileTap={{ scale: 0.97 }}
                            animate={{ scale: active ? 1.02 : 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 18 }}
                            className={`rounded-full border px-3 py-1.5 text-sm transition ${
                              active
                                ? "border-[#3B82F6]/80 bg-[#3B82F6]/20 text-white"
                                : "border-white/15 bg-white/[0.03] text-slate-300 hover:border-[#3B82F6]/45"
                            }`}
                          >
                            {option}
                          </motion.button>
                        );
                      })}
                    </div>
                    {shouldShowError("timeline") ? <p className="text-xs text-red-300">{errors.timeline}</p> : null}
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">Tell us about your project *</span>
                      <textarea
                        value={form.message}
                        onChange={(e) => {
                          if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                            updateField("message", e.target.value);
                          }
                        }}
                        onBlur={() => handleBlur("message")}
                        rows={5}
                        placeholder="Describe your project, what problem it solves, who will use it, and any technical requirements you have in mind..."
                        className="w-full resize-y rounded-lg border border-white/15 bg-[#0D0F1A] px-4 py-2.5 text-white placeholder:text-slate-500"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">{form.message.length} / {MAX_MESSAGE_LENGTH}</p>
                        {shouldShowError("message") ? <p className="text-xs text-red-300">{errors.message}</p> : null}
                      </div>
                    </label>
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                    <label className="space-y-2">
                      <span className="text-sm text-slate-300">How did you hear about us?</span>
                      <select
                        value={form.referral_source}
                        onChange={(e) => updateField("referral_source", e.target.value)}
                        onBlur={() => handleBlur("referral_source")}
                        className="w-full rounded-lg border border-white/15 bg-[#0D0F1A] px-4 py-2.5 text-white"
                      >
                        <option value="">-- Select --</option>
                        {referralOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </motion.div>

                  <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                    <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => updateField("consent", e.target.checked)}
                        onBlur={() => handleBlur("consent")}
                        className="mt-1 h-4 w-4 accent-[#3B82F6]"
                      />
                      <span className="text-sm text-slate-300">
                        I agree to be contacted by Abaay Tech regarding my enquiry. No spam, ever.
                      </span>
                    </label>
                    {shouldShowError("consent") ? <p className="mt-1 text-xs text-red-300">{errors.consent}</p> : null}
                  </motion.div>

                  <AnimatePresence>
                    {submitError ? (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0, x: [0, -8, 8, -6, 6, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="rounded-lg border border-red-300/40 bg-red-300/10 px-4 py-3 text-sm text-red-100"
                      >
                        {submitError}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg border border-[#3B82F6]/80 bg-[#3B82F6] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#60A5FA] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <AnimatePresence>
                      {ripple ? (
                        <motion.span
                          initial={{ scale: 0, opacity: 0.35 }}
                          animate={{ scale: 9, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute h-10 w-10 rounded-full bg-white/30"
                        />
                      ) : null}
                    </AnimatePresence>
                    <span className="relative z-10 inline-flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Sending...
                        </>
                      ) : (
                        <>Send Message →</>
                      )}
                    </span>
                  </motion.button>
                </motion.form>
              </>
            )}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="space-y-4 lg:sticky lg:top-24 lg:self-start"
          >
            <motion.article
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="rounded-2xl border border-white/10 bg-[#111427]/80 p-5"
            >
              <h3 className="text-lg font-semibold text-white">Quick Info</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-slate-400">📧 Email</p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-semibold text-[#9CC1FF] hover:text-[#C6DCFF]">
                    {CONTACT_EMAIL}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-slate-400">💬 WhatsApp</p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#9CC1FF] hover:text-[#C6DCFF]"
                  >
                    +91 XXXXX XXXXX · Message us directly
                  </a>
                </div>
                <div>
                  <p className="text-sm text-slate-400">🕐 Response Time</p>
                  <p className="text-sm text-slate-200">Within 24 business hours</p>
                  <p className="text-xs text-slate-400">Mon-Fri, 9am-6pm IST</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">🌍 We Work With</p>
                  <p className="text-sm text-slate-200">Clients in US, UK, EU, Australia and beyond</p>
                </div>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="rounded-2xl border border-white/10 bg-[#111427]/80 p-5"
            >
              <h3 className="text-lg font-semibold text-white">Prefer a call?</h3>
              <p className="mt-2 text-sm text-slate-300">
                Book a free 30-minute discovery call directly in our calendar. No commitment required.
              </p>
              <Link
                href="https://cal.com/abaay"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#3B82F6]/60 px-4 py-2.5 text-sm font-semibold text-[#9CC1FF] transition hover:bg-[#3B82F6]/10"
              >
                Book a Call →
              </Link>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-[#111427]/80 p-5"
            >
              <h3 className="text-lg font-semibold text-white">What happens after you submit?</h3>
              <div className="mt-4 space-y-4">
                {[
                  {
                    title: "We review your project details",
                    text: "Usually within a few hours",
                  },
                  {
                    title: "We send a free estimate",
                    text: "A rough scope + timeline + price",
                  },
                  {
                    title: "We schedule a discovery call",
                    text: "30 min to align on everything",
                  },
                ].map((step, idx, arr) => (
                  <div key={step.title} className="relative pl-8">
                    {idx < arr.length - 1 ? (
                      <div className="absolute left-[11px] top-6 h-10 w-[2px] bg-[#3B82F6]/35" />
                    ) : null}
                    <span className="absolute left-0 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#3B82F6]/50 bg-[#3B82F6]/20 text-xs font-bold text-[#C6DCFF]">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-semibold text-slate-100">{step.title}</p>
                    <p className="text-xs text-slate-400">{step.text}</p>
                  </div>
                ))}
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.24 }}
              className="rounded-2xl border border-white/10 bg-[#111427]/80 p-5"
            >
              <p className="text-sm text-slate-300">🔒 Your details are never shared or sold. Ever.</p>
              <div className="mt-4 flex items-center gap-2 text-amber-300">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-current" />
                ))}
                <span className="ml-2 text-sm text-slate-200">5.0 on Upwork</span>
              </div>
              <p className="mt-2 text-sm text-slate-300">15+ happy clients worldwide</p>
            </motion.article>
          </motion.aside>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Quick Answers</h2>
          <FaqAccordion />
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#101527] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-white">Prefer to reach out directly?</p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-slate-200 transition hover:border-[#3B82F6]/50"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="h-4 w-4" /> Email
              </a>
              <Link
                href="https://linkedin.com/company/abaay-tech"
                className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-slate-200 transition hover:border-[#3B82F6]/50"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn className="h-4 w-4" /> LinkedIn
              </Link>
              <Link
                href={whatsappUrl}
                className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-slate-200 transition hover:border-[#3B82F6]/50"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
