import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
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
import { ResetPasswordValidation } from '@/lib/validation'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useUpdatePasswordAfterRecovery } from '@/lib/react-query/queriesAndMutations'

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');
    const [isSuccess, setIsSuccess] = useState(false);

    const { mutateAsync: updatePassword, isPending } = useUpdatePasswordAfterRecovery();

    const form = useForm<z.infer<typeof ResetPasswordValidation>>({
        resolver: zodResolver(ResetPasswordValidation),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    useEffect(() => {
        if (!userId || !secret) {
            toast.error('Invalid reset link');
            navigate('/sign-in');
        }
    }, [userId, secret, navigate]);

    async function onSubmit(values: z.infer<typeof ResetPasswordValidation>) {
        if (!userId || !secret) {
            toast.error('Invalid reset link');
            return;
        }

        try {
            await updatePassword({
                userId,
                secret,
                newPassword: values.password,
            });
            setIsSuccess(true);
            toast.success('Password reset successful!');
            setTimeout(() => {
                navigate('/sign-in');
            }, 2000);
        } catch (error: any) {
            console.error(error);
            toast.error('Failed to reset password. The link may have expired.');
        }
    }

    if (isSuccess) {
        return (
            <div className='sm:w-[420px] flex-center flex-col'>
                <img src='/assets/images/logo.svg' alt="logo" />
                <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>Password Reset Successful!</h2>
                <p className='text-light-3 small-medium md:base-regular mt-2 text-center'>
                    Your password has been successfully reset.
                </p>
                <p className='text-light-3 small-medium md:base-regular mt-2 text-center'>
                    Redirecting to sign in...
                </p>
            </div>
        );
    }

    return (
        <Form {...form}>
            <div className='sm:w-[420px] flex-center flex-col'>
                <img src='/assets/images/logo.svg' alt="logo" />
                <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>Reset Password</h2>
                <p className='text-light-3 small-medium md:base-regular mt-2'>
                    Enter your new password below.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Enter new password"
                                    className="shad-input"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Must be at least 8 characters
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="shad-input"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Re-enter your new password
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className='shad-button_primary' disabled={isPending}>
                    {isPending ? "Resetting..." : "Reset Password"}
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

export default ResetPassword
