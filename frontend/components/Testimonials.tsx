import { Check, Star } from "lucide-react";
import { AppImage } from "@/components/ui/Image";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

const testimonials = [
  {
    name: "Sarah Kim",
    role: "YouTube Creator",
    reach: "250K+ Subscribers",
    quote:
      "ClipForge literally saves me hours every week. I can turn one long video into multiple viral clips in minutes. My channel has grown faster than ever!",
    imageSrc: "/testimonial-sarah.jpg",
    imagePosition: "object-[50%_20%]",
  },
  {
    name: "Marcus Lee",
    role: "Podcaster & Creator",
    reach: "100K+ Followers",
    quote:
      "ClipForge is a game changer. What used to take me hours now takes minutes, and the clips consistently get more views and engagement. It's a must-have for any creator.",
    imageSrc: "/testimonial-marcus.jpg",
    imagePosition: "object-[50%_18%]",
  },
  {
    name: "Emily Carter",
    role: "Content Creator",
    reach: "75K+ Followers",
    quote:
      "I've tried other tools, but ClipForge is by far the best. It helps me create clean, engaging clips that actually go viral. I'm saving time and growing my audience faster than ever!",
    imageSrc: "/testimonial-emily.jpg",
    imagePosition: "object-[48%_22%]",
  },
] as const;

type TestimonialsProps = {
  className?: string;
};

export function Testimonials({ className }: TestimonialsProps) {
  return (
    <section
      id="testimonials"
      className={cn(
        "relative px-5 py-10 sm:px-8 sm:py-12 lg:py-14",
        className,
      )}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <SectionLabel>Testimonials</SectionLabel>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              className={cn(
                "mt-6 max-w-4xl text-center font-display font-bold tracking-[-0.03em]",
                "text-[2.15rem] leading-[1.15] sm:text-[2.85rem] md:text-[3.35rem] lg:text-[3.75rem]",
              )}
            >
              <span className="relative inline-flex items-center justify-center gap-5 sm:gap-7 md:gap-8">
                <AccentLines side="left" />
                <span style={{ color: "#111827" }}>
                  What Creators Are{" "}
                  <span className="bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#6366f1] bg-clip-text text-transparent">
                    Saying
                  </span>
                </span>
                <AccentLines side="right" />
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p
              className="mt-5 max-w-2xl text-center font-sans text-base leading-relaxed sm:mt-6 sm:text-lg"
              style={{ color: "#6b7280" }}
            >
              Join thousands of creators who are saving time, creating viral
              clips, and growing faster with ClipForge.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {testimonials.map((item) => (
            <StaggerItem key={item.name}>
              <TestimonialCard {...item} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function TestimonialCard({
  name,
  role,
  reach,
  quote,
  imageSrc,
  imagePosition,
}: (typeof testimonials)[number]) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-white p-5 sm:rounded-[1.5rem] sm:p-6",
        "border border-[#e9e4f5]",
        "shadow-[0_16px_40px_-20px_rgba(124,58,237,0.22)]",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_24px_48px_-18px_rgba(124,58,237,0.32)]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      )}
    >
      <div className="relative z-10 flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#ede9fe] sm:h-14 sm:w-14">
          <AppImage
            src={imageSrc}
            alt={name}
            fill
            quality={100}
            sizes="56px"
            className={cn("object-cover", imagePosition)}
          />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-0.5" aria-label="5 star rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-[#fbbf24] text-[#fbbf24] sm:h-4 sm:w-4"
                strokeWidth={0}
              />
            ))}
          </div>

          <div className="mt-1.5 flex items-center gap-1.5">
            <h3
              className="font-display text-[0.95rem] font-bold tracking-tight sm:text-base"
              style={{ color: "#111827" }}
            >
              {name}
            </h3>
            <VerifiedBadge />
          </div>

          <p
            className="mt-0.5 text-[0.78rem] leading-snug sm:text-[0.82rem]"
            style={{ color: "#6b7280" }}
          >
            {role}
          </p>
          <p
            className="mt-0.5 text-[0.78rem] leading-snug sm:text-[0.82rem]"
            style={{ color: "#6b7280" }}
          >
            {reach}
          </p>
        </div>
      </div>

      <p
        className="relative z-10 mt-4 flex-1 text-[0.9rem] leading-relaxed sm:mt-5 sm:text-[0.95rem]"
        style={{ color: "#1f2937" }}
      >
        &ldquo;{quote}&rdquo;
      </p>

      {/* Decorative closing quote */}
      <span
        className="pointer-events-none absolute right-4 bottom-2 select-none font-serif text-[5.5rem] leading-none text-[#c4b5fd]/35 sm:right-5 sm:text-[6.5rem]"
        aria-hidden
      >
        &rdquo;
      </span>
    </article>
  );
}

function VerifiedBadge() {
  return (
    <span
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] sm:h-[1.1rem] sm:w-[1.1rem]"
      aria-label="Verified"
    >
      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
    </span>
  );
}

function AccentLines({ side }: { side: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 36 40"
      className={cn(
        "hidden h-9 w-7 shrink-0 overflow-visible sm:block sm:h-10 sm:w-8",
        side === "right" && "scale-x-[-1]",
      )}
      fill="none"
      aria-hidden
    >
      {/* Three outward burst lines matching the design */}
      <path
        d="M22 12 L5 4"
        stroke="#8b5cf6"
        strokeWidth={2.8}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 3px rgba(139,92,246,0.5))" }}
      />
      <path
        d="M22 20 L3 20"
        stroke="#8b5cf6"
        strokeWidth={2.8}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 3px rgba(139,92,246,0.5))" }}
      />
      <path
        d="M22 28 L5 36"
        stroke="#8b5cf6"
        strokeWidth={2.8}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 3px rgba(139,92,246,0.5))" }}
      />
    </svg>
  );
}
