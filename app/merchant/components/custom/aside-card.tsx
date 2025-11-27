"use client";
import Clock from "@/components/icons/clock-icon";
import LocationIcon from "@/components/icons/location";
import RightArrow from "@/components/icons/right-arrow";
import Telephone from "@/components/icons/telephone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import useGetUser from "@/hooks/auth/use-get-user";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import DialogLogin from "@/components/shared/dialog-login";
import DialogSignup from "@/components/shared/dialog-signup";
import DialogLoginEmail from "@/components/shared/dialog-login-email";
import useStartChat from "@/hooks/merchant/use-start-chat";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type AsideCardContent = {
  icon: React.ReactElement;
  title: string;
  description: string;
};

const AsideCard = ({
  className,
  location,
}: {
  className?: string;
  location?: string;
}) => {
  const { data: user } = useGetUser();
  const {
    openModal,
    defaultModalIsOpen,
    closeModal,
    signInIsOpen,
    signUpIsOpen,
    onCloseSignup,
  } = useOpenModal();
  const isAuthenticated = !!user;

  const {
    isOpen: chatIsOpen,
    openChat,
    closeChat,
    merchantInfo,
    messages,
    inputMessage,
    setInputMessage,
    sendMessage,
    handleKeyPress,
    messagesEndRef,
  } = useStartChat();

  const handleChatClick = () => {
    if (!isAuthenticated) {
      openModal("default");
      return;
    }
    openChat();
  };

  const asideCardContent: AsideCardContent[] = [
    {
      icon: <Telephone className="text-secondary" />,
      title: "Telepon",
      description: "081222122",
    },
    {
      icon: <LocationIcon className="text-transparent" />,
      title: "Lokasi",
      description: location ?? "Merchant ini tidak menyediakan lokasi",
    },
    {
      icon: <Clock className="text-secondary" />,
      title: "Jam Operasional",
      description: "08:00 - 22:00",
    },
  ];
  return (
    <Card className={`${className}`}>
      <CardContent className="p-5 md:p-6">
        <h1 className="text-lg md:text-xl lg:text-[22px] font-bold mb-4">
          Informasi Kontak
        </h1>
        {asideCardContent.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-start gap-3 md:gap-4">
              <div className="p-2 md:p-2.5 bg-[#FFF7ED] rounded-xl flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xs md:text-sm lg:text-base text-[#8D8D8D] mb-1">
                  {item.title}
                </h1>
                <p className="text-sm md:text-base break-words">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#E1E1E1] my-4" />
          </div>
        ))}
        <Button
          onClick={handleChatClick}
          className="px-5 md:px-6 py-5 md:py-6 gap-2.5 flex items-center group hover:shadow-[2px_4px_10px_0_rgba(233,109,0,0.4)] hover:bg-[linear-gradient(86deg,#FD6700_4.98%,#FF944B_94.22%)] overflow-hidden mx-auto w-full mt-2"
        >
          <div>
            <p className="text-lg md:text-xl lg:text-2xl">Chat Sekarang!</p>
          </div>

          <div className="p-2 bg-white rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:translate-x-2.5 ">
            <RightArrow className="w-4 h-4 text-primary" />
          </div>
        </Button>
      </CardContent>

      {/* Dialog Login */}
      <DialogLogin
        open={defaultModalIsOpen}
        onClose={closeModal}
        openModal={openModal}
      />
      <DialogSignup open={signUpIsOpen} onClose={onCloseSignup} />
      <DialogLoginEmail open={signInIsOpen} onClose={closeModal} />

      {/* Dialog Chat */}
      <Dialog open={chatIsOpen} onOpenChange={(open) => !open && closeChat()}>
        <DialogContent className="max-w-md w-full p-0 overflow-hidden">
          <div className="flex flex-col h-[480px]">
            <div className="px-4 py-3 border-b flex items-center gap-3 bg-white">
              <div className="w-9 h-9 rounded-full bg-gray-200" />
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-sm font-semibold truncate">
                  {merchantInfo.name}
                </DialogTitle>
                <p className="text-xs text-[#8D8D8D] truncate">
                  {merchantInfo.lastSeen}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 px-3 py-3 space-y-3 text-xs">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm ${
                      message.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-white text-[#333] border border-gray-200"
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        message.sender === "user"
                          ? "text-orange-100"
                          : "text-[#8D8D8D]"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 py-3 border-t bg-white">
              <div className="flex items-center gap-2">
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ketik pesan..."
                  className="flex-1 text-xs border border-gray-200 rounded-full px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim()}
                  className="px-3 py-2 text-xs rounded-full bg-primary text-white disabled:opacity-60"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
    </Card>
  );
};

export default AsideCard;
