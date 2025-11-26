import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import {
  useCreateComment,
  useGetComments,
  useDeleteComment,
} from "@/lib/react-query/queriesAndMutations";
import { IComment } from "@/types";
import { toast } from "sonner";

type CommentsProps = {
  postId: string;
};

const Comments = ({ postId }: CommentsProps) => {
  const { user } = useUserContext();
  const [commentValue, setCommentValue] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    data: commentsData,
    isLoading,
    isError,
  } = useGetComments(postId);
  const { mutateAsync: createComment, isPending } = useCreateComment();
  const { mutateAsync: removeComment } = useDeleteComment();

  const comments: IComment[] = useMemo(() => {
    return commentsData?.documents ?? [];
  }, [commentsData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = commentValue.trim();
    if (!trimmed) return;

    setCommentValue("");

    try {
      await createComment({
        postId,
        userId: user.id,
        content: trimmed,
      });
    } catch (error) {
      toast.error("Failed to add comment. Please try again.");
      setCommentValue(trimmed);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setDeletingId(commentId);
    try {
      await removeComment({ commentId, postId });
    } catch (error) {
      toast.error("Failed to delete comment. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-dark-2 border border-dark-4 rounded-[24px] p-6 md:p-8">
      <h3 className="h3-bold text-light-1">Comments</h3>

      {isLoading ? (
        <div className="flex-center mt-6">
          <Loader />
        </div>
      ) : isError ? (
        <p className="text-red mt-6">Failed to load comments.</p>
      ) : comments.length === 0 ? (
        <p className="text-light-4 mt-6">Be the first to share your thoughts.</p>
      ) : (
        <ul className="flex flex-col gap-6 mt-6">
          {comments.map((comment) => {
            const author = comment.author;
            return (
              <li key={comment.$id} className="flex gap-4">
                <img
                  src={
                    author?.imageUrl || "/assets/icons/profile-placeholder.svg"
                  }
                  alt={author?.name || comment.userId}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex-between w-full">
                    <div>
                      <p className="small-semibold text-light-1">
                        {author?.name || "Unknown user"}
                      </p>
                      <p className="text-light-4 text-xs">
                        @{author?.username || comment.userId}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-light-4 text-xs">
                        {multiFormatDateString(comment.createdAt)}
                      </p>
                      {comment.userId === user.id && (
                        <button
                          type="button"
                          className="text-red text-xs underline disabled:opacity-50"
                          onClick={() => handleDeleteComment(comment.$id)}
                          disabled={deletingId === comment.$id}
                        >
                          {deletingId === comment.$id ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-light-2 mt-2 whitespace-pre-line break-words">
                    {comment.content}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3 mt-8">
        <Input
          type="text"
          placeholder="Write a comment..."
          className="bg-dark-3 border-dark-4 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={commentValue}
          onChange={(e) => setCommentValue(e.target.value)}
          disabled={isPending}
        />
        <Button
          type="submit"
          className="shad-button_primary whitespace-nowrap"
          disabled={isPending || !commentValue.trim()}
        >
          {isPending ? "Posting..." : "Post"}
        </Button>
      </form>
    </div>
  );
};

export default Comments;

