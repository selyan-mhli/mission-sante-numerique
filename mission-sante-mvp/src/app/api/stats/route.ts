import { NextResponse } from "next/server";
import { getDashboardStats } from "@/services/stats.service";
import { getRecentActivities } from "@/services/activity.service";

export async function GET() {
  const [stats, recentActivity] = await Promise.all([
    getDashboardStats(),
    getRecentActivities(10),
  ]);

  return NextResponse.json({
    ...stats,
    recentActivity,
  });
}
