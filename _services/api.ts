import axios from "axios";

/**
 * Star News Networks - Centralized API Service
 * Production Backend: https://starnewsbackend.onrender.com
 * Content API endpoints and contracts are strictly preserved.
 */
export const API_BASE_URL = "https://starnewsbackend.onrender.com";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Accept": "application/json",
  },
});

/**
 * Helper to ensure media URLs (images, videos) have the full valid URL.
 */
export const getFullMediaUrl = (path?: string | null): string => {
  if (!path) return "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

/**
 * Relative time formatter with Hindi/English support
 */
export const formatTimeAgo = (dateStr?: string | Date): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSec) || diffInSec < 0) return "Just now";
  if (diffInSec < 60) return "Just now";
  if (diffInSec < 3600) return `${Math.floor(diffInSec / 60)} min ago`;
  if (diffInSec < 86400) return `${Math.floor(diffInSec / 3600)} hr ago`;
  if (diffInSec < 172800) return "Yesterday";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Views and likes count formatter (e.g., 1.5K, 2.3M)
 */
export const formatMetricCount = (count?: number): string => {
  if (!count || count <= 0) return "0";
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

/* ================= TYPES ================= */

export interface NewsSection {
  _id?: string;
  heading?: string;
  content: string;
  image?: string;
  headingBgColor?: string;
  headingTextColor?: string;
  contentBgColor?: string;
  contentTextColor?: string;
}

export interface NewsComment {
  _id: string;
  text: string;
  visitorId?: string;
  name?: string;
  createdAt?: string;
}

export interface NewsArticle {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  content?: string;
  sections?: NewsSection[];
  status?: "draft" | "publish" | "published";
  featuredImage?: string;
  images?: string[];
  likes?: number;
  likedBy?: string[];
  views?: number;
  viewedBy?: string[];
  shares?: number;
  sharedBy?: string[];
  comments?: NewsComment[];
  breaking?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface BreakingItem {
  _id: string;
  text: string;
  isActive: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerItem {
  _id: string;
  url?: string;
  image?: string;
  type?: "image" | "video";
  likes?: number;
  views?: number;
  shares?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface EpaperPage {
  public_id?: string;
  url: string;
}

export interface EpaperItem {
  _id: string;
  title: string;
  publishDate: string;
  pages: EpaperPage[];
  createdAt?: string;
}

export interface GalleryAlbum {
  _id: string;
  title: string;
  description?: string;
  images: { public_id?: string; url: string }[];
  createdAt?: string;
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type?: string;
  newsId?: string;
  image?: string;
  isRead?: boolean;
  createdAt?: string;
}

export interface SubmittedNewsItem {
  _id: string;
  title: string;
  content: string;
  category?: string;
  images?: string[];
  video?: string;
  location?: string;
  district?: string;
  date?: string;
  name?: string;
  mobile?: string;
  email?: string;
  tags?: string[];
  isBreaking?: boolean;
  urgency?: "low" | "medium" | "high";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface IdCardItem {
  _id: string;
  name: string;
  designation: string;
  organization: string;
  employeeId: string;
  validTill: string;
  photoUrl?: string;
  createdAt?: string;
}

export interface YouTubeItem {
  _id: string;
  title?: string;
  channelName?: string;
  link: string;
  type?: "video" | "live";
  createdAt?: string;
}

export interface AdItem {
  _id: string;
  title?: string;
  image?: string;
  link?: string;
  position?: "top" | "sidebar" | "infeed";
  isActive?: boolean;
  clicks?: number;
  createdAt?: string;
}

export interface ContactItem {
  _id: string;
  name: string;
  phone: string;
  message: string;
  createdAt?: string;
}
