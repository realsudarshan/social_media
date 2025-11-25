
import { useMemo, useState } from "react";
import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner";

const AllUsers = () => {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);

  const {
    data: creators,
    isLoading,
    isError: isErrorCreators,
  } = useGetUsers();

  const filteredCreators = useMemo(() => {
    if (!creators?.documents) return [];
    if (!debouncedSearch) return creators.documents;

    return creators.documents.filter((creator: any) => {
      const query = debouncedSearch.toLowerCase();
      const name = creator?.name?.toLowerCase() ?? "";
      const username = creator?.username?.toLowerCase() ?? "";

      return name.includes(query) || username.includes(query);
    });
  }, [creators, debouncedSearch]);

  if (isErrorCreators) {
    toast.error("Unable to load people, please try again.");
    return null;
  }

  const showEmptyState = !isLoading && filteredCreators.length === 0;

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>

        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4 mt-6">
          <img
            src="/assets/icons/search.svg"
            width={20}
            height={20}
            alt="search people"
          />
          <Input
            type="text"
            placeholder="Search people"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {isLoading && !creators ? (
          <Loader />
        ) : showEmptyState ? (
          <p className="text-light-4 mt-10 text-center w-full">
            No matching people found
          </p>
        ) : (
          <ul className="user-grid">
            {filteredCreators.map((creator: any) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;