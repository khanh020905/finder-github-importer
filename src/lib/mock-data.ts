export type Gender = "male" | "female" | "other";

export interface User {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  genderPreference: Gender | "all";
  occupation: string;
  interests: string[];
  bio: string;
  avatar: string;
  location: string;
  city: string;
  lat: number;
  lng: number;
  distance: number;
  photos: string[];
  isOnline: boolean;
  isVerified: boolean;
  lastActive: string;
  anthem?: string;
  instagram?: string;
  badges?: string[];
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
  isSuperLike?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type?:
    | "text"
    | "emoji"
    | "image"
    | "gif"
    | "voice"
    | "icebreaker"
    | "date-idea"
    | "system";
  seen?: boolean;
  isWarning?: boolean;
}

export interface DateIdea {
  id: string;
  name: string;
  category: string;
  emoji: string;
  address: string;
  rating: number;
  priceLevel: number;
  distance: number;
  lat: number;
  lng: number;
  image: string;
}

export interface IceBreaker {
  id: string;
  question: string;
  category: string;
  emoji: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  category: string;
  participants: number;
  maxParticipants: number;
  image: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  location: string;
  schedule: string;
  members: number;
  maxMembers: number;
  category: string;
  createdBy: { name: string; avatar: string };
  tags: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  isOnline: boolean;
  rating: number;
  nextSession: string;
}

// Tags
export const interestTags = [
  "Cà phê ☕",
  "Du lịch ✈️",
  "Gym 💪",
  "K-pop 🎵",
  "Gaming 🎮",
  "Phim ảnh 🎬",
  "Nấu ăn 🍳",
  "Yoga 🧘",
  "Nhiếp ảnh 📸",
  "Đọc sách 📚",
  "Bóng đá ⚽",
  "Nhảy múa 💃",
  "Anime 🎌",
  "TikTok 📱",
  "Sáng tạo nội dung 🎨",
  "Thú cưng 🐶",
  "Cầu lông 🏸",
  "Trà sữa 🧋",
  "Khởi nghiệp 🚀",
  "Viết lách ✍️",
  "Podcast 🎧",
  "Thiết kế 🎨",
  "Bóng rổ 🏀",
  "Chạy bộ 🏃",
  "Âm nhạc live 🎸",
  "Wine & Dine 🍷",
  "Board game 🎲",
];

// Avatar helper
const av = (
  seed: string,
  style: "adventurer" | "micah" | "lorelei" = "lorelei",
) =>
  `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=ffd5dc,ffdfbf,c0aede,b6e3f4,d1d4f9`;

// Photo helper
const ph = (id: number, w = 400, h = 560) =>
  `https://picsum.photos/seed/tinder${id}/${w}/${h}`;

export const mockUsers: User[] = [
  {
    id: "me",
    name: "Minh Anh",
    age: 22,
    gender: "female",
    genderPreference: "male",
    occupation: "UX Designer",
    interests: [
      "Cà phê ☕",
      "Du lịch ✈️",
      "K-pop 🎵",
      "Nhiếp ảnh 📸",
      "Thiết kế 🎨",
    ],
    bio: "Design lover ✨ Cà phê sữa đá enthusiast ☕ Looking for someone to explore Saigon with 🏍️",
    avatar: av("minh-anh"),
    location: "Quận 1, TP.HCM",
    city: "TP. Hồ Chí Minh",
    lat: 10.7769,
    lng: 106.7009,
    distance: 0,
    photos: [ph(100), ph(101), ph(102), ph(103), ph(104)],
    isOnline: true,
    isVerified: true,
    lastActive: "Now",
    anthem: "APT. – ROSÉ & Bruno Mars",
    instagram: "@minhanh.design",
    badges: ["Photo Verified", "Top Picks"],
  },
  {
    id: "2",
    name: "Đức Huy",
    age: 24,
    gender: "male",
    genderPreference: "female",
    occupation: "Software Engineer tại FPT",
    interests: [
      "Cà phê ☕",
      "Gaming 🎮",
      "Gym 💪",
      "Du lịch ✈️",
      "Âm nhạc live 🎸",
    ],
    bio: "Code by day, gym by night 💪 Tìm người cùng chill và khám phá quán mới 🍜 182cm",
    avatar: av("duc-huy", "adventurer"),
    location: "Quận 7, TP.HCM",
    city: "TP. Hồ Chí Minh",
    lat: 10.734,
    lng: 106.7218,
    distance: 3,
    photos: [ph(200), ph(201), ph(202), ph(203)],
    isOnline: true,
    isVerified: true,
    lastActive: "2 min ago",
    anthem: "Blinding Lights – The Weeknd",
    instagram: "@duchuy.dev",
    badges: ["Photo Verified"],
  },
  {
    id: "3",
    name: "Thảo Vy",
    age: 21,
    gender: "female",
    genderPreference: "male",
    occupation: "Marketing tại Shopee",
    interests: [
      "K-pop 🎵",
      "Du lịch ✈️",
      "Nấu ăn 🍳",
      "Trà sữa 🧋",
      "Nhảy múa 💃",
    ],
    bio: "BLINK 🖤💖 Dance cover mỗi cuối tuần. Tìm người ăn bún bò cùng 🍜",
    avatar: av("thao-vy"),
    location: "Bình Thạnh, TP.HCM",
    city: "TP. Hồ Chí Minh",
    lat: 10.8031,
    lng: 106.7066,
    distance: 5,
    photos: [ph(300), ph(301), ph(302), ph(303), ph(304), ph(305)],
    isOnline: false,
    isVerified: true,
    lastActive: "1 hour ago",
    anthem: "How You Like That – BLACKPINK",
    badges: ["Photo Verified", "Top Picks"],
  },
  {
    id: "4",
    name: "Khoa Nguyễn",
    age: 25,
    gender: "male",
    genderPreference: "female",
    occupation: "Photographer Freelance",
    interests: [
      "Nhiếp ảnh 📸",
      "Cà phê ☕",
      "Du lịch ✈️",
      "Phim ảnh 🎬",
      "Wine & Dine 🍷",
    ],
    bio: "📸 Golden hour chaser. Sẽ chụp ảnh đẹp cho bạn. 185cm. Cat dad 🐱",
    avatar: av("khoa-nguyen", "adventurer"),
    location: "Quận 3, TP.HCM",
    city: "TP. Hồ Chí Minh",
    lat: 10.7835,
    lng: 106.688,
    distance: 2,
    photos: [ph(400), ph(401), ph(402)],
    isOnline: true,
    isVerified: true,
    lastActive: "Active now",
    anthem: "Golden Hour – JVKE",
    instagram: "@khoa.shoots",
    badges: ["Photo Verified"],
  },
  {
    id: "5",
    name: "Hà My",
    age: 23,
    gender: "female",
    genderPreference: "male",
    occupation: "Content Creator",
    interests: [
      "TikTok 📱",
      "Sáng tạo nội dung 🎨",
      "Yoga 🧘",
      "Đọc sách 📚",
      "Cà phê ☕",
    ],
    bio: "✨ TikTok 200K+ | Introvert giả extrovert | Thích ngồi quán cà phê cả ngày 📚",
    avatar: av("ha-my"),
    location: "Quận 2, TP.HCM",
    city: "TP. Hồ Chí Minh",
    lat: 10.7868,
    lng: 106.739,
    distance: 4,
    photos: [ph(500), ph(501), ph(502), ph(503)],
    isOnline: true,
    isVerified: true,
    lastActive: "Active now",
    badges: ["Photo Verified", "Top Picks"],
  },
  {
    id: "6",
    name: "Bảo Long",
    age: 26,
    gender: "male",
    genderPreference: "female",
    occupation: "Kiến trúc sư",
    interests: [
      "Thiết kế 🎨",
      "Cà phê ☕",
      "Chạy bộ 🏃",
      "Board game 🎲",
      "Phim ảnh 🎬",
    ],
    bio: "Kiến trúc sư ban ngày, bartender bán thời gian ban đêm 🍸 Dog dad – Golden Retriever 🐕",
    avatar: av("bao-long", "micah"),
    location: "Phú Nhuận, TP.HCM",
    city: "TP. Hồ Chí Minh",
    lat: 10.7992,
    lng: 106.6802,
    distance: 6,
    photos: [ph(600), ph(601), ph(602)],
    isOnline: false,
    isVerified: true,
    lastActive: "3 hours ago",
    anthem: "See You Again – Tyler, the Creator",
    badges: ["Photo Verified"],
  },
  {
    id: "7",
    name: "Thanh Tâm",
    age: 22,
    gender: "female",
    genderPreference: "male",
    occupation: "Sinh viên Y khoa",
    interests: ["Gym 💪", "Nấu ăn 🍳", "Thú cưng 🐶", "K-pop 🎵", "Anime 🎌"],
    bio: "Future doctor 🩺 Gym addict 💪 Cook better than your mom (maybe) 👩‍🍳",
    avatar: av("thanh-tam"),
    location: "Gò Vấp, TP.HCM",
    city: "TP. Hồ Chí Minh",
    lat: 10.8381,
    lng: 106.6628,
    distance: 8,
    photos: [ph(700), ph(701), ph(702), ph(703)],
    isOnline: false,
    isVerified: true,
    lastActive: "Yesterday",
  },
];

export const mockMatches: Match[] = [
  { id: "m1", userId1: "me", userId2: "2", timestamp: "2026-02-26T08:00:00" },
  { id: "m2", userId1: "me", userId2: "3", timestamp: "2026-02-25T14:00:00" },
  { id: "m3", userId1: "me", userId2: "5", timestamp: "2026-02-26T10:30:00" },
];

export const mockLikes: Like[] = [
  { fromUserId: "4", toUserId: "me" },
  { fromUserId: "6", toUserId: "me", isSuperLike: true },
  { fromUserId: "7", toUserId: "me" },
];

export const mockMessages: Message[] = [
  {
    id: "s0",
    senderId: "system",
    receiverId: "me",
    content: "Bạn và Đức Huy đã match! Hãy bắt đầu trò chuyện 🔥",
    timestamp: "2026-02-26T08:00:00",
    type: "system",
  },
  {
    id: "m1",
    senderId: "2",
    receiverId: "me",
    content:
      "Hey Minh Anh! Profile đẹp quá 😍 Mình thấy bạn cũng thích cà phê – quán ruột bạn ở đâu?",
    timestamp: "2026-02-26T08:05:00",
    type: "text",
    seen: true,
  },
  {
    id: "m2",
    senderId: "me",
    receiverId: "2",
    content:
      "Hi Huy! Thanks nha 🤭 Mình hay ngồi The Workshop ở Quận 1 đó. Bạn thì sao?",
    timestamp: "2026-02-26T08:08:00",
    type: "text",
    seen: true,
  },
  {
    id: "m3",
    senderId: "2",
    receiverId: "me",
    content:
      "Ồ hay quá! Mình thích Là Việt ở Quận 3. Cuối tuần rảnh thử đi chung Coffee Tour không? ☕",
    timestamp: "2026-02-26T08:12:00",
    type: "text",
    seen: true,
  },
  {
    id: "m4",
    senderId: "me",
    receiverId: "2",
    content: "Sounds fun! Cuối tuần này OK nha 🎉",
    timestamp: "2026-02-26T08:15:00",
    type: "text",
    seen: false,
  },
  {
    id: "m5",
    senderId: "3",
    receiverId: "me",
    content: "Hiiii ✨ Mình cũng BLINK nè! Bạn có đi concert BLACKPINK không?",
    timestamp: "2026-02-25T14:05:00",
    type: "text",
    seen: true,
  },
  {
    id: "m6",
    senderId: "me",
    receiverId: "3",
    content: "Có chứ! Mình còn giữ lightstick 🖤💖 Bạn bias ai?",
    timestamp: "2026-02-25T14:12:00",
    type: "text",
    seen: true,
  },
  {
    id: "m7",
    senderId: "3",
    receiverId: "me",
    content:
      "Lisa forever! 💛 Bạn có muốn đi xem dance cover show tuần sau không?",
    timestamp: "2026-02-25T14:18:00",
    type: "text",
    seen: false,
  },
  {
    id: "m8",
    senderId: "5",
    receiverId: "me",
    content:
      "Hii Minh Anh! Profile aesthetic quá 📸 Bạn chụp bằng camera gì vậy?",
    timestamp: "2026-02-26T10:35:00",
    type: "text",
    seen: false,
  },
];

export const mockDateIdeas: DateIdea[] = [
  {
    id: "d1",
    name: "The Workshop Coffee",
    category: "Café",
    emoji: "☕",
    address: "27 Ngô Đức Kế, Q.1",
    rating: 4.6,
    priceLevel: 2,
    distance: 1.2,
    lat: 10.7745,
    lng: 106.7038,
    image: ph(901, 300, 200),
  },
  {
    id: "d2",
    name: "Landmark 81 SkyView",
    category: "Viewpoint",
    emoji: "🌆",
    address: "Vinhomes Central Park, Bình Thạnh",
    rating: 4.8,
    priceLevel: 3,
    distance: 3.5,
    lat: 10.7955,
    lng: 106.7219,
    image: ph(902, 300, 200),
  },
  {
    id: "d3",
    name: "Thảo Cầm Viên",
    category: "Park",
    emoji: "🌳",
    address: "2 Nguyễn Bỉnh Khiêm, Q.1",
    rating: 4.4,
    priceLevel: 1,
    distance: 2.0,
    lat: 10.7872,
    lng: 106.7057,
    image: ph(903, 300, 200),
  },
  {
    id: "d4",
    name: "Shin Coffee Rooftop",
    category: "Café",
    emoji: "🌙",
    address: "13 Nguyễn Thiệp, Q.1",
    rating: 4.5,
    priceLevel: 2,
    distance: 1.0,
    lat: 10.7756,
    lng: 106.7033,
    image: ph(904, 300, 200),
  },
  {
    id: "d5",
    name: "Pizza 4P's",
    category: "Restaurant",
    emoji: "🍕",
    address: "8 Thủ Khoa Huân, Q.1",
    rating: 4.7,
    priceLevel: 3,
    distance: 1.5,
    lat: 10.7745,
    lng: 106.7002,
    image: ph(905, 300, 200),
  },
  {
    id: "d6",
    name: "Sài Gòn River Walk",
    category: "Walk",
    emoji: "🚶",
    address: "Bến Bạch Đằng, Q.1",
    rating: 4.3,
    priceLevel: 0,
    distance: 0.8,
    lat: 10.7751,
    lng: 106.7067,
    image: ph(906, 300, 200),
  },
];

export const mockIceBreakers: IceBreaker[] = [
  {
    id: "i1",
    question: "Nếu mai là ngày cuối cùng ở Sài Gòn, bạn sẽ đi đâu?",
    category: "Fun",
    emoji: "🏙️",
  },
  {
    id: "i2",
    question: "Quán cà phê yêu thích nhất Sài Gòn?",
    category: "Coffee",
    emoji: "☕",
  },
  {
    id: "i3",
    question: "Bộ phim/series xem đi xem lại không chán?",
    category: "Entertainment",
    emoji: "🎬",
  },
  {
    id: "i4",
    question: "Unpopular opinion về ẩm thực Việt Nam?",
    category: "Food",
    emoji: "🍜",
  },
  {
    id: "i5",
    question: "Playlist bạn đang nghe suốt tuần này?",
    category: "Music",
    emoji: "🎵",
  },
  {
    id: "i6",
    question: "Deal-breaker lớn nhất khi date?",
    category: "Deep",
    emoji: "🤔",
  },
  {
    id: "i7",
    question: "Green flag lớn nhất bạn tìm kiếm?",
    category: "Deep",
    emoji: "🟩",
  },
  {
    id: "i8",
    question: "Weekend lý tưởng của bạn trông như thế nào?",
    category: "Lifestyle",
    emoji: "☀️",
  },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Đêm Nhạc Acoustic Campus",
    description:
      "Cùng chill với những giai điệu acoustic mộc mạc và gặp gỡ những người bạn mới có cùng đam mê âm nhạc.",
    location: "Sân thượng tòa Alpha",
    date: "15/03/2026",
    time: "19:00",
    category: "Music",
    participants: 45,
    maxParticipants: 100,
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80", // Live concert stage
  },
  {
    id: "2",
    title: "Workshop Kỹ Năng UI/UX",
    description:
      "Học cách thiết kế giao diện người dùng hiện đại và quy trình nghiên cứu trải nghiệm khách hàng từ chuyên gia.",
    location: "Phòng 402, Tòa Beta",
    date: "18/03/2026",
    time: "14:00",
    category: "Workshop",
    participants: 28,
    maxParticipants: 30,
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80", // Workshop/team collaboration
  },
  {
    id: "3",
    title: "Giải Bóng Đá Campus Cup",
    description:
      "Giải bóng đá thường niên dành cho sinh viên. Hãy đến cổ vũ cho đội bóng yêu thích của bạn!",
    location: "Sân vận động trung tâm",
    date: "20/03/2026",
    time: "08:00",
    category: "Sports",
    participants: 120,
    maxParticipants: 200,
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80", // Football/soccer match
  },
];

export const mockGroups: StudyGroup[] = [
  {
    id: "g1",
    name: "Nhóm Ôn Thi Đại Số Tuyến Tính",
    subject: "Toán Cao Cấp",
    description:
      "Cùng nhau giải bài tập và ôn lại các kiến thức trọng tâm trước kỳ thi giữa kỳ. Tập trung vào ma trận, định thức và không gian vector.",
    location: "Thư viện tầng 2",
    schedule: "Thứ 2, 4, 6 (18:00)",
    members: 5,
    maxMembers: 10,
    category: "Exam Prep",
    createdBy: { name: "Minh Tuấn", avatar: "minh-tuan" },
    tags: ["Midterm", "Ma trận", "Giải tích"],
    level: "Intermediate",
    isOnline: false,
    rating: 4.8,
    nextSession: "2026-03-27T18:00:00",
  },
  {
    id: "g2",
    name: "CLB Tiếng Anh Giao Tiếp",
    subject: "English",
    description:
      "Môi trường luyện nói tiếng Anh tự nhiên, không áp lực về ngữ pháp. Mỗi buổi có chủ đề riêng và debate mini.",
    location: "Phòng tự học, Tòa Alpha",
    schedule: "Chủ nhật hằng tuần (09:00)",
    members: 12,
    maxMembers: 20,
    category: "Language",
    createdBy: { name: "Thu Hà", avatar: "thu-ha" },
    tags: ["Speaking", "IELTS", "Debate"],
    level: "Beginner",
    isOnline: false,
    rating: 4.6,
    nextSession: "2026-03-30T09:00:00",
  },
  {
    id: "g3",
    name: "Team Dự Án Capstone AI",
    subject: "Computer Science",
    description:
      "Tìm kiếm cộng sự có nền tảng tốt về Python và Machine Learning. Đang xây dựng mô hình nhận diện hình ảnh y tế.",
    location: "Google Meet",
    schedule: "Linh hoạt",
    members: 3,
    maxMembers: 5,
    category: "Project",
    createdBy: { name: "Đức Anh", avatar: "duc-anh" },
    tags: ["Python", "ML", "Capstone"],
    level: "Advanced",
    isOnline: true,
    rating: 4.9,
    nextSession: "2026-03-26T20:00:00",
  },
  {
    id: "g4",
    name: "Ôn Thi JLPT N3",
    subject: "Tiếng Nhật",
    description:
      "Nhóm ôn luyện JLPT N3 tập trung vào ngữ pháp, từ vựng và đọc hiểu. Có tài liệu và đề thi thử.",
    location: "Tòa Gamma",
    schedule: "Thứ 3, 5 (19:30)",
    members: 8,
    maxMembers: 12,
    category: "Language",
    createdBy: { name: "Sakura Trần", avatar: "sakura-tran" },
    tags: ["JLPT", "N3", "Kanji"],
    level: "Intermediate",
    isOnline: false,
    rating: 4.7,
    nextSession: "2026-03-27T19:30:00",
  },
  {
    id: "g5",
    name: "Lập Trình Web Fullstack",
    subject: "IT",
    description:
      "Cùng học React, Node.js và PostgreSQL. Mỗi tuần code 1 mini-project và review code lẫn nhau.",
    location: "Google Meet",
    schedule: "Thứ 7 (14:00)",
    members: 15,
    maxMembers: 15,
    category: "Coding",
    createdBy: { name: "Quốc Khánh", avatar: "quoc-khanh" },
    tags: ["React", "Node.js", "Fullstack"],
    level: "Intermediate",
    isOnline: true,
    rating: 4.9,
    nextSession: "2026-03-29T14:00:00",
  },
  {
    id: "g6",
    name: "Nhóm Vẽ Sketch & Illustration",
    subject: "Mỹ Thuật",
    description:
      "Dành cho những bạn yêu vẽ — từ sketch cơ bản đến digital illustration. Chia sẻ kỹ thuật và cùng nhau sáng tạo.",
    location: "Phòng tự học, Tòa Alpha",
    schedule: "Thứ 4, 6 (16:00)",
    members: 7,
    maxMembers: 10,
    category: "Arts",
    createdBy: { name: "Hạ Vy", avatar: "ha-vy" },
    tags: ["Sketch", "Digital Art", "Procreate"],
    level: "Beginner",
    isOnline: false,
    rating: 4.5,
    nextSession: "2026-03-28T16:00:00",
  },
  {
    id: "g7",
    name: "Ôn Thi Final Kinh Tế Vi Mô",
    subject: "Kinh Tế",
    description:
      "Giải đề cũ, tóm tắt lý thuyết cung cầu, thị trường cạnh tranh và độc quyền. Mục tiêu 8.0+!",
    location: "Thư viện tầng 3",
    schedule: "Thứ 2, 3, 5 (17:00)",
    members: 10,
    maxMembers: 12,
    category: "Exam Prep",
    createdBy: { name: "Phương Linh", avatar: "phuong-linh" },
    tags: ["Final", "Vi mô", "Đề cũ"],
    level: "Intermediate",
    isOnline: false,
    rating: 4.4,
    nextSession: "2026-03-27T17:00:00",
  },
  {
    id: "g8",
    name: "Data Science với Python",
    subject: "IT",
    description:
      "Học Pandas, NumPy và visualization. Phân tích dataset thực tế mỗi tuần. Có mentor hỗ trợ.",
    location: "Google Meet",
    schedule: "Chủ nhật (20:00)",
    members: 9,
    maxMembers: 15,
    category: "Coding",
    createdBy: { name: "Trung Kiên", avatar: "trung-kien" },
    tags: ["Python", "Pandas", "Data"],
    level: "Beginner",
    isOnline: true,
    rating: 4.8,
    nextSession: "2026-03-30T20:00:00",
  },
  {
    id: "g9",
    name: "Nhóm Đồ Án Marketing Plan",
    subject: "Marketing",
    description:
      "Xây dựng Marketing Plan cho sản phẩm thực tế. Cần thêm thành viên giỏi content và design.",
    location: "Phòng tự học, Tòa Gamma",
    schedule: "Linh hoạt (tối)",
    members: 4,
    maxMembers: 6,
    category: "Project",
    createdBy: { name: "Bảo Ngọc", avatar: "bao-ngoc" },
    tags: ["Marketing", "Teamwork", "Content"],
    level: "Intermediate",
    isOnline: false,
    rating: 4.3,
    nextSession: "2026-03-28T19:00:00",
  },
];
