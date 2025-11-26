import { Link } from "react-router-dom";
import Loader from "./Loader";

type FollowersModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    users: Array<{
        $id: string;
        name: string;
        username: string;
        imageUrl?: string;
    }> | undefined;
    isLoading: boolean;
};

const FollowersModal = ({
    isOpen,
    onClose,
    title,
    users,
    isLoading,
}: FollowersModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-dark-2 border border-dark-4 rounded-[24px] w-full max-w-md mx-4 max-h-[600px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-dark-4">
                    <h2 className="h3-bold text-light-1">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-light-4 hover:text-light-1 transition text-2xl font-bold w-8 h-8 flex items-center justify-center"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {isLoading ? (
                        <div className="flex-center py-10">
                            <Loader />
                        </div>
                    ) : !users || users.length === 0 ? (
                        <p className="text-light-4 text-center py-10">
                            No {title.toLowerCase()} yet
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {users.map((user) => (
                                <li key={user.$id}>
                                    <Link
                                        to={`/profile/${user.$id}`}
                                        onClick={onClose}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-4 transition"
                                    >
                                        <img
                                            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="base-medium text-light-1">{user.name}</p>
                                            <p className="small-regular text-light-3">@{user.username}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowersModal;
