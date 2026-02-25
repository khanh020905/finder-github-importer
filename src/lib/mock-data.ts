export interface User {
  id: string;
  name: string;
  email: string;
  major: string;
  interests: string[];
  bio: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  participants: number;
  creatorId: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  major: string;
  schedule: string;
  location: string;
  members: number;
  maxMembers: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Nguyễn Minh Anh",
    email: "anhnm@fpt.edu.vn",
    major: "Công nghệ thông tin",
    interests: ["K-pop", "Lập trình", "Du lịch", "Bóng đá"],
    bio: "Sinh viên năm nhất CNTT, thích code và nghe nhạc Hàn 🎵",
  },
  {
    id: "2",
    name: "Trần Hữu Phúc",
    email: "phucth@fpt.edu.vn",
    major: "Công nghệ thông tin",
    interests: ["Bóng đá", "Gaming", "Lập trình", "Phim ảnh"],
    bio: "Fan MU, thích chơi game và học code cùng nhau!",
  },
  {
    id: "3",
    name: "Lê Thị Hương",
    email: "huonglt@fpt.edu.vn",
    major: "Quản trị kinh doanh",
    interests: ["K-pop", "Du lịch", "Nấu ăn", "Yoga"],
    bio: "Yêu thích du lịch và khám phá ẩm thực 🍜",
  },
  {
    id: "4",
    name: "Phạm Đức Huy",
    email: "huypd@fpt.edu.vn",
    major: "Thiết kế đồ họa",
    interests: ["Vẽ", "Phim ảnh", "Nhiếp ảnh", "Du lịch"],
    bio: "Creative designer, thích chụp ảnh phong cảnh 📸",
  },
  {
    id: "5",
    name: "Võ Thanh Tâm",
    email: "tamvt@fpt.edu.vn",
    major: "Công nghệ thông tin",
    interests: ["Gaming", "Lập trình", "Âm nhạc", "Gym"],
    bio: "Full-stack dev wannabe, gym rat 💪",
  },
  {
    id: "6",
    name: "Đặng Ngọc Mai",
    email: "maidn@fpt.edu.vn",
    major: "Ngôn ngữ Anh",
    interests: ["Đọc sách", "K-pop", "Yoga", "Tình nguyện"],
    bio: "Book lover, tình nguyện viên năng động 📚",
  },
];

export const mockEvents: Event[] = [
  {
    id: "e1",
    title: "Giao lưu tân sinh viên CNTT",
    description: "Buổi giao lưu làm quen giữa các bạn năm nhất ngành CNTT",
    date: "2026-03-05",
    time: "14:00",
    location: "Phòng hội thảo A - FPT HCM",
    maxParticipants: 50,
    participants: 23,
    creatorId: "1",
  },
  {
    id: "e2",
    title: "Đá bóng cuối tuần",
    description: "Giao hữu bóng đá giữa các khoa, ai cũng có thể tham gia!",
    date: "2026-03-08",
    time: "16:00",
    location: "Sân bóng FPT University",
    maxParticipants: 30,
    participants: 18,
    creatorId: "2",
  },
  {
    id: "e3",
    title: "Workshop Design Thinking",
    description: "Học cách tư duy sáng tạo qua phương pháp Design Thinking",
    date: "2026-03-12",
    time: "09:00",
    location: "Phòng 301 - Tòa nhà Alpha",
    maxParticipants: 40,
    participants: 35,
    creatorId: "4",
  },
  {
    id: "e4",
    title: "Movie Night: Anime Marathon",
    description: "Cùng xem anime và giao lưu. Có bắp rang và nước ngọt!",
    date: "2026-03-15",
    time: "19:00",
    location: "Khu sinh hoạt chung",
    maxParticipants: 25,
    participants: 12,
    creatorId: "5",
  },
];

export const mockGroups: StudyGroup[] = [
  {
    id: "g1",
    name: "PRF192 - Ôn tập cuối kỳ",
    subject: "Programming Fundamentals",
    major: "Công nghệ thông tin",
    schedule: "T3, T5 - 18:00",
    location: "Thư viện - Tầng 2",
    members: 6,
    maxMembers: 8,
  },
  {
    id: "g2",
    name: "MKT101 - Nhóm thảo luận",
    subject: "Marketing Principles",
    major: "Quản trị kinh doanh",
    schedule: "T4 - 14:00",
    location: "Phòng học nhóm B3",
    members: 4,
    maxMembers: 6,
  },
  {
    id: "g3",
    name: "JPD113 - Luyện hội thoại",
    subject: "Japanese Elementary",
    major: "Ngôn ngữ Nhật",
    schedule: "T2, T6 - 10:00",
    location: "Online - Google Meet",
    members: 5,
    maxMembers: 5,
  },
  {
    id: "g4",
    name: "CSI104 - Toán rời rạc",
    subject: "Discrete Mathematics",
    major: "Công nghệ thông tin",
    schedule: "T7 - 09:00",
    location: "Thư viện - Tầng 3",
    members: 3,
    maxMembers: 6,
  },
];

export const mockMessages: Message[] = [
  { id: "m1", senderId: "2", receiverId: "1", content: "Hey, bạn có muốn học nhóm PRF192 không?", timestamp: "2026-03-01T10:00:00" },
  { id: "m2", senderId: "1", receiverId: "2", content: "Có chứ! Khi nào bắt đầu?", timestamp: "2026-03-01T10:05:00" },
  { id: "m3", senderId: "2", receiverId: "1", content: "T3 tuần sau nha, 6h chiều ở thư viện", timestamp: "2026-03-01T10:06:00" },
  { id: "m4", senderId: "3", receiverId: "1", content: "Mình thấy bạn cũng thích K-pop! Bias ai vậy? 😄", timestamp: "2026-03-01T14:00:00" },
  { id: "m5", senderId: "1", receiverId: "3", content: "Mình thích BTS nhất! Còn bạn?", timestamp: "2026-03-01T14:10:00" },
];
