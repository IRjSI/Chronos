import { addComment, deleteComment, getComments } from "@/api/comment";
import { Input } from "@/components/ui/input";
import type { IComment } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import CommentSkeleton from "./skeleton/CommentSkeleton";

interface Props {
  content: string;
  setContent: (c: string) => void;
  expandedProjectId: string;
  user: any;
  loading: boolean;
}

export function CommentsSection({ content, setContent, expandedProjectId, user, loading }: Props) {

    const { data: comments = [], isLoading: isLoadingComment } = useQuery({
    queryKey: ["comments", expandedProjectId],
    queryFn: () => getComments(expandedProjectId!),
    enabled: !!expandedProjectId && !!user && !loading,
  })

  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: (newComment: string) => addComment(expandedProjectId!, newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", expandedProjectId] });
    },
  });

  // Edit comment
//   const editCommentMutation = useMutation({
//     mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
//       editComment(expandedProjectId!, commentId, content),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["comments", expandedProjectId] });
//     },
//   });

  // Delete comment
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", expandedProjectId] });
    },
  });

  const handleAddComment = async () => {
    if (!content.trim()) return;
    await addCommentMutation.mutateAsync(content);
    setContent("");
  };

//   const handleEditComment = async (commentId: string) => {
//     await editCommentMutation.mutateAsync({ commentId, content });
//   };

  const handleDeleteComment = async (commentId: string) => {
    await deleteCommentMutation.mutateAsync(commentId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl bg-white p-5 shadow-sm"
    >
      <h3 className="text-sm font-medium text-slate-600 mb-3">Comments</h3>

      {isLoadingComment ? <CommentSkeleton /> : <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-400">No comments yet.</p>
        ) : (
          comments.map((c: IComment) => (
            <div key={c._id} className="text-sm bg-slate-50 px-3 py-2 rounded-md flex items-center justify-between">
              {c.content}
              <Trash2 size={16} className="text-red-500" onClick={() => handleDeleteComment(c._id as string)} />
            </div>
          ))
        )}
      </div>}

      <div className="flex gap-2">
        <Input
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
        />
        <button
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
          onClick={handleAddComment}
        >
          Send
        </button>
      </div>
    </motion.div>
  );
};