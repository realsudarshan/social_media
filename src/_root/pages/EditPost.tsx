import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Loader from '@/components/shared/Loader';

import Postform from "@/components/forms/Postform";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "sonner";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isLoading } = useGetPostById(id);
  const { isEmailVerified } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEmailVerified) {
      toast.error("Please verify your email to edit posts");
      navigate('/');
    }
  }, [isEmailVerified, navigate]);

  if (!isEmailVerified) {
    return null;
  }

  if (isLoading)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {isLoading ? <Loader /> : <Postform action="Update" post={post} />}
      </div>
    </div>
  );
};

export default EditPost;
