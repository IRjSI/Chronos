import { Skeleton } from "@/components/ui/skeleton";

export default function HomeSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </header>

        {/* BODY */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <Skeleton className="h-4 w-24 mb-4" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
              <Skeleton className="h-5 w-28 mb-3" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SECTION - PROJECTS */}
          <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
            <Skeleton className="h-4 w-32 mb-4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-8 text-center">
          <Skeleton className="h-3 w-64 mx-auto" />
        </footer>
      </div>
    </main>
  );
}