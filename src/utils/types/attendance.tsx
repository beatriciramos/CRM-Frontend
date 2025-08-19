import { CustomerIProps } from "./customer";

export interface AttendanceIProps {
  id: string;
  customerId: string;
  userId: string;
  channel: string;
  subject: string;
  notes: string;
  status: string;
  createdAt: string;
  customer?: CustomerIProps;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
