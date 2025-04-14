import { OriginRescueTask } from "./rescue";
import { Task } from "./task";

export type Profile = {
  email: string;
  created_at: string;
  admin: boolean;
  task?: OriginRescueTask | null;
  completedTasks?: OriginRescueTask[];
}