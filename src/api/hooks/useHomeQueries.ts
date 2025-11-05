import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHomeData } from "@/api/getHomeData";
import { addComment, deleteComment, editComment, getComments } from "@/api/comment";

export function useHomeQueries(user: any, loading: boolean, category: string, expandedProjectId: string | null) {
  const queryClient = useQueryClient();

  // Home data
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["homeData", category],
    queryFn: () => getHomeData(category),
    enabled: !!user && !loading,
  });

  // Comments
  const { data: comments = [], isLoading: isLoadingComment } = useQuery({
    queryKey: ["comments", expandedProjectId],
    queryFn: () => getComments(expandedProjectId!),
    enabled: !!expandedProjectId && !!user && !loading,
  });

  // Comment mutations
  const addCommentMutation = useMutation({
    mutationFn: (content: string) => addComment(expandedProjectId!, content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", expandedProjectId] }),
  });

  const editCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      editComment(expandedProjectId!, commentId, content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", expandedProjectId] }),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", expandedProjectId] }),
  });

  return {
    data,
    isLoading,
    refetch,
    comments,
    isLoadingComment,
    addCommentMutation,
    editCommentMutation,
    deleteCommentMutation,
  };
};