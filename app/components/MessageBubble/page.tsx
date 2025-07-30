"use client";
import React, { FC } from "react";

interface Message {
  content: string;
  timestamp: string;
  showEdit?: boolean;
  showReply?: boolean;
  editContent?: string;
  replyMessage?: string;
  replyTo?: Message[];
  fromUserId?: number;
  toUserId?: number;
}

interface BubbleProps {
  index: number;
  message: Message;
  userId: number;
  toggleEdit: (index: number) => void;
  toggleReply: (index: number) => void;
  handleEditChange: (index: number, value: string) => void;
  handleReplyChange: (index: number, value: string) => void;
  applyEdit: (index: number) => void;
  deleteMessage: (index: number) => void;
  replyToMessage: (index: number) => void;
}

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
        <button onClick={() => toggleReply(index)} title="Reply">↩️</button>
        <button onClick={() => toggleEdit(index)} title="Edit">✏️</button>
        <button onClick={() => deleteMessage(index)} title="Delete">🗑️</button>
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

export default MessageBubble;
