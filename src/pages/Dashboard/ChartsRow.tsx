import SectionCard from "../../components/common/SectionCard";
import BarChartCard from "../../components/charts/BarChartCard";
import { ChartSkeleton } from "../../components/common/skeletons/PageSkeletons";
import {
  useGetNewUsersActivityQuery,
  useGetUserActivityQuery,
} from "../../redux/apiSlices/overviewApi";

export default function ChartsRow() {
  const { data: userActivity = [], isLoading, isError } =
    useGetUserActivityQuery();
  const {
    data: newUserActivity = [],
    isLoading: isNewUserActivityLoading,
    isError: isNewUserActivityError,
  } = useGetNewUsersActivityQuery();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <SectionCard title="Daily active users" description="Last 30 days">
        {isLoading ? (
          <ChartSkeleton />
        ) : isError ? (
          <div className="flex h-60 items-center justify-center text-sm text-rose-600">
            Unable to load user activity.
          </div>
        ) : (
          <BarChartCard
            data={userActivity}
            dataKey="activeCount"
            xKey="day"
          />
        )}
      </SectionCard>
      <SectionCard title="New signups" description="Last 30 days">
        {isNewUserActivityLoading ? (
          <ChartSkeleton />
        ) : isNewUserActivityError ? (
          <div className="flex h-60 items-center justify-center text-sm text-rose-600">
            Unable to load new user activity.
          </div>
        ) : (
          <BarChartCard
            data={newUserActivity}
            dataKey="newUser"
            xKey="day"
          />
        )}
      </SectionCard>
    </div>
  );
}
