import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMessageProps {
  message: string;
  userImage?: string;
  userName?: string;
}

export function UserMessage({ message, userImage, userName }: UserMessageProps) {
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl px-6 py-4 max-w-2xl">
        <p className="text-white text-sm">{message}</p>
      </div>
      <Avatar className="h-9 w-9">
        <AvatarImage src={userImage} alt={userName || "User"} />
        <AvatarFallback className="bg-blue-600 text-white text-sm">
          {userName?.[0] || "U"}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
