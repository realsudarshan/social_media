import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Models } from "appwrite";

import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserCard from "@/components/shared/UserCard";
import { useGetPosts, useGetUsers } from "@/lib/react-query/queriesAndMutations";

const Home = () => {
  const { ref, inView } = useInView();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useGetPosts();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(6);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="flex-center w-full h-full">
        <p className="text-light-4">Failed to load your feed.</p>
      </div>
    );
  }

  const posts: Models.Document[] =
    data?.pages.flatMap((page) => page?.documents ?? []) ?? [];

  const showEmptyState = !isLoading && posts.length === 0;

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isLoading && posts.length === 0 ? (
            <Loader />
          ) : showEmptyState ? (
            <p className="text-light-4 mt-10 text-center w-full">
              No posts to show yet.
            </p>
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}

          {hasNextPage && (
            <div ref={ref} className="flex-center w-full mt-10 h-10">
              {isFetchingNextPage && <Loader />}
            </div>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : isErrorCreators ? (
          <p className="text-light-4 mt-4">Unable to load creators.</p>
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6 mt-6">
            {creators?.documents?.slice(0, 6).map((creator: any) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;