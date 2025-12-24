import type { Raffle, Ticket } from "@/lib/types/raffle";
import type { Order } from "@/lib/types/order";
import type { User } from "@/lib/types/user";
import * as crypto from "crypto";

// In-memory database для MVP
// В продакшені замінити на реальну БД

let raffles: Raffle[] = [
  {
    id: "r1",
    title: "BMW X5 2023",
    description: "Новий BMW X5, 3.0 літра, повний привід. Пробіг 0 км.",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 1000,
    ticketsSold: 342,
    ticketPrice: 500,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    category: "Автомобілі",
    platformFeePercent: 10,
  },
  {
    id: "r2",
    title: "iPhone 15 Pro Max 256GB",
    description: "Брендовий смартфон Apple, колір Natural Titanium. Новий в коробці.",
    imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 500,
    ticketsSold: 500,
    ticketPrice: 200,
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    winnerTicketId: "t123",
    winnerUserId: "u_winner",
    category: "Техніка",
    platformFeePercent: 10,
  },
  {
    id: "r3",
    title: "Квартира 2-к, 65 м²",
    description: "Сучасна квартира в новобудові, центр міста. Повна мебльована.",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 2000,
    ticketsSold: 156,
    ticketPrice: 5000,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    category: "Нерухомість",
    platformFeePercent: 10,
  },
  {
    id: "r4",
    title: "Mercedes-Benz E-Class 2022",
    description: "Престижний седан, 2.0 л, повний привід, пробіг 15 тис. км. Відмінний стан.",
    imageUrl: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 800,
    ticketsSold: 423,
    ticketPrice: 750,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    category: "Автомобілі",
    platformFeePercent: 10,
  },
  {
    id: "r5",
    title: "MacBook Pro 16 M3 Pro",
    description: "Потужний ноутбук Apple, 16 дюймів, 1TB SSD, 18GB RAM. Новий в упаковці.",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 300,
    ticketsSold: 89,
    ticketPrice: 500,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    category: "Техніка",
    platformFeePercent: 10,
  },
  {
    id: "r6",
    title: "Золота ланцюжок 585 проби",
    description: "Якісна золота ланцюжок, довжина 60 см, вага 25 г. З сертифікатом.",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 200,
    ticketsSold: 134,
    ticketPrice: 300,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 5400000).toISOString(),
    category: "Коштовності",
    platformFeePercent: 10,
  },
  {
    id: "r7",
    title: "Rolex Submariner",
    description: "Легендарний годинник Rolex, стальний корпус, автентичний. Відмінний стан.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 1500,
    ticketsSold: 892,
    ticketPrice: 1000,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
    category: "Коштовності",
    platformFeePercent: 10,
  },
  {
    id: "r8",
    title: "Sony PlayStation 5 + 5 ігор",
    description: "Ігрова консоль PS5, 825GB SSD, 5 ексклюзивних ігор включено. Нова.",
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 400,
    ticketsSold: 267,
    ticketPrice: 250,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
    category: "Техніка",
    platformFeePercent: 10,
  },
  {
    id: "r9",
    title: "Діамантове кільце 1.5 карата",
    description: "Розкішне кільце з діамантом, платина, розмір 16. З оціночним сертифікатом.",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 600,
    ticketsSold: 445,
    ticketPrice: 800,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    category: "Коштовності",
    platformFeePercent: 10,
  },
  {
    id: "r10",
    title: "Tesla Model 3 2023",
    description: "Електромобіль Tesla, пробіг 8 тис. км, повний пакет опцій. Відмінний стан.",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 1200,
    ticketsSold: 678,
    ticketPrice: 1200,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
    category: "Автомобілі",
    platformFeePercent: 10,
  },
  {
    id: "r11",
    title: "Будинок 120 м² з ділянкою",
    description: "Окремий будинок, 3 спальні, кухня-вітальня, гараж. Ділянка 8 соток.",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 3000,
    ticketsSold: 234,
    ticketPrice: 8000,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 21600000).toISOString(),
    category: "Нерухомість",
    platformFeePercent: 10,
  },
  {
    id: "r12",
    title: "Canon EOS R5 + об'єктив",
    description: "Професійна камера Canon, 45MP, відео 8K, об'єктив 24-70mm f/2.8. Нова.",
    imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 500,
    ticketsSold: 312,
    ticketPrice: 600,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 2700000).toISOString(),
    category: "Техніка",
    platformFeePercent: 10,
  },
  {
    id: "r13",
    title: "Audi Q7 2021",
    description: "Преміум позашляховик, 3.0 TDI, 7 місць, повний привід. Пробіг 20 тис. км.",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 900,
    ticketsSold: 567,
    ticketPrice: 900,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    updatedAt: new Date(Date.now() - 12600000).toISOString(),
    category: "Автомобілі",
    platformFeePercent: 10,
  },
  {
    id: "r14",
    title: "Samsung Galaxy S24 Ultra",
    description: "Флагманський смартфон, 256GB, S Pen включено. Новий в коробці.",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 400,
    ticketsSold: 123,
    ticketPrice: 400,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    category: "Техніка",
    platformFeePercent: 10,
  },
  {
    id: "r15",
    title: "Золоті сережки з діамантами",
    description: "Елегантні сережки, 585 проба, діаманти 0.5 карата. З сертифікатом.",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 250,
    ticketsSold: 89,
    ticketPrice: 350,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 5400000).toISOString(),
    category: "Коштовності",
    platformFeePercent: 10,
  },
  {
    id: "r16",
    title: "Nike Air Max 270",
    description: "Спортивне взуття, розмір 42, колір чорний/білий. Нова пара.",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 150,
    ticketsSold: 67,
    ticketPrice: 150,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    category: "Інше",
    platformFeePercent: 10,
  },
  {
    id: "r17",
    title: "Apple Watch Series 9",
    description: "Розумний годинник Apple, 45mm, GPS + Cellular. Новий.",
    imageUrl: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 300,
    ticketsSold: 198,
    ticketPrice: 350,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    category: "Техніка",
    platformFeePercent: 10,
  },
  {
    id: "r18",
    title: "Планшет iPad Pro 12.9",
    description: "Планшет Apple, 256GB, Wi-Fi, M2 чип. Новий в упаковці.",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 600,
    ticketsSold: 234,
    ticketPrice: 450,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
    category: "Техніка",
    platformFeePercent: 10,
  },
  {
    id: "r19",
    title: "Набір ювелірних прикрас",
    description: "Комплект: кільце, сережки, ланцюжок. 585 проба. В елегантній коробці.",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 500,
    ticketsSold: 312,
    ticketPrice: 600,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 9000000).toISOString(),
    category: "Коштовності",
    platformFeePercent: 10,
  },
  {
    id: "r20",
    title: "Гітара Fender Stratocaster",
    description: "Електрогітара, класична модель, чорний колір. Відмінний стан.",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    sellerId: "u_demo",
    sellerEmail: "demo@demo.com",
    totalTickets: 350,
    ticketsSold: 145,
    ticketPrice: 300,
    status: "active",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
    category: "Інше",
    platformFeePercent: 10,
  },
];

let tickets: Ticket[] = [];
let orders: Order[] = [];
let ticketCounter = 1;

// Просте хешування для MVP (в продакшені використовувати bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// In-memory користувачі
let users: User[] = [
  {
    id: "u_demo",
    email: "demo@demo.com",
    passwordHash: hashPassword("password"), // password
    role: "user",
    name: "Демо Користувач",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    canSell: true, // Увімкнений режим продавця
    balance: 15000, // Початковий баланс
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "u_admin",
    email: "admin@admin.com",
    passwordHash: hashPassword("admin"), // admin
    role: "admin",
    name: "Адмін",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    balance: 50000, // Баланс адміна
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
];

let userCounter = 1000;

export const mockDb = {
  raffles: {
    findAll: (): Raffle[] => [...raffles],
    findById: (id: string): Raffle | undefined => raffles.find((r) => r.id === id),
    findBySeller: (sellerId: string): Raffle[] => raffles.filter((r) => r.sellerId === sellerId),
    create: (raffle: Omit<Raffle, "id" | "createdAt" | "updatedAt" | "ticketsSold" | "status">): Raffle => {
      const newRaffle: Raffle = {
        ...raffle,
        id: `r${Date.now()}`,
        ticketsSold: 0,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      raffles.push(newRaffle);
      return newRaffle;
    },
    update: (id: string, updates: Partial<Raffle>): Raffle | null => {
      const idx = raffles.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      raffles[idx] = { ...raffles[idx], ...updates, updatedAt: new Date().toISOString() };
      return raffles[idx];
    },
    delete: (id: string): boolean => {
      const idx = raffles.findIndex((r) => r.id === id);
      if (idx === -1) return false;
      raffles.splice(idx, 1);
      return true;
    },
  },
  tickets: {
    findByRaffle: (raffleId: string): Ticket[] => tickets.filter((t) => t.raffleId === raffleId),
    findByUser: (userId: string): Ticket[] => tickets.filter((t) => t.userId === userId),
    createMany: (data: Array<{ raffleId: string; userId: string; userEmail: string }>): Ticket[] => {
      const raffle = raffles.find((r) => r.id === data[0]?.raffleId);
      if (!raffle) throw new Error("Raffle not found");

      const newTickets: Ticket[] = data.map((d) => {
        const ticket: Ticket = {
          id: `t${ticketCounter++}`,
          raffleId: d.raffleId,
          userId: d.userId,
          userEmail: d.userEmail,
          ticketNumber: raffle.ticketsSold + tickets.filter((t) => t.raffleId === d.raffleId).length + data.indexOf(d) + 1,
          purchasedAt: new Date().toISOString(),
          isWinner: false,
        };
        tickets.push(ticket);
        return ticket;
      });

      raffle.ticketsSold += newTickets.length;
      return newTickets;
    },
    setWinner: (ticketId: string): Ticket | null => {
      const ticket = tickets.find((t) => t.id === ticketId);
      if (!ticket) return null;
      ticket.isWinner = true;
      return ticket;
    },
  },
  orders: {
    create: (order: Omit<Order, "id" | "createdAt" | "updatedAt">): Order => {
      const newOrder: Order = {
        ...order,
        id: `o${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      orders.push(newOrder);
      return newOrder;
    },
    findById: (id: string): Order | undefined => orders.find((o) => o.id === id),
    findByUser: (userId: string): Order[] => orders.filter((o) => o.userId === userId),
    update: (id: string, updates: Partial<Order>): Order | null => {
      const idx = orders.findIndex((o) => o.id === id);
      if (idx === -1) return null;
      orders[idx] = { ...orders[idx], ...updates, updatedAt: new Date().toISOString() };
      return orders[idx];
    },
  },
  users: {
    findByEmail: (email: string): User | undefined => users.find((u) => u.email === email),
    findById: (id: string): User | undefined => users.find((u) => u.id === id),
    create: (input: { email: string; password: string; role?: "user" | "seller" | "admin" }): User => {
      // Перевірка чи email вже існує
      if (users.find((u) => u.email === input.email)) {
        throw new Error("Email вже використовується");
      }

      const newUser: User = {
        id: `u_${userCounter++}`,
        email: input.email,
        passwordHash: hashPassword(input.password),
        role: input.role || "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(newUser);
      return newUser;
    },
    update: (id: string, updates: Partial<Pick<User, "name" | "avatarUrl" | "canSell" | "balance">>): User | null => {
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      users[idx] = {
        ...users[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return users[idx];
    },
    verifyCredentials: (email: string, password: string): User | null => {
      const user = users.find((u) => u.email === email);
      if (!user || !verifyPassword(password, user.passwordHash)) {
        return null;
      }
      return user;
    },
  },
};

// Експортуємо функції для використання в API
export { hashPassword, verifyPassword };

