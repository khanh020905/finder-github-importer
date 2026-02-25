export type Gender = "male" | "female" | "other";

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: Gender;
  genderPreference: Gender | "all";
  major: string;
  occupation?: string;
  interests: string[];
  bio: string;
  avatar?: string;
  location: string;
  distance: number; // km
  photos: string[];
}

export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  timestamp: string;
}

export interface Like {
  fromUserId: string;
  toUserId: string;
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
  type?: "text" | "emoji" | "image";
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Nguyễn Minh Anh",
    email: "anhnm@fpt.edu.vn",
    age: 19,
    gender: "female",
    genderPreference: "male",
    major: "Công nghệ thông tin",
    occupation: "Sinh viên",
    interests: ["K-pop", "Lập trình", "Du lịch", "Bóng đá"],
    bio: "Sinh viên năm nhất CNTT, thích code và nghe nhạc Hàn 🎵",
    location: "TP. Hồ Chí Minh",
    distance: 0,
    photos: [],
  },
  {
    id: "2",
    name: "Trần Hữu Phúc",
    email: "phucth@fpt.edu.vn",
    age: 20,
    gender: "male",
    genderPreference: "female",
    major: "Công nghệ thông tin",
    occupation: "Sinh viên",
    interests: ["Bóng đá", "Gaming", "Lập trình", "Phim ảnh"],
    bio: "Fan MU, thích chơi game và học code cùng nhau! ⚽",
    location: "TP. Hồ Chí Minh",
    distance: 2,
    photos: [],
  },
  {
    id: "3",
    name: "Lê Thị Hương",
    email: "huonglt@fpt.edu.vn",
    age: 18,
    gender: "female",
    genderPreference: "male",
    major: "Quản trị kinh doanh",
    occupation: "Sinh viên",
    interests: ["K-pop", "Du lịch", "Nấu ăn", "Yoga"],
    bio: "Yêu thích du lịch và khám phá ẩm thực 🍜",
    location: "TP. Hồ Chí Minh",
    distance: 5,
    photos: [],
  },
  {
    id: "4",
    name: "Phạm Đức Huy",
    email: "huypd@fpt.edu.vn",
    age: 21,
    gender: "male",
    genderPreference: "all",
    major: "Thiết kế đồ họa",
    occupation: "Freelance Designer",
    interests: ["Vẽ", "Phim ảnh", "Nhiếp ảnh", "Du lịch"],
    bio: "Creative designer, thích chụp ảnh phong cảnh 📸",
    location: "Hà Nội",
    distance: 8,
    photos: [],
  },
  {
    id: "5",
    name: "Võ Thanh Tâm",
    email: "tamvt@fpt.edu.vn",
    age: 20,
    gender: "male",
    genderPreference: "female",
    major: "Công nghệ thông tin",
    occupation: "Sinh viên",
    interests: ["Gaming", "Lập trình", "Âm nhạc", "Gym"],
    bio: "Full-stack dev wannabe, gym rat 💪",
    location: "TP. Hồ Chí Minh",
    distance: 3,
    photos: [],
  },
  {
    id: "6",
    name: "Đặng Ngọc Mai",
    email: "maidn@fpt.edu.vn",
    age: 19,
    gender: "female",
    genderPreference: "male",
    major: "Ngôn ngữ Anh",
    occupation: "Sinh viên",
    interests: ["Đọc sách", "K-pop", "Yoga", "Tình nguyện"],
    bio: "Book lover, tình nguyện viên năng động 📚",
    location: "Đà Nẵng",
    distance: 12,
    photos: [],
  },
];

export const mockMatches: Match[] = [
  { id: "match1", userId1: "1", userId2: "2", timestamp: "2026-03-01T10:00:00" },
  { id: "match2", userId1: "1", userId2: "3", timestamp: "2026-03-02T14:00:00" },
];

export const mockLikes: Like[] = [
  { fromUserId: "4", toUserId: "1" },
  { fromUserId: "5", toUserId: "1" },
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
];

export const mockMessages: Message[] = [
  { id: "m1", senderId: "2", receiverId: "1", content: "Hey, bạn có muốn học nhóm PRF192 không?", timestamp: "2026-03-01T10:00:00" },
  { id: "m2", senderId: "1", receiverId: "2", content: "Có chứ! Khi nào bắt đầu?", timestamp: "2026-03-01T10:05:00" },
  { id: "m3", senderId: "2", receiverId: "1", content: "T3 tuần sau nha, 6h chiều ở thư viện", timestamp: "2026-03-01T10:06:00" },
  { id: "m4", senderId: "3", receiverId: "1", content: "Mình thấy bạn cũng thích K-pop! Bias ai vậy? 😄", timestamp: "2026-03-01T14:00:00" },
  { id: "m5", senderId: "1", receiverId: "3", content: "Mình thích BTS nhất! Còn bạn?", timestamp: "2026-03-01T14:10:00" },
];
