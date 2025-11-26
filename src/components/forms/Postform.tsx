import { PostValidation } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { Models } from 'appwrite'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '@/context/AuthContext'
import { useCreatePost, useUpdatePost } from '@/lib/react-query/queriesAndMutations'
import { Textarea } from '../ui/textarea'
import FileUploader from '../shared/FileUploader'
import VerificationRequired from '../shared/VerificationRequired'

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};
const Postform = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { user, isEmailVerified } = useUserContext();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post?.caption ?? "",
      file: [],
      location: post?.location ?? "",
      tags: Array.isArray(post?.tags) ? post.tags.join(",") : "",
    }
  })
  //Query
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  //handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {

    if (!isEmailVerified) {
      toast.error("Please verify your email to create or update posts");
      return;
    }

    // ACTION = UPDATE
    if (post && action === "Update") {
      const updatedPost = await updatePost({
        ...value,
        postId: post.$id,
        imageId: post.imageId,
        imageUrl: post.imageUrl,
      });
      console.log("The values are", value, post, updatedPost)
      if (!updatedPost) {
        toast(`${action} post failed. Please try again.`);
      }
      return navigate(`/posts/${post.$id}`);
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...value,
      userId: user.id,
    });

    if (!newPost) {
      toast(`${action} post failed. Please try again.`,
      );
    }
    navigate("/");
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">

        {!isEmailVerified && (
          <VerificationRequired message="Please verify your email to create or update posts" />
        )}

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea "
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate || !isEmailVerified}>
            {(isLoadingCreate || isLoadingUpdate) && 'Loading...'}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default Postform