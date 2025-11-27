import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { SignupValidation } from '@/lib/validation'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import Logo from '@/components/shared/Logo'

const SignupForm = () => {
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: _isSigningIn } = useSignInAccount();
  const { checkAuthUser, isLoading: _isUserLoading } = useUserContext()
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: ""
    },
  })
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (!newUser) {
      return toast.error('Sign up failed')

    }
    toast.success('Signed up sucessfully')
    console.log("Before making session")
    const session = await signInAccount({
      email: values.email,
      password: values.password
    });
    console.log(session)
    if (!session) {
      return toast.error('Sign in failed.Please try again')
    }
    const isLoggedIn = await checkAuthUser();
    console.log("Is user logged in,isLoggedIn")
    if (isLoggedIn) {
      form.reset();
      navigate('/')
    } else {
      return toast.error("Sign in failed")
    }
  }
  return (
    <Form {...form}>
      <div className='sm:w-[420px] flex-center flex-col mb-6'>
        <Logo size="large" />
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                Enter your password
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {isCreatingUser ? "Loading..." : "Submit"}</Button>
        <p className='text-small-regular'>Already have an account?</p>
        <Link to="/sign-in">Login</Link>
      </form>
    </Form>
  )
}

export default SignupForm