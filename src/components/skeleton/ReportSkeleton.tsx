import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ReportSkeleton() {
  return (
    <main className="flex flex-col items-center px-6 py-12 gap-12 min-h-screen bg-background">
      {/* Title */}
      <Skeleton className="h-8 w-48" />

      {/* Stats Row */}
      <div className="flex flex-wrap justify-center items-center gap-12">
        {/* Circular Progress Placeholder */}
        <div className="relative w-40 h-40 flex items-center justify-center rounded-full bg-muted">
          <Skeleton className="absolute w-16 h-4 rounded bg-background/80" />
        </div>

        {/* Streak Placeholder */}
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="w-14 h-14 rounded-full" />
          <Skeleton className="w-16 h-3 rounded" />
        </div>

        {/* Overview Placeholder */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-12 h-5" />
          <Skeleton className="w-20 h-4 mt-4" />
          <Skeleton className="w-12 h-5" />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
        <Card className="bg-card border-none shadow-sm">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-[220px] w-full rounded-md" />
          </CardContent>
        </Card>

        <Card className="bg-card border-none shadow-sm">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-[220px] w-full rounded-md" />
          </CardContent>
        </Card>
      </div>

      {/* AI Summary Section */}
      <Card className="bg-card border-none shadow-sm w-full max-w-3xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-6 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}