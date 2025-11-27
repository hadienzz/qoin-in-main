"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import useChat from "@/hooks/merchant/use-chat";

export type StartChatMode = "dialog" | "page";

interface UseStartChatOptions {
  mode?: StartChatMode;
  overrideMerchantId?: string;
}

const useStartChat = (options: UseStartChatOptions = {}) => {
  const { mode = "dialog", overrideMerchantId } = options;
  const router = useRouter();
  const params = useParams();

  const [isOpen, setIsOpen] = useState(false);
console.log(isOpen)
  let merchantId = overrideMerchantId ?? (params?.merchantId as string | undefined);

  const {
    merchantInfo,
    messages,
    inputMessage,
    setInputMessage,
    sendMessage,
    handleKeyPress,
    messagesEndRef,
  } = useChat(merchantId);

  const openChat = () => {
    if (mode === "page") {
      if (!merchantId) return;
      router.push(`/chat/${merchantId}`);
      return;
    }

    setIsOpen(true);
  };

  const closeChat = () => setIsOpen(false);

  return {
    isOpen,
    openChat,
    closeChat,
    merchantInfo,
    messages,
    inputMessage,
    setInputMessage,
    sendMessage,
    handleKeyPress,
    messagesEndRef,
  };
};

export default useStartChat;
