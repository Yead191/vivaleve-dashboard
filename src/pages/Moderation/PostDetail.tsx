import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Image, Tag } from "antd";
import dayjs from "dayjs";
import {
  ArrowLeft,
  Calendar,
  Heart,
  MessageCircle,
  UserRound,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import SectionCard from "../../components/common/SectionCard";
import UserCell from "../../components/common/UserCell";
import { PostDetailSkeleton } from "../../components/common/skeletons/PageSkeletons";
import {
  getPostAuthor,
  getPostUserId,
  useGetPostByIdQuery,
} from "../../redux/apiSlices/postsApi";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: post,
    isLoading,
    isError,
    refetch,
  } = useGetPostByIdQuery(id ?? "", { skip: !id });

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (isError || !post) {
    return (
      <div className="space-y-6">
        <Button
          type="text"
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate("/moderation")}
        >
          Back
        </Button>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-rose-600">Unable to load this post.</p>
          <Button className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const author = getPostAuthor(post.user);
  const userId = getPostUserId(post.user);
  const mediaUrls = post.content;

  return (
    <div className="space-y-6">
      <Button
        type="text"
        icon={<ArrowLeft className="h-4 w-4" />}
        onClick={() => navigate("/moderation")}
      >
        Back to reports
      </Button>

      <PageHeader
        breadcrumbs={["Moderation", "Post detail"]}
        title="Post detail"
        subtitle={`Post ID · ${post._id}`}
        actions={
          <Tag color={post.type === "VIDEO" ? "purple" : "cyan"}>
            {post.type}
          </Tag>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <SectionCard title="Content">
            <p className="mb-4 text-[14px] leading-relaxed text-gray-800">
              {post.description}
            </p>

            {mediaUrls.length > 0 ? (
              <Image.PreviewGroup>
                <div
                  className={`grid gap-3 ${
                    mediaUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {mediaUrls.map((url, index) =>
                    post.type === "VIDEO" ? (
                      <video
                        key={`${url}-${index}`}
                        src={url}
                        controls
                        className="w-full rounded-xl border border-gray-200 bg-black"
                      />
                    ) : (
                      <Image
                        key={`${url}-${index}`}
                        src={url}
                        alt={`Post media ${index + 1}`}
                        width="100%"
                        style={{
                          width: "100%",
                          maxHeight: 480,
                          objectFit: "cover",
                          borderRadius: 12,
                        }}
                        rootClassName="!block overflow-hidden rounded-xl border border-gray-200"
                        fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='200' viewBox='0 0 320 200'%3E%3Crect width='320' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14'%3EImage unavailable%3C/text%3E%3C/svg%3E"
                      />
                    ),
                  )}
                </div>
              </Image.PreviewGroup>
            ) : (
              <p className="text-sm text-gray-500">No media attached.</p>
            )}
          </SectionCard>

          <SectionCard title="Engagement">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <StatItem
                icon={<Heart className="h-4 w-4" />}
                label="Likes"
                value={post.likeCount}
              />
              <StatItem
                icon={<MessageCircle className="h-4 w-4" />}
                label="Comments"
                value={post.commentCount}
              />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Posted by">
            <div className="space-y-4">
              <UserCell
                name={author?.name ?? "Unknown user"}
                email={author?.email}
              />

              <Link to={`/users/${userId}`}>
                <Button
                  block
                  type="primary"
                  icon={<UserRound className="h-4 w-4" />}
                >
                  View user profile
                </Button>
              </Link>
            </div>
          </SectionCard>

          <SectionCard title="Post info">
            <div className="space-y-3 text-[13px]">
              <InfoRow
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="Created"
                value={dayjs(post.createdAt).format("MMM D, YYYY h:mm A")}
              />
              <InfoRow
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="Updated"
                value={dayjs(post.updatedAt).format("MMM D, YYYY h:mm A")}
              />
              <InfoRow label="Type" value={post.type} />
              <InfoRow label="Media count" value={String(post.content.length)} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <span className="text-[#287D89]">{icon}</span>
      <div>
        <div className="text-[11px] uppercase tracking-wide text-gray-500">
          {label}
        </div>
        <div className="text-[18px] font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
        {icon}
        {label}
      </span>
      <span className="text-right text-[13px] font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
}
