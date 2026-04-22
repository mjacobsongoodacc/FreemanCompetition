import type { Database } from "@/types/supabase";

export type Session = Database["public"]["Tables"]["sessions"]["Row"];
export type Turn = Database["public"]["Tables"]["turns"]["Row"];
export type TurnInsert = Database["public"]["Tables"]["turns"]["Insert"];
export type TurnUpdate = Database["public"]["Tables"]["turns"]["Update"];
export type TurnStatus = "pending" | "in_boodlebox" | "responded";

export type ResponsePayload = {
  schema_version: string;
  message_id: string;
  companion: { reply: string; display_time: string; tone?: string };
  streams: Record<string, unknown>;
  meta?: Record<string, unknown>;
} | null;
