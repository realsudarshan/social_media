import { AlertCircle } from 'lucide-react';

interface VerificationRequiredProps {
    message?: string;
    className?: string;
}

const VerificationRequired = ({
    message = "Please verify your email to use this feature",
    className = ""
}: VerificationRequiredProps) => {
    return (
        <div className={`flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg ${className}`}>
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <p className="text-sm text-yellow-500">{message}</p>
        </div>
    );
};

export default VerificationRequired;
