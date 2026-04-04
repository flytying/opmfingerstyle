import { createClient } from "@/lib/supabase/server";
import { ReportActions } from "./actions-client";

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const { data: reports } = await supabase
    .from("video_reports")
    .select("*, guitarist_videos(id, title, youtube_url, guitarist_id, guitarists(id, display_name, strikes, approval_status))")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Video Reports</h1>
      <p className="mt-1 text-muted">Review reported videos. Removing a video adds a strike to the guitarist.</p>

      <div className="mt-6 space-y-4">
        {reports && reports.length > 0 ? (
          reports.map((report) => {
            const video = report.guitarist_videos as { id: string; title: string; youtube_url: string; guitarist_id: string; guitarists: { id: string; display_name: string; strikes: number; approval_status: string } | null } | null;
            const guitarist = video?.guitarists;

            return (
              <div
                key={report.id}
                className={`rounded-xl border p-6 ${
                  report.status === "pending"
                    ? "border-red-200 bg-red-50"
                    : "border-border bg-background"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {video?.title || "Deleted Video"}
                      </h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        report.status === "pending" ? "bg-red-200 text-red-800" :
                        report.status === "actioned" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      Reported: <span className="font-medium">{report.reason}</span>
                      {" · "}
                      {new Date(report.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"
                      })}
                    </p>
                    {guitarist && (
                      <p className="mt-1 text-sm text-muted">
                        Guitarist: <span className="font-medium">{guitarist.display_name}</span>
                        {" · "}Strikes: <span className={`font-medium ${guitarist.strikes >= 2 ? "text-red-600" : ""}`}>{guitarist.strikes}/3</span>
                        {guitarist.approval_status !== "approved" && (
                          <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">Disabled</span>
                        )}
                      </p>
                    )}
                    {video?.youtube_url && (
                      <a href={video.youtube_url} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-primary hover:text-primary-hover">
                        Watch on YouTube &rarr;
                      </a>
                    )}
                  </div>
                  {report.status === "pending" && video && (
                    <ReportActions reportId={report.id} videoId={video.id} guitaristId={guitarist?.id || ""} />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl border border-border bg-background px-6 py-16 text-center">
            <p className="text-lg text-muted">No reports yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
