import { useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { follow, unfollow } from "@/api/follow";
import type { SearchUserDTO } from "@/api/search";

interface FollowButtonProps {
    user: SearchUserDTO;
    onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({ user, onFollowChange }: FollowButtonProps) {
    const { user: currentUser } = useAuth();
    const [isFollowing, setIsFollowing] = useState(!!user.isFollowed);
    const [isLoading, setIsLoading] = useState(false);

    const handleFollowToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUser) return;
        if (isLoading) return;

        setIsLoading(true);
        try {
            if (isFollowing) {
                await unfollow(currentUser.id, user.id);
                setIsFollowing(false);
                onFollowChange?.(false);
            } else {
                await follow(currentUser.id, user.id);
                setIsFollowing(true);
                onFollowChange?.(true);
            }
        } catch (error) {
            console.error("Failed to toggle follow", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (currentUser?.id === user.id) return null;

    return (
        <button
            onClick={handleFollowToggle}
            disabled={isLoading}
            className={`px-6 py-1 rounded-lg font-semibold transition-colors ${isFollowing
                    ? "bg-gray-600 text-white hover:bg-gray-500"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
        >
            {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
        </button>
    );
}
