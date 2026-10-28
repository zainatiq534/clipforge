"use client";

import { BrainstormCard } from "@/components/dashboard/BrainstormCard";
import { CalendarCard } from "@/components/dashboard/CalendarCard";
import { DashboardBanner } from "@/components/dashboard/DashboardBanner";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { DataCard } from "@/components/dashboard/DataCard";
import { ImpactCard } from "@/components/dashboard/ImpactCard";
import { LastVideosCard } from "@/components/dashboard/LastVideosCard";
import { MembersCard } from "@/components/dashboard/MembersCard";
import { NotificationsCard } from "@/components/dashboard/NotificationsCard";
import { StatisticsCard } from "@/components/dashboard/StatisticsCard";
import { UpgradeCard } from "@/components/dashboard/UpgradeCard";

export function DashboardShell() {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.85fr)] lg:gap-4">
      <div className="flex min-w-0 flex-col gap-3">
        <DashboardMotion delay={0.12}>
          <DashboardBanner />
        </DashboardMotion>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <DashboardMotion delay={0.2}>
            <MembersCard />
          </DashboardMotion>
          <DashboardMotion delay={0.28}>
            <DataCard />
          </DashboardMotion>
          <DashboardMotion delay={0.36} className="sm:col-span-2 xl:col-span-1">
            <ImpactCard />
          </DashboardMotion>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
          <DashboardMotion delay={0.42}>
            <StatisticsCard />
          </DashboardMotion>
          <div className="flex flex-col gap-3">
            <DashboardMotion delay={0.48}>
              <BrainstormCard />
            </DashboardMotion>
            <DashboardMotion delay={0.54}>
              <UpgradeCard />
            </DashboardMotion>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <DashboardMotion direction="right" delay={0.22}>
          <CalendarCard />
        </DashboardMotion>
        <DashboardMotion direction="right" delay={0.34}>
          <LastVideosCard />
        </DashboardMotion>
        <DashboardMotion direction="right" delay={0.46}>
          <NotificationsCard />
        </DashboardMotion>
      </div>
    </div>
  );
}
