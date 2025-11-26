import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmVerification } from "@/lib/appwrite/api";
import { Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");
    const navigate = useNavigate();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        if (userId && secret) {
            confirmVerification(userId, secret)
                .then(() => {
                    setStatus("success");
                })
                .catch(() => {
                    setStatus("error");
                });
        } else {
            setStatus("error");
        }
    }, [userId, secret]);

    return (
        <div className="flex-center flex-col min-h-screen w-full py-10">
            {status === "loading" && (
                <div className="flex-center flex-col gap-2">
                    <Loader />
                    <p className="text-light-2 small-medium md:base-regular">
                        Verifying your email...
                    </p>
                </div>
            )}

            {status === "success" && (
                <div className="flex-center flex-col gap-4">
                    <h2 className="h2-bold md:h2-bold pt-5 sm:pt-12">
                        Email Verified!
                    </h2>
                    <p className="text-light-3 small-medium md:base-regular text-center">
                        Your email has been successfully verified. You can now sign in.
                    </p>
                    <Button onClick={() => navigate("/sign-in")}>
                        Sign In
                    </Button>
                </div>
            )}

            {status === "error" && (
                <div className="flex-center flex-col gap-4">
                    <h2 className="h2-bold md:h2-bold pt-5 sm:pt-12 text-red">
                        Verification Failed
                    </h2>
                    <p className="text-light-3 small-medium md:base-regular text-center">
                        We couldn't verify your email. The link may be invalid or expired.
                    </p>
                    <Button onClick={() => navigate("/sign-in")}>
                        Back to Sign In
                    </Button>
                </div>
            )}
        </div>
    );
};

export default VerifyEmail;
