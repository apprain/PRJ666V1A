"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const products = [
  {
    title: "eKYC Platform",
    tag: "Identity Verification",
    description:
      "A third-party customer verification platform for fintechs, lenders, banks, and digital service providers. It supports document upload, OCR, selfie capture, liveness checking, verification sessions, webhook callbacks, and user-wise control panels.",
    href: "https://kyc.apprain.ca",
    button: "Explore eKYC",
  },
  {
    title: "Customer  eOnboarding",
    tag: "Loan & Microcredit",
    description:
      "A complete onboarding solution for loan, microcredit, and financial service companies. The customer journey starts with mobile verification, continues through eKYC, then collects customer profile and product-specific data for back-office review.",
    href: "https://cos.apprain.ca",
    button: "Explore COS",
  },
  {
    title: "TrustLedger: Share Bank Statement",
    tag: "Verified Statements",
    description:
      "A secure platform for customers to share genuine bank statements with approved third-party assessors such as visa consultants, lenders, and loan processors. Banks onboard customers, assessors receive verified statements, and customers control sharing.",
    href: "https://verify.apprain.ca",
    button: "Explore Statements",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <DemoSection />
      <PlatformSection />
      <WhySection />
      <ContactSection />
      <Footer />
    </main>
  );
}

function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 font-bold text-slate-950">
            A
          </div>
          <div>
            <p className="text-lg font-bold leading-none">Apprain</p>
            <p className="text-xs text-slate-400">Digital Trust Platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <Link href="#products" className="hover:text-white">
            Products
          </Link>
          <Link href="#platform" className="hover:text-white">
            Platform
          </Link>
          <Link href="#contact" className="hover:text-white">
            Contact
          </Link>
        </nav>

        <Link
          href="https://github.com/apprain/kyc"
          target="_blank"
          className="hidden rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900 md:inline-block"
        >
          Docs
        </Link>
      </div>
    </header>
  );
}

function HeroSection() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * 0.22);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pb-20 pt-32">
      <div
        className="absolute inset-0 opacity-40"
        style={{ transform: `translateY(${offset}px)` }}
      >
        <div className="absolute left-[-120px] top-20 h-96 w-96 rounded-full bg-green-500/40 blur-3xl" />
        <div className="absolute right-[-120px] top-40 h-[420px] w-[420px] rounded-full bg-cyan-500/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/25 blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:56px_56px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300">
            Secure digital verification for financial services
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Build trust into every customer journey
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Apprain provides eKYC, customer onboarding, and verified statement
            sharing platforms for fintechs, lenders, banks, microcredit
            companies, and digital service providers.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#products"
              className="rounded-xl bg-green-500 px-8 py-4 text-center font-semibold text-slate-950 hover:bg-green-400"
            >
              Explore Products
            </Link>

            <Link
              href="https://github.com/apprain/kyc"
              target="_blank"
              className="rounded-xl border border-slate-700 px-8 py-4 text-center font-semibold text-slate-200 hover:bg-slate-900"
            >
              View eKYC Docs
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="rounded-2xl bg-slate-950 p-6">
            <p className="text-sm font-semibold text-green-400">
              Verification Flow
            </p>

            <div className="mt-6 space-y-4">
              {[
                "Mobile verification",
                "Document upload and OCR",
                "Selfie and liveness check",
                "Profile and product data capture",
                "Back-office review and status tracking",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-slate-950">
                    {index + 1}
                  </div>
                  <p className="text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  return (
    <section id="products" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader
        eyebrow="Our Products"
        title="Three platforms for digital verification"
        text="Apprain products can be used independently or combined to support full customer onboarding, identity verification, and trusted financial document sharing."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.title} {...product} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  title,
  tag,
  description,
  href,
  button,
}: {
  title: string;
  tag: string;
  description: string;
  href: string;
  button: string;
}) {
  return (
    <div className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-7 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-green-500/40 hover:bg-slate-900">
      <p className="mb-4 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-green-300">
        {tag}
      </p>

      <h3 className="text-2xl font-bold">{title}</h3>

      <p className="leading-7 text-slate-300">{description}</p>
    </div>
  );
}

function PlatformSection() {
  return (
    <section id="platform" className="bg-slate-900/50 px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-green-400">
            Platform Capability
          </p>
          <h2 className="mt-3 text-3xl font-bold md:text-5xl">
            Designed for real onboarding operations
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Apprain helps organizations move from manual verification to
            structured digital onboarding. Your customers complete verification
            online, while your team reviews submissions, tracks progress, and
            manages verification outcomes through a control panel.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Capability
            title="API Integration"
            text="Redirect URLs, session creation, callbacks, and webhook-ready flows."
          />
          <Capability
            title="Control Panel"
            text="User-wise access, verification review, status tracking, and operational visibility."
          />
          <Capability
            title="Customer Journey"
            text="Mobile verification, eKYC, profile capture, and product-specific data collection."
          />
          <Capability
            title="Trusted Documents"
            text="Supports genuine statement sharing between customers, banks, and assessors."
          />
        </div>
      </div>
    </section>
  );
}

function Capability({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function WhySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader
        eyebrow="Why Apprain"
        title="Built for fintech, lending, and regulated workflows"
        text="Our focus is practical implementation: clear customer journeys, reusable integration points, verification control panels, and business-ready onboarding flows."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <FeatureCard
          title="Third-Party Ready"
          description="Fintechs, lenders, banks, and service providers can connect Apprain products with their own systems."
        />
        <FeatureCard
          title="Verification Control"
          description="Teams can review customers, documents, sessions, and verification statuses from a central control panel."
        />
        <FeatureCard
          title="Flexible Use Cases"
          description="Supports eKYC, loan onboarding, microcredit onboarding, visa assessment, lending review, and statement verification."
        />
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-7">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-4 leading-7 text-slate-300">{description}</p>
    </div>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-5xl rounded-3xl border border-green-500/20 bg-gradient-to-br from-green-500/15 to-slate-900 p-10 text-center shadow-2xl">
        <h2 className="text-3xl font-bold md:text-5xl">
          Ready to integrate digital trust?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Contact Apprain Technologies to discuss eKYC, customer onboarding, and
          secure statement sharing solutions for your business.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="mailto:info@apprain.com"
            className="rounded-xl bg-green-500 px-8 py-4 font-semibold text-slate-950 hover:bg-green-400"
          >
            info@apprain.com
          </Link>

          <Link
            href="https://github.com/apprain/kyc"
            target="_blank"
            className="rounded-xl border border-slate-700 px-8 py-4 font-semibold text-slate-200 hover:bg-slate-900"
          >
            View Technical Docs
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-green-400">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold md:text-5xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
        {text}
      </p>
    </div>
  );
}

function DemoSection() {
  return (
    <section className="bg-slate-900/50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Live Demonstration"
          title="Experience our digital onboarding journey"
          text="See how Apprain combines customer onboarding and eKYC into a seamless digital experience."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Main Demo */}
          <div className="rounded-3xl border border-green-500/20 bg-slate-950 p-8 shadow-2xl">
            <div className="inline-flex rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300">
              Featured Demo
            </div>

            <h3 className="mt-6 text-3xl font-bold">Digital Onboarding Demo</h3>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              This demonstration showcases how financial institutions can
              digitally onboard customers using mobile verification, eKYC, and
              product-specific onboarding workflows.
            </p>

            <div className="mt-8 space-y-4">
              <DemoItem text="Mobile number verification using OTP" />
              <DemoItem text="Document upload and OCR extraction" />
              <DemoItem text="Selfie capture with liveness detection" />
              <DemoItem text="eKYC verification and session tracking" />
              <DemoItem text="Customer profile and loan application capture" />
              <DemoItem text="Back-office verification through an admin control panel" />
            </div>

            <Link
              href="https://cos.apprain.ca"
              target="_blank"
              className="mt-8 block rounded-xl bg-green-500 px-6 py-4 text-center font-semibold text-slate-950 hover:bg-green-400"
            >
              Launch Live Demo
            </Link>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
              <strong className="text-slate-200">Note:</strong> This demo uses a
              sample loan and microcredit onboarding scenario to demonstrate the
              capabilities of the Apprain platform. Apprain provides the digital
              onboarding and verification technology, not the lending product
              itself.
            </div>
          </div>

          {/* Statement Demo */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-xl">
            <div className="inline-flex rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              Statement Sharing
            </div>

            <h3 className="mt-6 text-3xl font-bold">TrustLedger</h3>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Explore how customers can securely share genuine bank statements
              with approved third-party assessors while maintaining control over
              who can access their financial information.
            </p>

            <div className="mt-8 space-y-4">
              <DemoItem text="Customer consent-driven statement sharing" />
              <DemoItem text="Bank-issued genuine statements" />
              <DemoItem text="Approved third-party assessors" />
              <DemoItem text="Visa processing and lending use cases" />
              <DemoItem text="Controlled and auditable access" />
            </div>

            <Link
              href="https://trustledger.apprain.ca"
              target="_blank"
              className="mt-8 block rounded-xl border border-slate-700 px-6 py-4 text-center font-semibold text-slate-200 hover:bg-slate-900"
            >
              Launch TrustLedger
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-slate-950">
        ✓
      </div>

      <p className="text-slate-300">{text}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
        <p>
          © {new Date().getFullYear()} Apprain Technologies. All rights
          reserved.
        </p>
        <div className="flex gap-5">
          <Link href="https://kyc.apprain.ca" className="hover:text-slate-300">
            eKYC
          </Link>
          <Link href="https://cos.apprain.ca" className="hover:text-slate-300">
            COS
          </Link>
          <Link
            href="https://verify.apprain.ca"
            className="hover:text-slate-300"
          >
            Statement
          </Link>
        </div>
      </div>
    </footer>
  );
}
