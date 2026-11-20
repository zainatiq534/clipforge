"use client";

import { BrainstormCard } from "@/components/dashboard/BrainstormCard";
import { CalendarCard } from "@/components/dashboard/CalendarCard";
import { DashboardBanner } from "@/components/dashboard/DashboardBanner";
import { DashboardHoverCard } from "@/components/dashboard/DashboardHoverCard";
import { DataCard } from "@/components/dashboard/DataCard";
import { ImpactCard } from "@/components/dashboard/ImpactCard";
import { LastVideosCard } from "@/components/dashboard/LastVideosCard";
import { MembersCard } from "@/components/dashboard/MembersCard";
import { NotificationsCard } from "@/components/dashboard/NotificationsCard";
import { StatisticsCard } from "@/components/dashboard/StatisticsCard";
import { UpgradeCard } from "@/components/dashboard/UpgradeCard";
import {
  useDashboardDerived,
  useDashboardHome,
  userInitials,
} from "@/components/dashboard/useDashboardHome";
import { cn } from "@/lib/cn";

export function DashboardShell() {
  const { user, storage, uploads, clips, loading, refreshing, error } =
    useDashboardHome();
  const { stats, activity, recentUploads } = useDashboardDerived(
    uploads,
    clips,
    user,
  );

  // Skeleton only on true cold start — never wipe numbers on revisit
  const cold = loading && !user && uploads.length === 0 && clips.length === 0;

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.85fr)] lg:gap-4">
      <div className="flex min-w-0 flex-col gap-3">
        {error ? (
          <p className="rounded-[14px] bg-red-50 px-3 py-2 font-sans text-[12px] text-red-700">
            {error}
          </p>
        ) : null}

        <div
          className={cn(
            "transition-opacity duration-300 ease-out",
            refreshing && !cold ? "opacity-[0.92]" : "opacity-100",
          )}
        >
          <DashboardBanner
            user={user}
            clipCount={clips.length}
            uploadCount={uploads.length}
            loading={cold}
          />
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-3 transition-opacity duration-300 ease-out xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
            refreshing && !cold ? "opacity-[0.92]" : "opacity-100",
          )}
        >
          <DashboardHoverCard>
            <MembersCard user={user} storage={storage} loading={cold} />
          </DashboardHoverCard>
          <DashboardHoverCard>
            <DataCard
              hours={stats.hours}
              clipCount={stats.clipCount}
              uploadCount={stats.uploadCount}
              storagePercent={storage?.storagePercent ?? 0}
              loading={cold}
            />
          </DashboardHoverCard>
          <DashboardHoverCard className="sm:col-span-2 lg:col-span-1">
            <ImpactCard
              ready={stats.ready}
              clips={stats.clipCount}
              avgScore={stats.avgScore}
              loading={cold}
            />
          </DashboardHoverCard>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-3 transition-opacity duration-300 ease-out xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]",
            refreshing && !cold ? "opacity-[0.92]" : "opacity-100",
          )}
        >
          <DashboardHoverCard>
            <StatisticsCard
              week={stats.week}
              month={stats.month}
              loading={cold}
            />
          </DashboardHoverCard>
          <div className="flex flex-col gap-3">
            <DashboardHoverCard>
              <BrainstormCard
                topScore={stats.topScore}
                clipCount={stats.clipCount}
              />
            </DashboardHoverCard>
            <DashboardHoverCard>
              <UpgradeCard
                planLabel={storage?.planLabel}
                storagePercent={storage?.storagePercent}
              />
            </DashboardHoverCard>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-col gap-3 transition-opacity duration-300 ease-out",
          refreshing && !cold ? "opacity-[0.92]" : "opacity-100",
        )}
      >
        <DashboardHoverCard>
          <CalendarCard />
        </DashboardHoverCard>
        <DashboardHoverCard>
          <LastVideosCard uploads={recentUploads} loading={cold} />
        </DashboardHoverCard>
        <DashboardHoverCard>
          <NotificationsCard
            items={activity}
            initials={userInitials(user)}
            loading={cold}
          />
        </DashboardHoverCard>
      </div>
    </div>
  );
}
