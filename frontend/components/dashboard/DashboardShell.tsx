"use client";

import { BrainstormCard } from "@/components/dashboard/BrainstormCard";
import { CalendarCard } from "@/components/dashboard/CalendarCard";
import { DashboardBanner } from "@/components/dashboard/DashboardBanner";
import { DashboardHoverCard } from "@/components/dashboard/DashboardHoverCard";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
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

export function DashboardShell() {
  const { user, storage, uploads, clips, loading, error } = useDashboardHome();
  const { stats, activity, recentUploads } = useDashboardDerived(
    uploads,
    clips,
    user,
  );

  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.85fr)] lg:gap-4">
      <div className="flex min-w-0 flex-col gap-3">
        {error ? (
          <p className="rounded-[14px] bg-red-50 px-3 py-2 font-sans text-[12px] text-red-700">
            {error}
          </p>
        ) : null}

        <DashboardMotion delay={0.12}>
          <DashboardBanner
            user={user}
            clipCount={clips.length}
            uploadCount={uploads.length}
            loading={loading}
          />
        </DashboardMotion>

        <div className="grid grid-cols-1 gap-3 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardMotion delay={0.2}>
            <DashboardHoverCard>
              <MembersCard
                user={user}
                storage={storage}
                loading={loading}
              />
            </DashboardHoverCard>
          </DashboardMotion>
          <DashboardMotion delay={0.28}>
            <DashboardHoverCard>
              <DataCard
                hours={stats.hours}
                clipCount={stats.clipCount}
                uploadCount={stats.uploadCount}
                storagePercent={storage?.storagePercent ?? 0}
                loading={loading}
              />
            </DashboardHoverCard>
          </DashboardMotion>
          <DashboardMotion delay={0.36} className="sm:col-span-2 lg:col-span-1">
            <DashboardHoverCard>
              <ImpactCard
                ready={stats.ready}
                clips={stats.clipCount}
                avgScore={stats.avgScore}
                loading={loading}
              />
            </DashboardHoverCard>
          </DashboardMotion>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
          <DashboardMotion delay={0.42}>
            <DashboardHoverCard>
              <StatisticsCard
                week={stats.week}
                month={stats.month}
                loading={loading}
              />
            </DashboardHoverCard>
          </DashboardMotion>
          <div className="flex flex-col gap-3">
            <DashboardMotion delay={0.48}>
              <DashboardHoverCard>
                <BrainstormCard
                  topScore={stats.topScore}
                  clipCount={stats.clipCount}
                />
              </DashboardHoverCard>
            </DashboardMotion>
            <DashboardMotion delay={0.54}>
              <DashboardHoverCard>
                <UpgradeCard
                  planLabel={storage?.planLabel}
                  storagePercent={storage?.storagePercent}
                />
              </DashboardHoverCard>
            </DashboardMotion>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <DashboardMotion direction="right" delay={0.22}>
          <DashboardHoverCard>
            <CalendarCard />
          </DashboardHoverCard>
        </DashboardMotion>
        <DashboardMotion direction="right" delay={0.34}>
          <DashboardHoverCard>
            <LastVideosCard uploads={recentUploads} loading={loading} />
          </DashboardHoverCard>
        </DashboardMotion>
        <DashboardMotion direction="right" delay={0.46}>
          <DashboardHoverCard>
            <NotificationsCard
              items={activity}
              initials={userInitials(user)}
              loading={loading}
            />
          </DashboardHoverCard>
        </DashboardMotion>
      </div>

    </div>
  );
}
