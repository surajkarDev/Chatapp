"use client";
import React, {
  useState,
  ChangeEvent,
  FC,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { AppDispatch, RootState } from "../redux/store/page";
import { callLoginUser } from "../redux/features/page";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchUserChats } from "../redux/features/page";
import { fetchAllUser} from "../redux/features/page";
import { selectUserToChat } from "../redux/features/page";

type Message = {
  type: string;
  content: string;
  timestamp: string;
  showEdit?: boolean;
  showReply?: boolean;
  editContent?: string;
  replyMessage?: string;
  replyTo?: Message[];
  fromUserId?: number;
  toUserId?:number;
};

const ChatApp: FC = () => {
  const [messageType, setMessageType] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [msgList,setMessageListfilter] = useState<any>([]);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const userOnline = useSelector((state: RootState) => state.user.onlineStatus);
  const userId = useSelector((state: RootState) => state.user.id);
  const [chatlist,setChatlist] = useState<any>([]);
  const [chatlistMain,setChatlistMain] = useState<any>([]);
  const userChats = useSelector((state: RootState) =>
    (state.user.chats || []).map((chat: any) => ({
      type: chat.type ?? "text",
      content: chat.content ?? "",
      timestamp: chat.timestamp ?? "",
      showEdit: false,
      showReply: false,
      editContent: "",
      replyMessage: "",
      replyTo: chat.replyTo ?? [],
      fromUserId: chat.fromUserId,
      toUserId:chat.toUserId
    }))
  );
  const [userChatsFilter ,setUserChatsFiltre] = useState<Message[]>([]);
  const existingUser = useSelector((state:RootState) => state.user.userList) || []
  const selectedFriend = useSelector((state:RootState)=> state.user.toUserId)
  const loginUser = useSelector((state:RootState)=> state.user.username);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const setUserIdforChat = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(fetchUserChats());
  }, [dispatch]);
  useEffect(()=>{
     dispatch(fetchAllUser());
  },[])
  useEffect(() => {
    const saved = localStorage.getItem("messageList");
    const parsed = saved ? JSON.parse(saved) : [];
    const initialized = parsed.map((msg: Message) => ({
      ...msg,
      showEdit: false,
      showReply: false,
      editContent: "",
      replyMessage: "",
    }));
    setMessageList(initialized);
  }, []);
  useEffect(() => {
    localStorage.setItem("messageList", JSON.stringify(messageList));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const handleSend = useCallback(async () => {
    if (!messageType.trim()) return;
    const timestamp = new Date().toLocaleTimeString();
    const newMsg: Message = {
      type: "text",
      content: messageType.trim(),
      timestamp,
      replyTo: [],
      fromUserId: userId,
      toUserId:selectedFriend
    };

    try {
      const response = await fetch("http://localhost:3001/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
      if (response.ok) {
        const result = await response.json();
        setMessageList((prev) => [...prev, result]);
        setMessageType("");
        dispatch(fetchUserChats());
        fetchChats();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [messageType, userId]);
  const fetchChats = async () => {
  const response = await fetch("http://localhost:3001/chats");
    if (response.ok) {
      const chats = await response.json();
      const storedSelectedFriend = JSON.parse(localStorage.getItem("currentUserToChat") || "null");
      const activeFriend = selectedFriend || storedSelectedFriend;

      const filteredChats = chats.filter(
        (x: any) => x.fromUserId === userId || x.toUserId === userId
      );

      const filteredChatShow = filteredChats.filter(
        (x: any) =>
          (x.fromUserId === userId && x.toUserId === activeFriend) ||
          (x.fromUserId === activeFriend && x.toUserId === userId)
      );

      const latestNew = filteredChatShow.at(-1);
      const latestOld = chatlist.at(-1);

      const isChatlistChanged =
        !latestOld ||
        !latestNew ||
        latestOld.id !== latestNew.id ||
        latestOld.content !== latestNew.content;

      const isChatlistMainChanged = filteredChats.length !== chatlistMain.length;

      if (isChatlistChanged) setChatlist(filteredChatShow);
      if (isChatlistMainChanged) setChatlistMain(filteredChats);
    }
  };
  useEffect(()=>{
    fetchChats();
  },[])
  const toggleEdit = useCallback((index: number) => {
    setMessageList((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, showEdit: !msg.showEdit, editContent: msg.content } : msg
      )
    );
  },[]);

  const toggleReply = useCallback((index: number) => {
    setMessageList((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, showReply: !msg.showReply } : msg
      )
    );
  }, []);

  const handleEditChange = (index: number, value: string) => {
    setMessageList((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, editContent: value } : msg))
    );
  };

  const handleReplyChange = (index: number, value: string) => {
    setMessageList((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, replyMessage: value } : msg))
    );
  };

  const applyEdit = (index: number) => {
    const updated = [...messageList];
    updated[index].content = updated[index].editContent || updated[index].content;
    updated[index].timestamp = new Date().toLocaleTimeString();
    updated[index].showEdit = false;
    updateMessageList(updated);
  };

  const deleteMessage = (index: number) => {
    const updated = [...messageList];
    updated.splice(index, 1);
    updateMessageList(updated);
  };

  const replyToMessage = (index: number) => {
    const replyContent = messageList[index].replyMessage?.trim();
    if (!replyContent) return;

    const reply: Message = {
      type: "reply",
      content: replyContent,
      timestamp: new Date().toLocaleTimeString(),
    };

    const updated = [...messageList];
    updated[index].replyTo = [...(updated[index].replyTo || []), reply];
    updated[index].replyMessage = "";
    updated[index].showReply = false;

    updateMessageList(updated);
  };

  const getUserLoginStatus = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const userObj = userStr ? JSON.parse(userStr) : null;
      if (!userObj?.id) return;

      const response = await fetch(`http://localhost:3001/users/${userObj.id}`);
      if (response.ok) {
        const data = await response.json();
        dispatch(callLoginUser(data));
      }
    } catch (error) {
      console.log("Failed to get user details", error);
    }
  };
  const setUserIdGlobaly = (id:number)=> {
    localStorage.setItem("currentUserToChat",JSON.stringify(id));
    setUserIdforChat(selectUserToChat(id));
    console.log("Set selectedFriend ID",id);
    console.log("chatlistMain",chatlistMain);
    let copyMain = JSON.parse(JSON.stringify(chatlistMain))
    const filteredChat = copyMain.filter((chat: any) => {
      const { toUserId, fromUserId } = chat;
      return (
        (toUserId === id && fromUserId === userId) ||
        (toUserId === userId && fromUserId === id)
      );
    });
    setChatlist(filteredChat);
    console.log("Filtered chatlist", filteredChat);
  }
  useEffect(() => {
  const stored = localStorage.getItem("currentUserToChat");
  if (stored) {
    const friendId = JSON.parse(stored);
    if (friendId) {
      setUserIdforChat(selectUserToChat(friendId));
    }
  }
}, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatlist]);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchChats();
    }, 10000); // every 10 seconds

    return () => clearInterval(interval); // cleanup
  }, [userId, selectedFriend]); // re-run if user or selected friend changes

  useEffect(() => {
    if (userOnline) {
      router.push("/chatApp");
    } else {
      router.push("/");
    }
  }, [userOnline, router]);

 useEffect(() => {
    fetchChats(); // initial fetch
    const interval = setInterval(fetchChats, 5000); // every 10 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);
  return (
    
    <div className="chatAppdata flex flex-row">
      <div className="basis-2/12">
      {/* {JSON.stringify(chatlist)} */}
        {existingUser.length > 0 ? (
          existingUser?.map((msg,i)=>(
            msg.id !== userId && (
           <div key={i} onClick={()=>setUserIdGlobaly(msg.id)} className={selectedFriend ==msg.id ?`allUserList bg-[#d4def4] mb-[21px] p-[15px] cursor-pointer capitalize activeUserChat` : `allUserList bg-[#d4def4] mb-[21px] p-[15px] cursor-pointer capitalize`}>
             <span className="flex items-center"><span className="bg-white h-10 w-10 inline-flex items-center justify-center text-[#155dfc] mr-3 rounded-full text-[27px] font-semibold">{msg.username[0]}</span><span className="capitalize">{msg.username}</span></span>
           </div>
            )
          ))
        ) : ''}
      </div>
      <div className="p-6 space-y-6 bg-white shadow-xl rounded-2xl basis-10/12">
      <div className="currentLoginUser flex items-center capitalize bg-[#155dfc] text-white p-[15px] rounded-[5px] w-[132px] h-[60px] ml-auto">
        <span className="bg-white h-10 w-10 inline-flex items-center justify-center text-[#155dfc] mr-3 rounded-full text-[27px] font-semibold">{loginUser[0]}</span> <span className="capitalize">{loginUser}</span>
      </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-700">💬 Chat App</h1>
          <p className="text-gray-500">Start chatting below 👇</p>
        </div>

        <div className="space-y-2">
          <div className="bg-gray-100 p-3 rounded-lg shadow-sm text-gray-800 max-w-max">
            👤 User: Hello!
          </div>
          <div className="bg-blue-100 p-3 rounded-lg shadow-sm text-blue-800 max-w-max">
            🤖 Bot: Hi there! How can I help you today?
          </div>
        </div>

        <div className="space-y-4 h-full max-h-80 overflow-y-auto p-4 border border-gray-200 rounded-lg" ref={bottomRef}>
          {chatlist.length === 0 ? (
            <div className="text-center text-gray-400 py-8 h-full flex items-center justify-center">
              No messages yet. Start the conversation!
            </div>
          ) : (
            chatlist.map((msg, i) => (
              <MessageBubble
                key={i}
                index={i}
                message={msg}
                toggleEdit={toggleEdit}
                toggleReply={toggleReply}
                handleEditChange={handleEditChange}
                applyEdit={applyEdit}
                deleteMessage={deleteMessage}
                handleReplyChange={handleReplyChange}
                replyToMessage={replyToMessage}
                userId={userId}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <input
            type="text"
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Type your message..."
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

type BubbleProps = {
  index: number;
  message: Message;
  userId:number;
  toggleEdit: (index: number) => void;
  toggleReply: (index: number) => void;
  handleEditChange: (index: number, value: string) => void;
  handleReplyChange: (index: number, value: string) => void;
  applyEdit: (index: number) => void;
  deleteMessage: (index: number) => void;
  replyToMessage: (index: number) => void;
};

const MessageBubble: FC<BubbleProps> = ({
  index,
  message,
  userId,
  toggleEdit,
  toggleReply,
  handleEditChange,
  handleReplyChange,
  applyEdit,
  deleteMessage,
  replyToMessage,
}) => (
  <div
    className={`relative p-4 rounded-xl shadow-sm border w-[80%] ${
      message.fromUserId === userId
        ? "bg-white border-gray-200 ml-auto"
        : "bg-blue-50 border-blue-200"
    }`}
  >
    {message.fromUserId === userId && (
      <div className="absolute top-2 right-2 flex gap-2 text-sm">
        <button onClick={() => toggleReply(index)} title="Reply">
          ↩️
        </button>
        <button onClick={() => toggleEdit(index)} title="Edit">
          ✏️
        </button>
        <button onClick={() => deleteMessage(index)} title="Delete">
          🗑️
        </button>
      </div>
    )}

    <p className="text-gray-800 whitespace-pre-line mb-1">{message.content}</p>
    <span className="text-xs text-gray-400">{message.timestamp}</span>

    {message.replyTo && message.replyTo.length > 0 && (
      <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1">
        <h3 className="text-sm font-semibold text-gray-600">Replies:</h3>
        {message.replyTo.map((reply, idx) => (
          <div key={idx} className="text-sm text-gray-700">
            {reply.content}
            <span className="text-xs text-gray-400 ml-2">
              ({reply.timestamp})
            </span>
          </div>
        ))}
      </div>
    )}

    {message.showEdit && (
      <div className="flex items-center gap-2 mt-3">
        <input
          autoFocus
          type="text"
          value={message.editContent ?? ""}
          onChange={(e) => handleEditChange(index, e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none"
          placeholder="Edit message..."
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          onClick={() => applyEdit(index)}
        >
          Save
        </button>
      </div>
    )}

    {message.showReply && (
      <div className="flex items-center gap-2 mt-3">
        <input
          autoFocus
          type="text"
          value={message.replyMessage ?? ""}
          onChange={(e) => handleReplyChange(index, e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none"
          placeholder="Write a reply..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => replyToMessage(index)}
        >
          Reply
        </button>
      </div>
    )}
  </div>
);

export default ChatApp;
