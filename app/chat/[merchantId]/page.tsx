"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import useGetUser from "@/hooks/auth/use-get-user";
import Image from "next/image";
import {
  ArrowLeft,
  Send,
  Phone,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
} from "lucide-react";

interface MerchantData {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
}

// Mock merchant data
const mockMerchants: Record<string, MerchantData> = {
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

// Mock chat messages
const mockMessages = [
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

const ChatPage = () => {
  const router = useRouter();
  const params = useParams();
  const { openModal } = useOpenModal();
  const { data, isLoading, isError } = useGetUser();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState(mockMessages);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const merchantId = params.merchantId as string;
  const merchant = mockMerchants[merchantId] || mockMerchants.m1;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  interface UserPayload {
    name?: string;
    user?: {
      name?: string;
    };
  }

  const userData: UserPayload | undefined = data as UserPayload | undefined;
  const isAuthenticated = !!userData && !isError;

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push("/");
    return null;
  }

  if (!mounted) {
    return null;
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulate merchant reply
    setTimeout(() => {
      const merchantReply = {
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
      handleSendMessage();
    }
  };

  return (
    <>
      <Header openModal={openModal} />
      <Section className="mt-0 md:mt-2 lg:mt-4 min-h-screen pb-0">
        <PageContainer>
          <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] flex flex-col">
            {/* Chat Header */}
            <Card className="rounded-t-3xl md:rounded-3xl shadow-lg border-b-0 md:border-b sticky top-0 z-10">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.back()}
                      className="rounded-full hover:bg-gray-100 flex-shrink-0"
                    >
                      <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </Button>
                    <div
                      className="relative flex-shrink-0 cursor-pointer"
                      onClick={() => router.push(`/merchant/${merchantId}`)}
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={merchant.avatar}
                          alt={merchant.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {merchant.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2
                        className="text-sm md:text-base lg:text-lg font-bold text-[#333] truncate cursor-pointer hover:text-primary"
                        onClick={() => router.push(`/merchant/${merchantId}`)}
                      >
                        {merchant.name}
                      </h2>
                      <p className="text-xs md:text-sm text-[#8D8D8D] truncate">
                        {merchant.lastSeen}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-gray-100 hidden md:flex"
                    >
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 md:px-6 md:py-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] md:max-w-[60%] ${
                      message.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-white text-[#333] border border-gray-200"
                    } rounded-2xl px-4 py-3 shadow-sm`}
                  >
                    <p className="text-sm md:text-base break-words">
                      {message.text}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
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

            {/* Input Area */}
            <Card className="rounded-b-3xl md:rounded-3xl shadow-lg border-t-0 md:border-t sticky bottom-0">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-end gap-2 md:gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-100 flex-shrink-0 mb-1"
                  >
                    <Paperclip className="w-5 h-5 text-[#8D8D8D]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-100 flex-shrink-0 mb-1 hidden md:flex"
                  >
                    <ImageIcon className="w-5 h-5 text-[#8D8D8D]" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ketik pesan..."
                      className="rounded-2xl border-gray-200 focus:border-primary pr-12 py-5 md:py-6 text-sm md:text-base"
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="rounded-2xl bg-primary hover:bg-primary/90 px-4 md:px-6 py-5 md:py-6 flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageContainer>
      </Section>
    </>
  );
};

export default ChatPage;
