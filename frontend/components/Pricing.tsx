import { ArrowRight, Check } from "lucide-react";
import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started and exploring ClipForge.",
    price: 0,
    cta: "Get Started",
    href: "#start",
    featured: false,
    features: [
      "5 AI video generations / month",
      "Access to basic templates",
      "Up to 720p exports",
      "Standard processing speed",
      "Watermarked videos",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    description: "Everything you need to create scroll-stopping content.",
    price: 19,
    cta: "Start Free Trial",
    href: "#start",
    featured: true,
    features: [
      "100 AI video generations / month",
      "Access to premium templates",
      "Up to 4K exports",
      "Fast processing speed",
      "No watermark",
      "Commercial use license",
    ],
  },
  {
    id: "team",
    name: "Team / Agency",
    description: "Built for teams, agencies and high-volume creators.",
    price: 49,
    cta: "Contact Sales",
    href: "#contact",
    featured: false,
    features: [
      "500 AI video generations / month",
      "All premium templates",
      "Up to 4K exports",
      "Priority processing speed",
      "No watermark",
      "Team collaboration (up to 10 seats)",
      "Dedicated account support",
    ],
  },
] as const;

type PricingProps = {
  className?: string;
};

export function Pricing({ className }: PricingProps) {
  return (
    <section
      id="pricing"
      className={cn(
        "relative px-5 py-16 sm:px-8 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#a78bfa] sm:w-10" aria-hidden />
            <span className="font-sans text-[0.7rem] font-bold tracking-[0.18em] text-[#7c3aed] uppercase sm:text-[0.75rem]">
              Pricing
            </span>
            <span className="h-px w-8 bg-[#a78bfa] sm:w-10" aria-hidden />
          </div>

          <h2
            className={cn(
              "mt-5 max-w-4xl text-center font-display font-bold tracking-[-0.03em]",
              "text-[2.15rem] leading-[1.15] sm:text-[2.85rem] md:text-[3.35rem] lg:text-[3.75rem]",
            )}
            style={{ color: "#111827" }}
          >
            Choose the{" "}
            <span className="text-[#7c3aed]">Perfect Plan</span> for Your Needs
          </h2>

          <p
            className="mt-5 max-w-2xl text-center font-sans text-base leading-relaxed sm:mt-6 sm:text-lg"
            style={{ color: "#6b7280" }}
          >
            Start free and upgrade anytime. All plans include AI-powered editing,
            viral templates, and exports optimized for every platform.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-14">
          <AppImage
            src="/pricing-arrow-left.png"
            alt=""
            width={120}
            height={160}
            className="pointer-events-none absolute top-[36%] -left-1 hidden h-28 w-auto select-none object-contain lg:block xl:-left-12 xl:h-32"
            aria-hidden
          />
          <AppImage
            src="/pricing-arrow-right.png"
            alt=""
            width={120}
            height={160}
            className="pointer-events-none absolute top-[32%] -right-1 hidden h-28 w-auto select-none object-contain lg:block xl:-right-12 xl:h-32"
            aria-hidden
          />

          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3 md:gap-5 lg:gap-6">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type Plan = (typeof plans)[number];

function PricingCard({ plan }: { plan: Plan }) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-[1.75rem] p-6 sm:rounded-[2rem] sm:p-7 lg:p-8",
        plan.featured
          ? "border-2 border-[#7c3aed] bg-[#faf5ff] shadow-[0_12px_40px_rgba(124,58,237,0.12)]"
          : "border border-[#eceaf3] bg-white shadow-[0_8px_30px_rgba(17,24,39,0.06)]",
      )}
    >
      {plan.featured ? (
        <span
          className="absolute -top-3.5 right-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 shadow-[0_4px_14px_rgba(138,92,245,0.4)] sm:right-5 sm:gap-2 sm:px-4 sm:py-[0.4rem]"
          style={{
            background: "linear-gradient(90deg, #b08bff 0%, #8a5cf5 100%)",
          }}
        >
          <MostPopularCrown />
          <span className="font-sans text-[0.7rem] font-semibold tracking-wide text-white sm:text-[0.75rem]">
            Most Popular
          </span>
        </span>
      ) : null}

      <h3
        className="font-display text-xl font-bold tracking-tight sm:text-[1.35rem]"
        style={{ color: "#111827" }}
      >
        {plan.name}
      </h3>

      <p
        className="mt-2 min-h-[2.75rem] font-sans text-sm leading-relaxed sm:text-[0.95rem]"
        style={{ color: "#6b7280" }}
      >
        {plan.description}
      </p>

      <div className="mt-5 flex items-baseline gap-1.5">
        <span
          className="font-display text-[2.75rem] leading-none font-bold tracking-tight sm:text-[3.15rem]"
          style={{ color: "#111827" }}
        >
          ${plan.price}
        </span>
        <span
          className="font-sans text-sm font-medium sm:text-base"
          style={{ color: "#9ca3af" }}
        >
          / month
        </span>
      </div>

      <ul className="mt-6 flex flex-1 flex-col gap-3.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <FeatureCheck />
            <span
              className="font-sans text-sm leading-snug sm:text-[0.95rem]"
              style={{ color: "#374151" }}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={plan.href}
        className={cn(
          "mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl font-sans text-sm font-semibold transition-colors duration-200 sm:h-[3.15rem] sm:text-[0.95rem]",
          plan.featured
            ? "bg-[#7c3aed] text-white shadow-[0_10px_28px_rgba(124,58,237,0.35)] hover:bg-[#6d28d9]"
            : "border border-[#111827] bg-white text-[#111827] hover:bg-[#f9fafb]",
        )}
      >
        {plan.cta}
        <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
      </a>
    </article>
  );
}

/** Exact white crown from the Most Popular badge reference */
function MostPopularCrown() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0 text-white sm:h-4 sm:w-4"
      aria-hidden
      fill="currentColor"
    >
      <path d="M2.5 17.5 5 7.5l4.2 4.8L12 4.5l2.8 7.8L19 7.5l2.5 10H2.5Z" />
      <path d="M3 19.2h18c.4 0 .75.35.75.75v.3c0 .4-.35.75-.75.75H3c-.4 0-.75-.35-.75-.75v-.3c0-.4.35-.75.75-.75Z" />
      <circle cx="5" cy="7.5" r="1.35" />
      <circle cx="12" cy="4.5" r="1.35" />
      <circle cx="19" cy="7.5" r="1.35" />
    </svg>
  );
}

function FeatureCheck() {
  return (
    <span
      className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ede9fe] sm:h-[1.35rem] sm:w-[1.35rem]"
      aria-hidden
    >
      <Check className="h-3 w-3 text-[#7c3aed] sm:h-3.5 sm:w-3.5" strokeWidth={3} />
    </span>
  );
}

