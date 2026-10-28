import { YouTubeIcon } from "@/components/icons/YouTubeIcon";
import { AppImage } from "@/components/ui/Image";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

const audiences = [
  {
    title: "Creators / YouTubers",
    description: "Turn long videos into viral-ready clips and grow your audience.",
    image: "/trusted-creators.jpg",
    badge: "youtube" as const,
  },
  {
    title: "Podcasters",
    description: "Instantly create highlight clips from your episodes.",
    image: "/trusted-podcasters.jpg",
    badge: "/icon-podcasts.png",
  },
  {
    title: "Educators / Coaches",
    description:
      "Turn lessons and sessions into bite-sized clips to reach more learners.",
    image: "/trusted-educators.jpg",
    badge: "/icon-graduation.png",
  },
  {
    title: "Agencies",
    description: "Create high-performing clips for multiple clients in minutes.",
    image: "/trusted-agencies.jpg",
    badge: "/icon-agencies.png",
  },
];

type TrustedByProps = {
  className?: string;
};

export function TrustedBy({ className }: TrustedByProps) {
  return (
    <section
      id="trusted-by"
      className={cn(
        "relative px-5 pt-16 pb-10 sm:px-8 sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-14",
        className,
      )}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <SectionLabel>Trusted By</SectionLabel>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="relative mt-7 w-full max-w-5xl sm:mt-8">
              <SlashMark
                className="absolute top-1/2 -left-1 hidden -translate-y-1/2 sm:block md:-left-3 lg:-left-5"
              />
              <SlashMark
                className="absolute top-1/2 -right-1 hidden -translate-y-1/2 scale-x-[-1] sm:block md:-right-3 lg:-right-5"
              />

              <h2
                className={cn(
                  "font-display px-0 text-center font-bold tracking-[-0.03em] sm:px-16 lg:px-20",
                  "text-[2.15rem] leading-[1.12] sm:text-[2.85rem] md:text-[3.35rem] lg:text-[3.75rem]",
                )}
              >
                <span className="block" style={{ color: "#111827" }}>
                  Loved by creators, podcasters,
                </span>
                <span className="mt-0.5 block sm:mt-1" style={{ color: "#6366f1" }}>
                  educators and agencies
                </span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <p
              className="mt-6 max-w-2xl text-center font-sans text-base leading-relaxed sm:mt-7 sm:text-lg"
              style={{ color: "#6b7280" }}
            >
              <span className="block">
                From solo creators to global teams, ClipForge helps turn long
              </span>
              <span className="block">
                videos into scroll-stopping clips for every use case.
              </span>
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {audiences.map((item) => (
            <StaggerItem key={item.title}>
              <AudienceCard {...item} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/** Crisp two-stroke accent — short, slightly curved, no blur. */
function SlashMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 32"
      className={cn("h-8 w-7 text-[#6366f1] sm:h-9 sm:w-8 lg:h-10 lg:w-9", className)}
      fill="none"
      shapeRendering="geometricPrecision"
      aria-hidden
    >
      {/* Upper stroke — steeper */}
      <path
        d="M18 5C20.5 9 22.5 14 24 20"
        stroke="currentColor"
        strokeWidth="3.25"
        strokeLinecap="round"
      />
      {/* Lower stroke — flatter, slightly shorter */}
      <path
        d="M6 12C9.5 15.5 13 20 15.5 25"
        stroke="currentColor"
        strokeWidth="3.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

type AudienceCardProps = {
  title: string;
  description: string;
  image: string;
  badge: "youtube" | string;
};

function AudienceCard({ title, description, image, badge }: AudienceCardProps) {
  return (
    <article
      className={cn(
        "group rounded-[1.35rem] bg-white p-3.5",
        "shadow-[0_18px_40px_-18px_rgba(124,58,237,0.28)]",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1.5 hover:shadow-[0_28px_55px_-16px_rgba(124,58,237,0.42)]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      )}
    >
      <div className="relative overflow-hidden rounded-[1rem]">
        <AppImage
          src={image}
          alt=""
          width={640}
          height={480}
          sizes="(max-width: 1024px) 50vw, 240px"
          className={cn(
            "aspect-[4/3] h-auto w-full object-cover object-center",
            "transition-transform duration-500 ease-out",
            "group-hover:scale-[1.06]",
            "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
          )}
        />

        {badge === "youtube" ? (
          <div
            className={cn(
              "absolute right-2.5 bottom-2.5 flex h-9 w-9 items-center justify-center",
              "rounded-[0.7rem] bg-white",
              "shadow-[0_8px_20px_-6px_rgba(124,58,237,0.55)]",
              "ring-1 ring-[#c4b5fd]/50",
              "transition-transform duration-300 ease-out",
              "group-hover:scale-110 group-hover:-translate-y-0.5",
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:translate-y-0",
            )}
          >
            <YouTubeIcon className="h-4 w-4" />
          </div>
        ) : (
          <div
            className={cn(
              "absolute right-2.5 bottom-2.5 h-9 w-9 overflow-hidden rounded-[0.7rem]",
              "shadow-[0_8px_20px_-6px_rgba(124,58,237,0.55)]",
              "transition-transform duration-300 ease-out",
              "group-hover:scale-110 group-hover:-translate-y-0.5",
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:translate-y-0",
            )}
          >
            <AppImage
              src={badge}
              alt=""
              width={256}
              height={256}
              quality={100}
              className="h-full w-full object-cover object-center"
            />
          </div>
        )}
      </div>

      <div className="px-1.5 pt-3.5 pb-2">
        <Typography
          as="h3"
          variant="h3"
          tone="ink"
          className="text-[1.05rem] sm:text-[1.125rem]"
        >
          {title}
        </Typography>
        <Typography as="p" variant="bodySm" tone="mutedInk" className="mt-1.5">
          {description}
        </Typography>
      </div>
    </article>
  );
}

