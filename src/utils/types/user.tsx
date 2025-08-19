export interface UserItemIProps {
  id: string;
  name: string;
  email: string;
  role: "ATTENDANT" | "SELLER" | "ADMIN";
  createdAt: string;
}
