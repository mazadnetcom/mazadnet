export interface Tweet {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  stats: {
    comments: number;
    retweets: number;
    likes: number;
    views: string;
  };
  status?: 'active' | 'inactive';
  category?: 'Cars' | 'RealEstate' | 'Fashion' | 'Auctions' | 'General' | string;
  replyingTo?: string;
  replyingToTweetId?: string;
  imageUrls?: string[];
  videoUrl?: string;
  auctionData?: {
    currentBid: number;
    endTime: string;
    bidCount: number;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  gender: 'male' | 'female';
  phone: string;
  isBanned: boolean;
  whatsappEnabled: boolean; // Kept for admin control default
  whatsappNumber?: string;
  showWhatsappInPosts?: boolean;
  bio?: string;
  location?: string;
  joinDate?: string;
  followers?: number;
  following?: number;
  banner?: string;
}

export interface SiteSettings {
  siteName: string;
  logoUrl?: string;
  showTrends: boolean;
  allowImageUpload: boolean;
  allowVideoUpload: boolean;
  allowMessaging: boolean;
  allowFollowing: boolean;
}

export interface SupervisorPermissions {
  canDeletePost: boolean;
  canTogglePostStatus: boolean;
  canBanUser: boolean;
}

export interface Supervisor {
  userId: string;
  permissions: SupervisorPermissions;
}

export interface CommercialSection {
  id: string;
  name: string;
  supervisorId: string | null;
  icon: string;
}

export interface Notification {
    id: string;
    type: 'like' | 'retweet' | 'reply' | 'follow';
    fromUsers: Pick<AdminUser, 'id' | 'name' | 'avatar'>[];
    tweetContent?: string;
    timestamp: string;
    isRead: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  messages: Message[];
}
