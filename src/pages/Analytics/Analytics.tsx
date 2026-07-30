import { useMemo, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  BarChart3,
  Crown,
  Download,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { ChartSkeleton } from "../../components/common/skeletons/PageSkeletons";
import {
  useGetAgeDistributionAnalyticsQuery,
  useGetGenderDistributionAnalyticsQuery,
  useGetMonthlyRevenueAnalyticsQuery,
  useGetPlanDistributionAnalyticsQuery,
  useGetSwipeAnalyticsQuery,
  useGetYearlyRevenueAnalyticsQuery,
} from "../../redux/apiSlices/analyticsApi";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const COLORS = {
  teal: "#287D89",
  tealLight: "#65B9C2",
  navy: "#334E68",
  blue: "#3976D2",
  amber: "#C27A18",
  coral: "#D25B5B",
  purple: "#7659B0",
  slate: "#8492A6",
};

const PLAN_COLORS: Record<string, string> = {
  Free: COLORS.slate,
  Premium: COLORS.teal,
};

const GENDER_COLORS: Record<string, string> = {
  Women: COLORS.teal,
  Men: COLORS.blue,
  Couple: COLORS.purple,
  "Non-binary": COLORS.purple,
  "Not specified": COLORS.slate,
};



const compactNumber = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const tooltipStyle = {
  contentStyle: {
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.10)",
    fontSize: 12,
  },
  cursor: { fill: "rgba(40, 125, 137, 0.06)" },
};

const addWorksheet = (
  workbook: XLSX.WorkBook,
  sheetName: string,
  rows: Record<string, string | number>[],
) => {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
};

const downloadExcel = (workbook: XLSX.WorkBook, filename: string) => {
  XLSX.writeFile(workbook, filename);
};

type ChartCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  onRetry?: () => void;
};

function ChartCard({
  title,
  description,
  children,
  action,
  className = "",
  isLoading = false,
  error = null,
  isEmpty = false,
  onRetry,
}: ChartCardProps) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
      aria-label={title}
    >
      <div className="flex min-h-[78px] flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
        </div>
        {action}
      </div>
      <div className="p-4 sm:p-5">
        {isLoading ? (
          <ChartSkeleton height={280} />
        ) : error ? (
          <ChartError message={error} onRetry={onRetry} />
        ) : isEmpty ? (
          <ChartEmpty />
        ) : (
          children
        )}
      </div>
    </section>
  );
}

function ChartError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex h-[280px] flex-col items-center justify-center text-center"
      role="alert"
    >
      <span className="rounded-full bg-red-50 p-3 text-red-600">
        <AlertCircle size={20} aria-hidden="true" />
      </span>
      <p className="mt-3 text-sm font-medium text-gray-900">
        Chart unavailable
      </p>
      <p className="mt-1 max-w-xs text-xs text-gray-500">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#287D89]"
        >
          <RefreshCw size={14} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}

function ChartEmpty() {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center text-center">
      <span className="rounded-full bg-gray-100 p-3 text-gray-500">
        <BarChart3 size={20} aria-hidden="true" />
      </span>
      <p className="mt-3 text-sm font-medium text-gray-900">
        No data for this period
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Try changing the date range or filters.
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  icon,
}: {
  label: string;
  value: string;
  change: string;
  icon: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            {value}
          </p>
        </div>
        <span className="rounded-xl bg-[#EAF5F6] p-2.5 text-[#287D89]">
          {icon}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs">
        <TrendingUp size={14} className="text-emerald-700" aria-hidden="true" />
        <span className="font-semibold text-emerald-700">{change}</span>
        <span className="text-gray-500">vs last period</span>
      </div>
    </article>
  );
}

function DonutLegend({
  data,
  valueSuffix = "",
}: {
  data: Array<{ name: string; value: number; color: string }>;
  valueSuffix?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
      {data.map((item) => (
        <div
          key={item.name}
          className="flex min-w-0 items-center justify-between gap-2 text-xs"
        >
          <span className="flex min-w-0 items-center gap-2 text-gray-600">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate">{item.name}</span>
          </span>
          <span className="font-semibold text-gray-900">
            {valueSuffix
              ? `${item.value}${valueSuffix}`
              : `${Math.round((item.value / total) * 100)}%`}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const {
    data: swipeData = [],
    isLoading: isSwipeAnalyticsLoading,
    isError: isSwipeAnalyticsError,
    refetch: refetchSwipeAnalytics,
  } = useGetSwipeAnalyticsQuery();
  const {
    data: monthlyRevenueData = [],
    isLoading: isMonthlyRevenueLoading,
    isError: isMonthlyRevenueError,
    refetch: refetchMonthlyRevenue,
  } = useGetMonthlyRevenueAnalyticsQuery();
  const {
    data: yearlyRevenueData = [],
    isLoading: isYearlyRevenueLoading,
    isError: isYearlyRevenueError,
    refetch: refetchYearlyRevenue,
  } = useGetYearlyRevenueAnalyticsQuery();
  const {
    data: planDistribution = [],
    isLoading: isPlanDistributionLoading,
    isError: isPlanDistributionError,
    refetch: refetchPlanDistribution,
  } = useGetPlanDistributionAnalyticsQuery();
  const planData = useMemo(
    () =>
      planDistribution.map((item) => ({
        ...item,
        color: PLAN_COLORS[item.name] ?? COLORS.slate,
      })),
    [planDistribution],
  );
  const planTotalUsers = useMemo(
    () => planDistribution.reduce((sum, item) => sum + item.value, 0),
    [planDistribution],
  );
  const {
    data: genderDistribution = [],
    isLoading: isGenderDistributionLoading,
    isError: isGenderDistributionError,
    refetch: refetchGenderDistribution,
  } = useGetGenderDistributionAnalyticsQuery();
  const genderData = useMemo(
    () =>
      genderDistribution.map((item) => ({
        ...item,
        color: GENDER_COLORS[item.name] ?? COLORS.slate,
      })),
    [genderDistribution],
  );
  const genderTotalProfiles = useMemo(
    () => genderDistribution.reduce((sum, item) => sum + item.value, 0),
    [genderDistribution],
  );
  const {
    data: ageData = [],
    isLoading: isAgeDistributionLoading,
    isError: isAgeDistributionError,
    refetch: refetchAgeDistribution,
  } = useGetAgeDistributionAnalyticsQuery();
  const [revenueView, setRevenueView] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const revenueData =
    revenueView === "monthly" ? monthlyRevenueData : yearlyRevenueData;
  const isRevenueLoading =
    revenueView === "monthly"
      ? isMonthlyRevenueLoading
      : isYearlyRevenueLoading;
  const isRevenueError =
    revenueView === "monthly"
      ? isMonthlyRevenueError
      : isYearlyRevenueError;
  const refetchRevenue =
    revenueView === "monthly"
      ? refetchMonthlyRevenue
      : refetchYearlyRevenue;
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);

    try {
      const [
        swipeResult,
        monthlyResult,
        yearlyResult,
        planResult,
        genderResult,
        ageResult,
      ] = await Promise.all([
        refetchSwipeAnalytics(),
        refetchMonthlyRevenue(),
        refetchYearlyRevenue(),
        refetchPlanDistribution(),
        refetchGenderDistribution(),
        refetchAgeDistribution(),
      ]);

      const swipe = swipeResult.data ?? [];
      const monthlyRevenue = monthlyResult.data ?? [];
      const yearlyRevenue = yearlyResult.data ?? [];
      const plan = planResult.data ?? [];
      const gender = genderResult.data ?? [];
      const age = ageResult.data ?? [];

      const hasData =
        swipe.length > 0 ||
        monthlyRevenue.length > 0 ||
        yearlyRevenue.length > 0 ||
        plan.length > 0 ||
        gender.length > 0 ||
        age.length > 0;

      if (!hasData) {
        toast.warning("No analytics data available to export.");
        return;
      }

      const generatedAt = new Date().toISOString();
      const workbook = XLSX.utils.book_new();

      const overviewSheet = XLSX.utils.aoa_to_sheet([
        ["Vivaleve Analytics Report"],
        ["Generated", generatedAt],
      ]);
      XLSX.utils.book_append_sheet(workbook, overviewSheet, "Overview");

      addWorksheet(
        workbook,
        "Swipe analytics",
        swipe.map((row) => ({
          Day: row.day,
          Likes: row.likes,
          Rejects: row.rejects,
          Matches: row.matches,
        })),
      );
      addWorksheet(
        workbook,
        "Monthly revenue",
        monthlyRevenue.map((row) => ({
          Period: row.period,
          Subscriptions: row.subscriptions,
        })),
      );
      addWorksheet(
        workbook,
        "Yearly revenue",
        yearlyRevenue.map((row) => ({
          Period: row.period,
          Subscriptions: row.subscriptions,
        })),
      );
      addWorksheet(
        workbook,
        "Plan distribution",
        plan.map((row) => ({
          Plan: row.name,
          Users: row.value,
        })),
      );
      addWorksheet(
        workbook,
        "Gender distribution",
        gender.map((row) => ({
          Gender: row.name,
          Users: row.value,
        })),
      );
      addWorksheet(
        workbook,
        "Age distribution",
        age.map((row) => ({
          "Age range": row.range,
          Users: row.users,
        })),
      );

      downloadExcel(
        workbook,
        `vivaleve-analytics-${generatedAt.slice(0, 10)}.xlsx`,
      );
      toast.success("Analytics report exported.");
    } catch {
      toast.error("Unable to export analytics report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5 pb-8 sm:space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="A clear view of growth, engagement, audience and subscription performance."
        actions={
          <button
            type="button"
            onClick={() => void handleExport()}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-lg bg-[#287D89] px-3.5 py-2.5 text-sm font-medium text-white hover:bg-[#216A74] focus:outline-none focus:ring-2 focus:ring-[#287D89] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download size={16} aria-hidden="true" />
            {exporting ? "Exporting…" : "Export report"}
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard
          title="Swipe analytics"
          description="Daily likes, rejects and resulting matches."
          className="xl:col-span-2"
          isLoading={isSwipeAnalyticsLoading}
          error={
            isSwipeAnalyticsError
              ? "Unable to load weekly swipe analytics."
              : null
          }
          isEmpty={!isSwipeAnalyticsLoading && swipeData.length === 0}
          onRetry={() => void refetchSwipeAnalytics()}
        >
          <div className="h-[320px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={swipeData}
                margin={{ top: 10, right: 8, left: -4, bottom: 0 }}
                barGap={3}
              >
                <CartesianGrid
                  stroke="#EEF1F4"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#667085" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => compactNumber.format(value)}
                  tick={{ fontSize: 11, fill: "#667085" }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                  label={{
                    value: "Swipes",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#667085",
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: number, name: string) => [
                    value.toLocaleString(),
                    name,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 14 }} />
                <Bar
                  dataKey="likes"
                  name="Likes"
                  fill={COLORS.teal}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="rejects"
                  name="Rejects"
                  fill={COLORS.slate}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="matches"
                  name="Matches"
                  fill={COLORS.amber}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Subscription revenue"
          description="Revenue and successful premium subscriptions."
          className="xl:col-span-2"
          isLoading={isRevenueLoading}
          error={
            isRevenueError
              ? `Unable to load ${revenueView} subscription analytics.`
              : null
          }
          isEmpty={!isRevenueLoading && revenueData.length === 0}
          onRetry={() => void refetchRevenue()}
          action={
            <div
              className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1"
              aria-label="Revenue period"
            >
              {(["monthly", "yearly"] as const).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setRevenueView(view)}
                  aria-pressed={revenueView === view}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
                    revenueView === view
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-[320px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={revenueData}
                margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#EEF1F4"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: "#667085" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="primary"
                  tickFormatter={(value) => compactNumber.format(value)}
                  tick={{ fontSize: 11, fill: "#667085" }}
                  axisLine={false}
                  tickLine={false}
                  width={58}
                  label={{
                    value: "Subscriptions",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#667085",
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: number, name: string) => [
                    value.toLocaleString(),
                    name,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 14 }} />
                <Bar
                  yAxisId="primary"
                  dataKey="subscriptions"
                  name="Subscriptions"
                  fill={COLORS.teal}
                  radius={[5, 5, 0, 0]}
                  maxBarSize={42}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Free vs premium users"
          description="Current user base by subscription plan."
          isLoading={isPlanDistributionLoading}
          error={
            isPlanDistributionError
              ? "Unable to load plan distribution analytics."
              : null
          }
          isEmpty={!isPlanDistributionLoading && planData.length === 0}
          onRetry={() => void refetchPlanDistribution()}
        >
          <div className="relative h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {planData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: number) => value.toLocaleString()}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-gray-900">
                {compactNumber.format(planTotalUsers)}
              </span>
              <span className="text-xs text-gray-500">Total users</span>
            </div>
          </div>
          <DonutLegend data={planData} />
        </ChartCard>

        <ChartCard
          title="Gender distribution"
          description="Self-reported gender across active profiles."
          isLoading={isGenderDistributionLoading}
          error={
            isGenderDistributionError
              ? "Unable to load gender distribution analytics."
              : null
          }
          isEmpty={!isGenderDistributionLoading && genderData.length === 0}
          onRetry={() => void refetchGenderDistribution()}
        >
          <div className="relative h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {genderData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: number) => value.toLocaleString()}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-gray-900">
                {compactNumber.format(genderTotalProfiles)}
              </span>
              <span className="text-xs text-gray-500">Profiles</span>
            </div>
          </div>
          <DonutLegend data={genderData} />
        </ChartCard>

        <ChartCard
          title="User age distribution"
          description="Active user profiles grouped by age range."
          className="xl:col-span-2"
          isLoading={isAgeDistributionLoading}
          error={
            isAgeDistributionError
              ? "Unable to load age distribution analytics."
              : null
          }
          isEmpty={!isAgeDistributionLoading && ageData.length === 0}
          onRetry={() => void refetchAgeDistribution()}
        >
          <div className="h-[290px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageData}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 4, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#EEF1F4"
                  strokeDasharray="3 3"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tickFormatter={(value) => compactNumber.format(value)}
                  tick={{ fontSize: 11, fill: "#667085" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Number of users",
                    position: "insideBottom",
                    offset: -1,
                    fill: "#667085",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  dataKey="range"
                  type="category"
                  tick={{ fontSize: 11, fill: "#667085" }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    "Users",
                  ]}
                />
                <Bar
                  dataKey="users"
                  name="Users"
                  fill={COLORS.teal}
                  radius={[0, 5, 5, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
