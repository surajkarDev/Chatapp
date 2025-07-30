"use client";
import React, { useEffect, useState, useCallback ,useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ChatSidebar from "../components/ChatSidebar/page";
import ChatWindow from "../components/ChatWindow/page";
import { AppDispatch, RootState} from "../redux/store/page";
import { callLoginUser, fetchAllUser, fetchUserChats, selectUserToChat} from "../redux/features/page";

const ChatAppPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const userId = useSelector((state: RootState) => state.user.id);
  const loginUser = useSelector((state: RootState) => state.user.username);
  const userOnline = useSelector((state: RootState) => state.user.onlineStatus);
  const selectedFriend = useSelector((state: RootState) => state.user.toUserId);
  const existingUser = useSelector((state: RootState) => state.user.userList) || [];

  const [messageType, setMessageType] = useState("");
  const [chatlist, setChatlist] = useState<any[]>([]);
  const [chatlistMain, setChatlistMain] = useState<any[]>([]);
  const prevChatStr = useRef<string>("");

  const fetchChats = async () => {
    const response = await fetch("http://localhost:3001/chats");
    if (response.ok) {
      const chats = await response.json();
      
      const stored = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("currentUserToChat") || "null") : null;
      const friend = selectedFriend || stored;

      const relevantChats = chats.filter(
        (x: any) => x.fromUserId === userId || x.toUserId === userId
      );

      const showChats = relevantChats.filter((x: any) =>
        (x.fromUserId === userId && x.toUserId === friend) ||
        (x.fromUserId === friend && x.toUserId === userId)
      );

      const newChatStr = JSON.stringify(showChats);
      
      // Skip comparison if chatlist is empty (initial mount)
      if (prevChatStr.current !== newChatStr) {
        prevChatStr.current = newChatStr;
        setChatlistMain(relevantChats);
        setChatlist(showChats);
      }
    }
  };


  const sendMessage = useCallback(async () => {
    if (!messageType.trim()) return;
    const newMsg = {
      type: "text",
      content: messageType.trim(),
      timestamp: new Date().toLocaleTimeString(),
      showEdit: false,
      showReply: false,
      editContent: "",
      replyMessage: "",
      fromUserId: userId,
      toUserId: selectedFriend,
    };
    const res = await fetch("http://localhost:3001/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMsg),
    });
    if (res.ok) {
      setMessageType("");
      dispatch(fetchUserChats());
      fetchChats();
    }
  }, [messageType, userId, selectedFriend]);

  const setUserIdGlobaly = (id: number) => {
    localStorage.setItem("currentUserToChat", JSON.stringify(id));
    dispatch(selectUserToChat(id));

    const filtered = chatlistMain.filter((msg) => {
      return (
        (msg.fromUserId === userId && msg.toUserId === id) ||
        (msg.toUserId === userId && msg.fromUserId === id)
      );
    });
    setChatlist(filtered);
  };
  
  const setReplyInputToUser = (selectId: string) => {
    const chatListReply = chatlist.map((x: any) => {
      if (x.id === selectId) {
        return { ...x, showReply: !x.showReply };
      }
      return x;
    });
    setChatlist(chatListReply);
  };
  useEffect(() => {
    dispatch(fetchAllUser());
    dispatch(fetchUserChats());
    const stored = localStorage.getItem("currentUserToChat");
    if (stored) dispatch(selectUserToChat(JSON.parse(stored)));
    fetchChats();
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(fetchChats, 5000);
  //   return () => clearInterval(interval);
  // }, [userId, selectedFriend]);

  useEffect(() => {
     if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.id) {
        fetch(`http://localhost:3001/users/${user.id}`)
          .then((res) => res.json())
          .then((data) => dispatch(callLoginUser(data)));
      }
    }
  }, []);

  useEffect(() => {
    if (!userOnline) router.push("/");
  }, [userOnline]);

  return (
    <div className="chatAppdata flex flex-row">
      <ChatSidebar users={existingUser} currentUserId={userId} selectedFriendId={selectedFriend ?? -1} onSelect={setUserIdGlobaly}/>
      <ChatWindow userId={userId} loginUser={loginUser} chatlist={chatlist} setChatlist={setChatlist} messageType={messageType} setMessageType={setMessageType} onSend={sendMessage} onReply={setReplyInputToUser}/>
    </div>
  );
};

export default ChatAppPage;
