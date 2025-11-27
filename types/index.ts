import { profile } from "console";

export interface Stock {
  id: string;
  name: string;
  merchant_id: string;
  user_id: string;
  photo_url: string;
  price: number;
  quantity: number;
  description: string;
  created_at: string; // ISO string (Date.toISOString())
  updated_at: string;
  is_display?: boolean;
}

export interface Merchant {
  id: string;
  user_id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  profile_photo: string;
  banner_img: string;
  gallery_photo: string;
  profilePhotoUrl: string | null;
  bannerImageUrl: string | null;
  galleryImages: string[]; // JSON array dari Supabase
  restricted: boolean;
  verified: boolean;
  total_follower: number;
  created_at: string;
  updated_at: string;
  latitude: number;
  longitude: number;
  google_map_url: string | null;
  iframe_map_url: string | null;
  // Relations
  stocks: Stock[];
  ratings: any[]; // bisa buat interface detail kalau dibutuhkan
  followers: any[];
  selledStocks?: SelledStock[];
}

export interface SelledStock {
  id: string;
  stock_id: string;
  quantity: number;
  total_price: number;
  merchant_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  stock?: Stock;
}

export interface DisplayMerchantType {
  id: string;
  name: string;
  profilePhotoUrl: string | null;
  minPrice?: number | null;
}

export interface DisplayMerchantResponse {
  message: string;
  status: string;
  data: DisplayMerchantType[];
}

export interface LikedMerchant {
  merchant: {
    profilePhotoUrl: string | null;
    id: string;
    name: string;
  };
}

export interface TransactionData {
  id: string;
  payment_id: string;
  stock_id: string;
  user_id: string;
  merchant_id: string;
  quantity: number;
  total_price: number;
  status: string;
  merchant?: {
    name: string;
  };
  transaction_type?: "earning" | "spending";
  description?: string;
  created_at: string; // tanggal transaksi dilakukan
  updated_at: string;
}
