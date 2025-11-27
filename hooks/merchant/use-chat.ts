"use client";

import { useEffect, useRef, useState } from "react";
import useGetMerchantById from "@/hooks/merchant/use-get-merchant-by-id";

export type ChatSender = "user" | "merchant";

export interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  time: string;
}

export interface ChatMerchantInfo {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
}

const mockMerchants: Record<string, ChatMerchantInfo> = {
  m1: {
    id: "m1",
    name: "Warung Makan Bu Siti",
    avatar: "/images/cafe-image.png",
    isOnline: true,
    lastSeen: "Online",
  },
  m2: {
    id: "m2",
    name: "Toko Roti Barokah",
    avatar: "/images/cafe-image.png",
    isOnline: false,
    lastSeen: "Terakhir dilihat 30 menit yang lalu",
  },
  m3: {
    id: "m3",
    name: "Kedai Kopi Nusantara",
    avatar: "/images/cafe-image.png",
    isOnline: true,
    lastSeen: "Online",
  },
  m4: {
    id: "m4",
    name: "Toko Kelontong Berkah",
    avatar: "/images/cafe-image.png",
    isOnline: false,
    lastSeen: "Terakhir dilihat 2 hari yang lalu",
  },
};

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    text: "Halo kak! Selamat datang di toko kami 😊",
    sender: "merchant",
    time: "10:30",
  },
  {
    id: "2",
    text: "Halo, saya mau tanya apakah masih ada stok nasi goreng?",
    sender: "user",
    time: "10:32",
  },
  {
    id: "3",
    text: "Alhamdulillah masih ada kak! Mau pesan berapa porsi?",
    sender: "merchant",
    time: "10:33",
  },
  {
    id: "4",
    text: "2 porsi ya. Bisa diantar ga?",
    sender: "user",
    time: "10:35",
  },
  {
    id: "5",
    text: "Bisa kak! Untuk alamat pengiriman di mana ya?",
    sender: "merchant",
    time: "10:36",
  },
  {
    id: "6",
    text: "Jl. Merdeka No. 123, Jakarta Selatan",
    sender: "user",
    time: "10:37",
  },
  {
    id: "7",
    text: "Siap kak! Pesanan sedang kami proses. Estimasi sampai 30-45 menit ya 🚀",
    sender: "merchant",
    time: "10:38",
  },
];

const useChat = (overrideMerchantId?: string) => {
  const { merchant, merchantId } = useGetMerchantById(overrideMerchantId);

  const resolvedMerchantId =
    (merchantId as string | undefined) ?? Object.keys(mockMerchants)[0];

  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const baseMerchant =
    (resolvedMerchantId && mockMerchants[resolvedMerchantId]) ||
    mockMerchants.m1;

  const merchantInfo: ChatMerchantInfo = {
    ...baseMerchant,
    name: merchant?.name ?? baseMerchant.name,
  };

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text?: string) => {
    const content = (text ?? inputMessage).trim();
    if (!content) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: content,
      sender: "user",
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    setTimeout(() => {
      const merchantReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Terima kasih pesannya! Sedang kami proses ya kak 😊",
        sender: "merchant",
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, merchantReply]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return {
    merchantInfo,
    messages,
    inputMessage,
    setInputMessage,
    sendMessage,
    handleKeyPress,
    messagesEndRef,
  };
};

export default useChat;
