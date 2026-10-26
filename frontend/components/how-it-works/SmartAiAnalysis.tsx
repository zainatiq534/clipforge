import { SmartAiAnalysisMockup } from "@/components/how-it-works/SmartAiAnalysisMockup";
import { Reveal } from "@/components/ui/Reveal";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

const benefits = [
  "Detects engaging moments",
  "Understands context & emotion",
  "Creates natural, scroll-stopping clips",
] as const;

type SmartAiAnalysisProps = {
  className?: string;
};

export function SmartAiAnalysis({ className }: SmartAiAnalysisProps) {
  return (
    <section
      id="ai-analysis"
      className={cn(
        "relative overflow-x-clip px-5 pt-8 pb-14 sm:px-8 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute top-[10%] left-[-5%] h-80 w-80 rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(196,181,253,0.45) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-[5%] bottom-[5%] h-96 w-96 rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-start gap-10 lg:grid-cols-[minmax(16rem,0.95fr)_minmax(0,1.25fr)] lg:gap-8 xl:gap-10">
        <div className="flex w-full min-w-0 flex-col items-start overflow-visible pt-1 pl-3 text-left sm:pt-2 sm:pl-5 lg:pl-6">
          <Reveal>
            <Typography
              as="h2"
              variant="display"
              tone="ink"
              className="max-w-md text-balance"
            >
              AI Finds the Best{" "}
              <Typography as="span" variant="display" tone="gradient">
                Moments
              </Typography>{" "}
              for You
            </Typography>
          </Reveal>

          <Reveal delay={0.08} className="w-full min-w-0 overflow-visible">
            {/* Own size (not display) so "Potential" never gets clipped */}
            <p className="mt-3 w-full whitespace-nowrap font-display text-[clamp(1.15rem,3.4vw,1.7rem)] leading-tight font-bold tracking-tight text-[#1f2937] sm:mt-3.5">
              Unlock{" "}
              <span className="bg-gradient-to-r from-[#b56cff] via-[#9b6bff] to-[#6ea8ff] bg-clip-text text-transparent">
                Viral Potential
              </span>
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <ul className="mt-5 space-y-2.5 sm:mt-6">
              {benefits.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-[0_0_10px_rgba(139,92,246,0.45)]">
                    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
                      <path
                        d="M2.5 6.2 4.8 8.5 9.5 3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="text-[0.92rem] font-bold text-[#0f172a] sm:text-[1rem]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal from="right" delay={0.1} className="w-full">
          <div className="pt-1 sm:pt-2">
            <SmartAiAnalysisMockup />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
