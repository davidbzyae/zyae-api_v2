import { User } from "@/models";

export type DeviceInfo = {
  os: string;
  browser: string;
};

export type GeoLocation = {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
};

export type Client = {
  app: "idle" | "bytes" | "music";
  socketId: string;
  ipAddress: string;
  userAgent: string;
  deviceInfo: DeviceInfo;
  geoLocation: GeoLocation | null;
};

export type Session = {
  id: string;
  user: User;
  userId: string;
  clients: Client[];
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  updatedAt: Date;
};
