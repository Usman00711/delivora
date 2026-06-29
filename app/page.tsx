import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrandMark } from "@/components/layout/brand-mark";
import { FeatureIcon } from "@/components/layout/app-sidebar";
import { MarketingFooter, MarketingHeader } from "@/components/layout/marketing-header";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { landingFeatures } from "@/lib/placeholder-data";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                Client delivery, not task tracking
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {APP_NAME} helps agencies deliver work clients can approve
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                {APP_TAGLINE}. Manage milestones, approvals, scope changes, weekly
                reports, invoices, and project handover — all in one place.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" nativeButton={false} render={<Link href="/register" />}>
                  Start free
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/dashboard" />}
                >
                  View agency demo
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Also try the{" "}
                <Link href="/client" className="font-medium text-primary hover:underline">
                  client portal preview
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-b bg-muted/30 py-10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
            {[
              { label: "Approval workflows", value: "Built-in" },
              { label: "Client action center", value: "Focused UX" },
              { label: "Health scoring", value: "Automatic" },
              { label: "Handover vault", value: "Secure" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything agencies need for client delivery
              </h2>
              <p className="mt-4 text-muted-foreground">
                Not another Jira clone. {APP_NAME} is purpose-built for the
                agency-client relationship.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {landingFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                    <FeatureIcon name={feature.icon} />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t bg-muted/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">How {APP_NAME} works</h2>
              <p className="mt-4 text-muted-foreground">
                Two portals, one delivery workflow
              </p>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div className="rounded-xl border bg-card p-8">
                <div className="mb-4 inline-flex rounded-lg bg-primary p-2.5 text-primary-foreground">
                  <Users className="size-5" />
                </div>
                <h3 className="text-xl font-semibold">Agency Portal</h3>
                <p className="mt-2 text-muted-foreground">
                  Manage clients, projects, milestones, deliverables, approvals,
                  scope changes, reports, invoices, and handover documents.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {[
                    "Project health dashboard",
                    "Send deliverables for approval",
                    "Generate weekly client reports",
                    "Track scope change requests",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border bg-card p-8">
                <div className="mb-4 inline-flex rounded-lg bg-emerald-600 p-2.5 text-white">
                  <Shield className="size-5" />
                </div>
                <h3 className="text-xl font-semibold">Client Portal</h3>
                <p className="mt-2 text-muted-foreground">
                  Clients see exactly what needs their attention — no clutter,
                  no developer jargon.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {[
                    "Action center with pending items",
                    "Approve or request changes",
                    "Review weekly progress reports",
                    "Access handover vault at completion",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground sm:px-12">
              <BrandMark className="mx-auto size-11 bg-primary-foreground text-primary" />
              <h2 className="mt-4 text-3xl font-bold">Ready to streamline client delivery?</h2>
              <p className="mx-auto mt-3 max-w-xl opacity-90">
                Join agencies using {APP_NAME} to keep clients informed, approvals
                on track, and handovers professional.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  nativeButton={false}
                  render={<Link href="/register" />}
                >
                  Get started free
                  <Zap className="size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  nativeButton={false}
                  render={<Link href="/login" />}
                >
                  Sign in
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
