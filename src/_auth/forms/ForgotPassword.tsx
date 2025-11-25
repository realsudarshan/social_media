import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
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
import { ForgotPasswordValidation } from '@/lib/validation'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useSendPasswordRecovery } from '@/lib/react-query/queriesAndMutations'

const ForgotPassword = () => {
    const [emailSent, setEmailSent] = useState(false);
    const { mutateAsync: sendPasswordRecovery, isPending } = useSendPasswordRecovery();

    const form = useForm<z.infer<typeof ForgotPasswordValidation>>({
        resolver: zodResolver(ForgotPasswordValidation),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof ForgotPasswordValidation>) {
        try {
            await sendPasswordRecovery(values.email);
            setEmailSent(true);
            toast.success('Password reset email sent! Check your inbox.');
        } catch (error: any) {
            console.error(error);
            if (error.message === "Email does not exist") {
                toast.error('No account found with this email address.');
            } else {
                toast.error('Failed to send reset email. Please try again.');
            }
        }
    }

    if (emailSent) {
        return (
            <div className='sm:w-[420px] flex-center flex-col'>
                <img src='/assets/images/logo.svg' alt="logo" />
                <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>Check your email</h2>
                <p className='text-light-3 small-medium md:base-regular mt-2 text-center'>
                    We've sent a password reset link to your email address.
                </p>
                <p className='text-light-3 small-medium md:base-regular mt-4 text-center'>
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                        onClick={() => setEmailSent(false)}
                        className='text-primary-500 hover:underline'
                    >
                        try again
                    </button>
                </p>
                <Link to="/sign-in" className='mt-6'>
                    <Button type="button" className='shad-button_primary'>
                        Back to Sign In
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <Form {...form}>
            <div className='sm:w-[420px] flex-center flex-col'>
                <img src='/assets/images/logo.svg' alt="logo" />
                <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>Forgot Password</h2>
                <p className='text-light-3 small-medium md:base-regular mt-2'>
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="shad-input"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                We'll send a password reset link to this email
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className='shad-button_primary' disabled={isPending}>
                    {isPending ? "Sending..." : "Send Reset Link"}
                </Button>

                <p className='text-small-regular text-light-2 text-center mt-2'>
                    Remember your password?{' '}
                    <Link to="/sign-in" className='text-primary-500 text-small-semibold ml-1'>
                        Sign in
                    </Link>
                </p>
            </form>
        </Form>
    )
}

export default ForgotPassword
