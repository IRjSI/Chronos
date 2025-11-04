import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-9 w-32 rounded-lg" />
        </header>

        {/* Projects list */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 space-y-3"
            >
              {/* Project header */}
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-64" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-2 w-full rounded-full mt-2" />
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>

              {/* Expanded section mock */}
              <div className="mt-3 pl-4 border-l border-slate-200 space-y-2">
                {[...Array(2)].map((_, j) => (
                  <div
                    key={j}
                    className="flex justify-between items-center border p-3 rounded-lg"
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16 rounded-lg" />
                      <Skeleton className="h-8 w-16 rounded-lg" />
                    </div>
                  </div>
                ))}
                <Skeleton className="h-9 w-28 rounded-lg mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};