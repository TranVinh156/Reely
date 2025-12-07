import { useAuth } from "@/hooks/auth/useAuth"
import useUpdateProfile from "@/hooks/user/useUpdateProfile";
import { Save, UserIcon, X, Pencil } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useGetAvatarPresignedUrl } from "@/hooks/upload/usePresignedUrl";
import { useUploadFile } from "@/hooks/upload/useUploadFile";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const { user } = useAuth()
    const [formData, setFormData] = useState<{
        username: string;
        displayName: string;
        bio: string;
        avatarUrl?: string;
    }>({
        username: '',
        displayName: '',
        bio: '',
        avatarUrl: ''
    })
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutateAsync: updateProfileMutate, isPending, isError } = useUpdateProfile()
    const { mutateAsync: getPresignedUrl } = useGetAvatarPresignedUrl();
    const { uploadFile, isUploading } = useUploadFile();
    const storageUrl = 'http://localhost:9000'

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                displayName: user.displayName || '',
                bio: user.bio || '',
                avatarUrl: user.avatarUrl || ''
            })
            
            const avatar = user.avatarUrl 
                ? (user.avatarUrl.startsWith('http') ? user.avatarUrl : `${storageUrl}/${user.avatarUrl}`)
                : null;

            setPreviewAvatar(avatar);
            setSelectedFile(null);
        }
    }, [user])

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreviewAvatar(objectUrl);
        setSelectedFile(file);
    };

    const handleSave = async () => {
        try {
            let finalAvatarUrl = formData.avatarUrl;

            if (selectedFile) {
                const { uploadUrl, fileUrl } = await getPresignedUrl(selectedFile.name);
                await uploadFile(uploadUrl, selectedFile);
                finalAvatarUrl = fileUrl;
            }

            await updateProfileMutate({
                ...formData,
                avatarUrl: finalAvatarUrl
            })
            onClose()
        } catch (error) {
            console.error("Failed to update profile", error)
        }
    }

    if (!isOpen || !user) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-primary-hover w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative">
                                {previewAvatar ? (
                                    <img src={previewAvatar} alt={formData.username} className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="text-gray-600" size={60} />
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-medium">Change</span>
                            </div>
                            <div className="absolute bottom-0 right-0 bg-black p-2 rounded-full text-white shadow-lg border-4 border-primary">
                                <Pencil size={16} />
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-xl text-white">{formData.displayName}</h3>
                            <p className="text-gray-400">@{formData.username}</p>
                        </div>
                    </div>

                    <form className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white" htmlFor="username">Username</label>
                            <input
                                id="username"
                                className="w-full px-4 py-3 bg-black text-white rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white" htmlFor="displayName">Display Name</label>
                            <input
                                id="displayName"
                                className="w-full px-4 py-3 bg-black text-white rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                                type="text"
                                value={formData.displayName}
                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300" htmlFor="bio">Bio</label>
                            <textarea
                                id="bio"
                                rows={3}
                                className="w-full px-4 py-3 bg-black text-white rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Write something about yourself..."
                            />
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-white hover:bg-black transition-colors font-medium"
                        disabled={isPending}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isPending || isUploading}
                        className="px-6 py-2.5 bg-black hover:bg-white hover:text-black text-white rounded-xl flex items-center gap-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending || isUploading ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        {isPending || isUploading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditProfileModal