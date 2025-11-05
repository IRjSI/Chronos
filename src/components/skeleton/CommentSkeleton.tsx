import { Skeleton } from "@/components/ui/skeleton";

export default function CommentSkeleton() {
  return (
    <main className="flex flex-col items-center px-6 py-12 gap-12 min-h-screen bg-background">
        <Skeleton className="h-8 w-48" />
    </main>
  )
};