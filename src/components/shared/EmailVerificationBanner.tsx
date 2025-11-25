import { useUserContext } from '@/context/AuthContext';
import { Mail, X } from 'lucide-react';
import { useState } from 'react';

const EmailVerificationBanner = () => {
    const { isEmailVerified, user } = useUserContext();
    const [isDismissed, setIsDismissed] = useState(false);

    // Don't show if email is verified or banner is dismissed
    if (isEmailVerified || isDismissed) return null;

    return (
        <div className="w-full bg-primary-500 text-white py-3 px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-sm font-semibold">
                        Verification email sent!
                    </p>
                    <p className="text-xs opacity-90">
                        Please check your inbox at <span className="font-medium">{user.email}</span> and click the verification link.
                    </p>
                </div>
            </div>
            <button
                onClick={() => setIsDismissed(true)}
                className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                aria-label="Dismiss banner"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

export default EmailVerificationBanner;
