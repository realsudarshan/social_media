import { Button } from '@/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { SigninValidation as SigninValidation } from '@/lib/validation'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import Logo from '@/components/shared/Logo'

const SigninForm = () => {

  const { mutateAsync: signInAccount, isPending: _isPending } = useSignInAccount();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: ""
    },
  })
  async function onSubmit(values: z.infer<typeof SigninValidation>) {

    const session = await signInAccount({
      email: values.email,
      password: values.password
    });

    if (!session) {
      return toast.error('Sign in failed.Please try again')
    }
    const isLoggedIn = await checkAuthUser();
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
      <h1>Log in</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
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
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-right">
          <Link to="/forgot-password" className="text-primary-500 text-small-semibold">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit">
          {isUserLoading ? "Loading..." : "Sign In"}</Button>
        <p className='text-small-regular'>Don't have an account?</p>
        <Link to="/sign-up">Sign-up</Link>
      </form>
    </Form>
  )
}

export default SigninForm