import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, MapPin, Clock, User, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ChatWidget = () => {
  const { language, currentUser, chats, sendChatMessage } = useApp();
  const isEn = language === 'en';
  const isAdmin = currentUser?.role === 'admin';
  const userId = currentUser ? currentUser.user_id : 'guest';
  const userName = currentUser ? currentUser.name : (isEn ? 'Guest User' : 'บุคคลทั่วไป');
  
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // For Admin view
  const [activeChatId, setActiveChatId] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, isOpen, activeChatId]);

  // Initial bot message for customer if chat is empty
  useEffect(() => {
    if (!isAdmin && isOpen && (!chats[userId] || chats[userId].messages.length === 0)) {
      sendChatMessage(userId, userName, isEn ? 'Hello! Any questions about pickup/drop-off locations or times? Ask away!' : 'สวัสดีครับ! สอบถามสถานที่รับ-ส่งรถ เวลา หรือปรึกษาเรื่องอื่นๆ พิมพ์ข้อความทิ้งไว้ได้เลยครับ 😊', 'admin');
    }
  }, [isOpen, isAdmin, chats, userId, userName]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (isAdmin) {
      if (!activeChatId) return;
      sendChatMessage(activeChatId, chats[activeChatId]?.userName, inputValue, 'admin');
    } else {
      sendChatMessage(userId, userName, inputValue, 'user');
    }
    
    setInputValue('');
  };

  const renderAdminInbox = () => {
    const chatEntries = Object.entries(chats);
    if (chatEntries.length === 0) {
      return (
        <div className="flex-1 p-4 flex items-center justify-center text-slate-500 text-xs">
          {isEn ? 'No messages yet' : 'ยังไม่มีข้อความใหม่'}
        </div>
      );
    }

    return (
      <div className="flex-1 h-72 overflow-y-auto bg-slate-900">
        {chatEntries.map(([id, chatData]) => {
          const lastMsg = chatData.messages[chatData.messages.length - 1];
          return (
            <div 
              key={id} 
              onClick={() => setActiveChatId(id)}
              className="p-3 border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer transition flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">{chatData.userName}</h4>
                <p className="text-[10px] text-slate-400 truncate">{lastMsg?.text || ''}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderChatArea = (currentMessages) => (
    <>
      {/* Quick Questions (Only for Customer) */}
      {!isAdmin && (
        <div className="bg-slate-950 p-2 flex gap-2 overflow-x-auto border-b border-slate-800 scrollbar-hide">
           <button 
             onClick={() => setInputValue(isEn ? 'What are your pickup times?' : 'รับรถกี่โมงได้บ้าง?')}
             className="flex-shrink-0 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-[10px] font-medium flex items-center gap-1 transition"
           >
             <Clock className="w-3 h-3" /> {isEn ? 'Pickup Times' : 'เวลารับรถ'}
           </button>
           <button 
             onClick={() => setInputValue(isEn ? 'Where can I pick up the car?' : 'รับรถได้ที่ไหนบ้าง?')}
             className="flex-shrink-0 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-[10px] font-medium flex items-center gap-1 transition"
           >
             <MapPin className="w-3 h-3" /> {isEn ? 'Locations' : 'สถานที่รับรถ'}
           </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 h-72 p-4 overflow-y-auto space-y-4 bg-slate-900">
        {currentMessages.map(msg => (
          <div key={msg.id} className={`flex ${(isAdmin ? msg.sender === 'admin' : msg.sender === 'user') ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
              (isAdmin ? msg.sender === 'admin' : msg.sender === 'user')
                ? 'bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-900/20' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm shadow-md'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isEn ? "Type a message..." : "พิมพ์ข้อความ..."}
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-full px-4 py-2 text-xs text-white focus:outline-none"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-full transition flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );

  const getActiveMessages = () => {
    if (isAdmin && activeChatId) {
      return chats[activeChatId]?.messages || [];
    } else if (!isAdmin) {
      return chats[userId]?.messages || [];
    }
    return [];
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              {isAdmin && activeChatId ? (
                <button onClick={() => setActiveChatId(null)} className="mr-1 hover:bg-blue-700 p-1 rounded-full transition">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              ) : (
                <MessageCircle className="w-5 h-5" />
              )}
              <span className="font-bold text-sm">
                {isAdmin 
                  ? (activeChatId ? chats[activeChatId]?.userName : (isEn ? 'Admin Inbox' : 'กล่องข้อความ (Admin)'))
                  : (isEn ? 'Car Rental Songkhla Support' : 'ติดต่อสอบถาม (Support)')}
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-slate-200 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {isAdmin && !activeChatId ? renderAdminInbox() : renderChatArea(getActiveMessages())}

        </div>
      )}
    </>
  );
};

