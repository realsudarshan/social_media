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
import { ForgotPasswordValidation } from '@/lib/validation';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreatePasswordRecovery } from '@/lib/react-query/queriesAndMutations';
import { useState } from 'react';
import Logo from '@/components/shared/Logo';

const ForgotPassword = () => {
    const [emailSent, setEmailSent] = useState(false);
    const { mutateAsync: createPasswordRecovery, isPending } = useCreatePasswordRecovery();

    const form = useForm<z.infer<typeof ForgotPasswordValidation>>({
        resolver: zodResolver(ForgotPasswordValidation),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof ForgotPasswordValidation>) {
        try {
            await createPasswordRecovery(values.email);
            setEmailSent(true);
            toast.success('Password reset email sent! Please check your inbox.');
        } catch (error) {
            toast.error('Failed to send reset email. Please try again.');
        }
    }

    if (emailSent) {
        return (
            <div className='sm:w-[420px] flex-center flex-col'>
                <div className='flex-center flex-col mb-6'>
                    <Logo size="large" />
                </div>
                <h1 className='mt-8'>Check your email</h1>
                <p className='text-light-3 small-medium md:base-regular mt-2 text-center'>
                    We've sent a password reset link to <strong>{form.getValues('email')}</strong>
                </p>
                <p className='text-light-3 small-medium md:base-regular mt-4 text-center'>
                    The link will expire in 1 hour.
                </p>
                <Link to="/sign-in" className='text-primary-500 text-small-semibold ml-1 mt-6'>
                    Back to Sign In
                </Link>
            </div>
        );
    }

    return (
        <Form {...form}>
            <div className='sm:w-[420px] flex-center flex-col mb-6'>
                <Logo size="large" />
            </div>
            <h1>Forgot Password</h1>
            <p className='text-light-3 small-medium md:base-regular mt-2'>
                Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className='shad-button_primary' disabled={isPending}>
                    {isPending ? "Sending..." : "Send Reset Link"}
                </Button>

                <p className='text-small-regular text-center mt-2'>
                    Remember your password?{' '}
                    <Link to="/sign-in" className='text-primary-500 text-small-semibold ml-1'>
                        Sign In
                    </Link>
                </p>
            </form>
        </Form>
    );
};

export default ForgotPassword;
