import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetCurrentUser, useFollowUser, useUnfollowUser } from "@/lib/react-query/queriesAndMutations";
import { checkUserFollowStatus } from "@/lib/appwrite/api";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "../ui/button";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { isEmailVerified } = useUserContext();
  const { data: currentUser } = useGetCurrentUser();
  const { mutate: followUser, isPending: isFollowing } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowing } = useUnfollowUser();
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (currentUser && user) {
        setIsCheckingStatus(true);
        const followStatus = await checkUserFollowStatus(currentUser.$id, user.$id);
        setIsFollowingUser(!!followStatus);
        setIsCheckingStatus(false);
      } else {
        setIsCheckingStatus(false);
      }
    };

    checkFollowStatus();
  }, [currentUser, user]);

  const handleFollowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) return;

    if (!isEmailVerified) {
      toast.error("Please verify your email to follow users");
      return;
    }

    const refreshFollowStatus = async () => {
      if (currentUser && user) {
        const followStatus = await checkUserFollowStatus(currentUser.$id, user.$id);
        setIsFollowingUser(!!followStatus);
      }
    };

    if (isFollowingUser) {
      unfollowUser(
        { userId: currentUser.$id, followUserId: user.$id },
        {
          onSuccess: () => {
            refreshFollowStatus(); // Re-check status after unfollow
          },
        }
      );
    } else {


      followUser(
        { userId: currentUser.$id, followUserId: user.$id },
        {
          onSuccess: () => {
            refreshFollowStatus(); // Re-check status after follow
          },
        }
      );
    }
  };

  // Don't show follow button if viewing own profile
  const isCurrentUser = currentUser?.$id === user.$id;

  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      {!isCurrentUser && (
        <Button
          type="button"
          size="sm"
          className={`shad-button_primary px-5 ${isFollowingUser ? "shad-button_dark_4" : ""}`}
          onClick={handleFollowClick}
          disabled={isCheckingStatus || isFollowing || isUnfollowing || !isEmailVerified}
        >
          {isCheckingStatus || isFollowing || isUnfollowing
            ? "..."
            : isFollowingUser
              ? "Unfollow"
              : "Follow"}
        </Button>
      )}
    </Link>
  );
};

export default UserCard;
