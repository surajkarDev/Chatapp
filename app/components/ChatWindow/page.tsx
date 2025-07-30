"use client";
import { time } from "console";
import React, { useRef, useEffect } from "react";

interface Message {
  replyTo: any;
  id: string;
  content: string;
  timestamp: string;
  showEdit?: boolean;
  showReply?: boolean;
  editContent?: string;
  replyMessage?: string;
  fromUserId: number;
  toUserId: number;
}

interface Props {
  userId: number;
  loginUser: string;
  chatlist: Message[];
  messageType: string;
  setMessageType: (val: string) => void;
  onSend: () => void;
  onReply:(val:string) => void;
  setChatlist: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatWindow: React.FC<Props> = ({ userId,
  loginUser,
  chatlist,
  messageType,
  setMessageType,
  onSend,
  onReply,
  setChatlist
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const prevLengthRef = useRef<number>(0)
  const toggleReply = (id:string) => {
    console.log("toggleReply",id);
    
  }
  const toggleEdit = (id:string) => {
    console.log("toggleEdit",id);
    setChatlist((prev)=>{
      return prev.map((msg)=> msg.id === id ? {...msg, showEdit :!msg.showEdit}: msg) 
    })
  }
  const deleteMessage = async (id: string) => {
    if (!id) return;

    console.log("deleteMessage", id);
    try {
      const response = await fetch(`http://localhost:3001/chats/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setChatlist((prev) => prev.filter((msg) => msg.id !== id));
        console.log("Message deleted successfully");
      } else {
        console.error("Failed to delete message");
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };
  const handleEditChange = (index:number, value: string) => {
   let existingChatList = [...chatlist];
   existingChatList[index].editContent = value;
   setChatlist(existingChatList);
  };
  const applyEdit = async (index:number,id:string, value: string) => {
    const response = await fetch(`http://localhost:3001/chats/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: value, editContent: '', showEdit: false })
    });
    if(response.ok){
      const updateContent = await response.json();
      setChatlist((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, content: updateContent.content, editContent: '', showEdit: false } : msg))
      );
    }
  };
  const handleReplyChange = (index: number, newReply: string) => {
    const updatedChatlist = [...chatlist];
    updatedChatlist[index].replyMessage = newReply;
    setChatlist(updatedChatlist);
    console.log("handleReplyChange",chatlist[index].replyMessage);
  };
  const replyToMessage = async (id:string,replyMessage:string) => {
    const existingChat = await fetch(`http://localhost:3001/chats/${id}`);

    if(!existingChat.ok) {
      console.error("Failed to fetch chat for reply");
      return;
    }
    let existingChatData = await existingChat.json();
    let replyTo = existingChatData.replyTo || [];

    let msg = {
      timestamp: new Date().toLocaleTimeString(),
      content: replyMessage,
      fromUserId: userId,
    }
    const updatedReplies = [...replyTo, msg];
    const response = await fetch(`http://localhost:3001/chats/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ replyTo: updatedReplies }),
    });
    if(response.ok){
      let updatedChatlist = await response.json();
      console.log("Updated chatlist after reply:", updatedChatlist);
      setChatlist((prevChatlist) =>
        prevChatlist.map((chat) =>
          chat.id === id ? { ...chat, replyTo: updatedReplies, replyMessage:'', showReply:false } : chat
        )
      );
    }
  }
  useEffect(() => {
    if (chatlist && (chatlist.length > prevLengthRef.current)) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLengthRef.current = chatlist && chatlist.length ? chatlist.length : 0;
  }, [chatlist]);

  return (
    <div className="p-6 space-y-6 bg-white shadow-xl rounded-2xl basis-10/12">
      <div className="currentLoginUser flex items-center capitalize bg-[#155dfc] text-white p-[15px] rounded-[5px] w-[132px] h-[60px] ml-auto">
        <span className="bg-white h-10 w-10 inline-flex items-center justify-center text-[#155dfc] mr-3 rounded-full text-[27px] font-semibold">
          {loginUser?.[0]}
        </span>
        <span className="capitalize">{loginUser}</span>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-700">💬 Chat App</h1>
        <p className="text-gray-500">Start chatting below 👇</p>
      </div>

      <div className="space-y-4 h-full max-h-80 overflow-y-auto p-4 border border-gray-200 rounded-lg">
        {chatlist && chatlist.length === 0 ? (
          <div className="text-center text-gray-400 py-8 h-full flex items-center justify-center">
            No messages yet. Start the conversation!
          </div>
        ) : (
         chatlist && chatlist.length > 0 && chatlist.map((msg, i) => (
            <div
              key={i}
              className={`relative p-4 rounded-xl shadow-sm border w-[80%] ${
                msg.fromUserId === userId
                  ? "bg-white border-gray-200 ml-auto"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="absolute top-2 right-2 flex gap-2 text-sm">
                
                {msg.fromUserId !== userId &&(
                  <button onClick={() => onReply(msg.id)} title="Reply">
                    ↩️
                  </button>
                )}
                {msg.fromUserId === userId &&(
                  <button onClick={() => toggleEdit(msg.id)} title="Edit">
                    ✏️
                  </button>
                )}
                {msg.fromUserId === userId &&(
                  <button onClick={() => deleteMessage(msg.id)} title="Delete">
                    🗑️
                  </button>
                )}
              </div>
              <p className="text-gray-800 whitespace-pre-line mb-1">
                {msg.content}
              </p>
              <span className="text-xs text-gray-400">{msg.timestamp}</span>

              {msg.replyTo && msg.replyTo.length > 0 && (
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1">
                  <h3 className="text-sm font-semibold text-gray-600">Replies:</h3>
                  {msg.replyTo.map((reply: any, idx: number) => (
                    <div key={idx} className="text-sm text-gray-700">
                      {reply.content}
                      <span className="text-xs text-gray-400 ml-2">
                        ({reply.timestamp})
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {msg.showEdit && (
                <div className="flex items-center gap-2 mt-3">
                  <input
                    autoFocus
                    type="text"
                    value={msg.editContent ?? ""}
                    onChange={(e) => handleEditChange(i, e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none"
                    placeholder="Edit message..."
                  />
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    onClick={() => applyEdit(i,msg.id, msg.editContent ?? "")}
                  >
                    Save
                  </button>
                </div>
              )}

              {msg.showReply && (
                <div className="flex items-center gap-2 mt-3">
                  <input
                    autoFocus
                    type="text"
                    value={msg.replyMessage ?? ""}
                    onChange={(e) => handleReplyChange(i, e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none"
                    placeholder="Write a reply..."
                  />
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={() => replyToMessage(msg.id, msg.replyMessage)}
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
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
          onClick={onSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
