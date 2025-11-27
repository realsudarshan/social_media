import Postform from '@/components/forms/Postform';
import { useUserContext } from '@/context/AuthContext';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CreatePost = () => {
  const { isEmailVerified } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEmailVerified) {
      toast.error("Please verify your email to create posts");
      navigate('/');
    }
  }, [isEmailVerified, navigate]);

  if (!isEmailVerified) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>

        <Postform action="Create" />
      </div>
    </div>
  );
}

export default CreatePost