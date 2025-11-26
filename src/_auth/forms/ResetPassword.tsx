import { Button } from '@/components/ui/button';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ResetPasswordValidation } from '@/lib/validation';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useUpdatePasswordRecovery } from '@/lib/react-query/queriesAndMutations';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    const { mutateAsync: updatePasswordRecovery, isPending } = useUpdatePasswordRecovery();

    const form = useForm<z.infer<typeof ResetPasswordValidation>>({
        resolver: zodResolver(ResetPasswordValidation),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof ResetPasswordValidation>) {
        if (!userId || !secret) return;

        try {
            await updatePasswordRecovery({
                userId,
                secret,
                password: values.password,
            });
            toast.success('Password reset successful! Please sign in with your new password.');
            navigate('/sign-in');
        } catch (error) {
            toast.error('Failed to reset password. The link may have expired.');
        }
    }

    if (!userId || !secret) {
        return (
            <div className='sm:w-[420px] flex-center flex-col'>
                <img src='/assets/images/logo.svg' alt="Logo" />
                <h1 className='mt-8'>Invalid Reset Link</h1>
                <p className='text-light-3 small-medium md:base-regular mt-2 text-center'>
                    This password reset link is invalid or has expired.
                </p>
                <p className='text-light-3 small-medium md:base-regular mt-4 text-center'>
                    Please request a new password reset link.
                </p>
                <Button onClick={() => navigate('/forgot-password')} className='mt-6'>
                    Request New Link
                </Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <div className='sm:w-[420px] flex-center flex-col'>
                <img src='/assets/images/logo.svg' alt="Logo" />
            </div>
            <h1>Reset Password</h1>
            <p className='text-light-3 small-medium md:base-regular mt-2'>
                Enter your new password below.
            </p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Enter new password" {...field} />
                            </FormControl>
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
                                <Input type="password" placeholder="Confirm new password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className='shad-button_primary' disabled={isPending}>
                    {isPending ? "Resetting..." : "Reset Password"}
                </Button>
            </form>
        </Form>
    );
};

export default ResetPassword;
