import React from "react";

interface User {
  id: number;
  username: string;
}

interface Props {
  users: User[];
  currentUserId: number;
  selectedFriendId: number | undefined;
  onSelect: (id: number) => void;
}

const ChatSidebar: React.FC<Props> = ({
  users,
  currentUserId,
  selectedFriendId,
  onSelect,
}) => {
  return (
    <div className="basis-2/12">
      {users.map((user, i) =>
        user.id !== currentUserId ? (
          <div
            key={i}
            onClick={() => onSelect(user.id)}
            className={`allUserList bg-[#d4def4] mb-[21px] p-[15px] cursor-pointer capitalize ${
              selectedFriendId === user.id ? "activeUserChat" : ""
            }`}
          >
            <span className="flex items-center">
              <span className="bg-white h-10 w-10 inline-flex items-center justify-center text-[#155dfc] mr-3 rounded-full text-[27px] font-semibold">
                {user.username[0]}
              </span>
              <span className="capitalize">{user.username}</span>
            </span>
          </div>
        ) : null
      )}
    </div>
  );
};

export default ChatSidebar;
