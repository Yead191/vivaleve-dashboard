import { Users, Activity, UserPlus, Heart, Flag } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import { StatCardsSkeleton } from "../../components/common/skeletons/PageSkeletons";
import { useGetOverviewQuery } from "../../redux/apiSlices/overviewApi";

export default function StatsRow() {
  const { data, isLoading, isError } = useGetOverviewQuery();

  if (isLoading) {
    return <StatCardsSkeleton count={5} />;
  }

  return (
    <div>
      {isError && (
        <p className="mb-3 text-sm text-rose-600">
          Unable to load dashboard overview.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Total users"
          value={data?.totalUser?.toLocaleString() ?? "--"}
          sub="all users"
          icon={Users}
          tone="brand"
        />

        <StatCard
          label="Active today"
          value={data?.activeToday?.toLocaleString() ?? "--"}
          sub="today"
          icon={Activity}
          tone="indigo"
        />

        <StatCard
          label="New signups"
          value={data?.newSignupUser?.toLocaleString() ?? "--"}
          sub="new users"
          icon={UserPlus}
          tone="green"
        />

        <StatCard
          label="Total matches made"
          value={data?.totalMatchesUser?.toLocaleString() ?? "--"}
          sub="all time"
          icon={Heart}
          tone="rose"
        />

        <StatCard
          label="Open reports"
          value={data?.openReport?.toLocaleString() ?? "--"}
          sub="pending review"
          icon={Flag}
          tone="amber"
        />
      </div>
    </div>
  );
}
