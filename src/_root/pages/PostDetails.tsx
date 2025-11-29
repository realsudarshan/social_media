import { Link, useNavigate, useParams } from "react-router-dom";
import { Models } from "appwrite";
import { useState } from "react";

import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import Comments from "@/components/shared/Comments";
import { useGetPostById, useDeletePost } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "sonner";

// Define the post type with all expected properties
interface IPost extends Models.Document {
  caption: string;
  imageUrl: string;
  imageId: string;
  location?: string;
  tags?: string[];
  creator: Models.Document & {
    $id: string;
    name: string;
    username: string;
    imageUrl?: string;
  };
  likes?: Models.Document[];
  $createdAt: string;
}

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
  } = useGetPostById(id || "");

  const { mutate: deletePost, isPending: isDeletingPost } = useDeletePost();

  const handleDeletePost = () => {
    if (!post) return;

    deletePost(
      { postId: post.$id, imageId: post.imageId },
      {
        onSuccess: () => {
          toast.success("Post deleted successfully");
          navigate("/");
        },
        onError: () => {
          toast.error("Failed to delete post");
        },
      }
    );
  };

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  if (isError || !post) {
    return (
      <div className="flex-center w-full h-full">
        <div className="flex flex-col items-center gap-4">
          <p className="text-light-4">Post not found.</p>
          <button
            className="shad-button_primary px-5 py-2 rounded-xl"
            onClick={() => navigate(-1)}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Type assertion with proper interface
  const typedPost = post as IPost;
  const creator = typedPost.creator;

  return (
    <div className="post_details-container">
      <div className="post_details-card">
        <img
          src={typedPost.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt={typedPost.caption}
          className="post_details-img"
        />
        <div className="post_details-info">
          <div className="flex-between w-full">
            <Link to={`/profile/${creator.$id}`} className="flex gap-4">
              <img
                src={
                  creator.imageUrl || "/assets/icons/profile-placeholder.svg"
                }
                alt={creator.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <p className="body-bold text-light-1">{creator.name}</p>
                <p className="text-light-4">@{creator.username}</p>
                <p className="text-light-4 text-sm">
                  {multiFormatDateString(typedPost.$createdAt)}
                </p>
              </div>
            </Link>

            {user.id === creator.$id && (
              <div className="flex items-center gap-3">
                <Link
                  to={`/update-post/${typedPost.$id}`}
                  className="flex items-center gap-2 text-primary-500"
                >
                  <img src="/assets/icons/edit.svg" width={20} height={20} />
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600"
                  disabled={isDeletingPost}
                >
                  <img
                    src="/assets/icons/delete.svg"
                    width={20}
                    height={20}
                    className="brightness-0 invert"
                  />
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-8">
            <p className="body-medium text-light-1">{typedPost.caption}</p>
            {typedPost.tags && typedPost.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {typedPost.tags.map((tag: string, index: number) => (
                  <li key={`${tag}-${index}`} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            )}
            {typedPost.location && (
              <p className="text-light-3 text-sm">📍 {typedPost.location}</p>
            )}
          </div>

          <div className="mt-6">
            <PostStats post={post} userId={user.id} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <Comments postId={typedPost.$id} />
      </div>

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

export default PostDetails;