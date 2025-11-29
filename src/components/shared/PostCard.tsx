import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useState } from "react";

// import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { useDeletePost } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {

  const { user } = useUserContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { mutate: deletePost, isPending: isDeletingPost } = useDeletePost();

  const handleDeletePost = () => {
    if (!post) return;

    deletePost(
      { postId: post.$id, imageId: post.imageId },
      {
        onSuccess: () => {
          toast.success("Post deleted successfully");
          setShowDeleteConfirm(false);
        },
        onError: () => {
          toast.error("Failed to delete post");
        },
      }
    );
  };

  if (!post.creator) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">

          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        {user.id === post.creator.$id && (
          <div className="flex items-center gap-2">
            <Link
              to={`/update-post/${post.$id}`}
              className="flex items-center"
            >
              <img
                src={"/assets/icons/edit.svg"}
                alt="edit"
                width={20}
                height={20}
              />
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center"
              disabled={isDeletingPost}
            >
              <img
                src="/assets/icons/delete.svg"
                alt="delete"
                width={20}
                height={20}
                className="brightness-0 invert opacity-70 hover:opacity-100"
              />
            </button>
          </div>
        )}
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      {/* {<PostStats post={post} userId={user.id} />} */}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-dark-3 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-light-1 mb-2">Delete Post?</h3>
            <p className="text-light-3 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg bg-dark-4 text-light-1 hover:bg-dark-2"
                disabled={isDeletingPost}
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                disabled={isDeletingPost}
              >
                {isDeletingPost ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;