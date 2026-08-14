export type ApplicationStatus = "pending" | "in_review" | "approved" | "rejected";
export type AppRole = "admin" | "reviewer" | "event_manager" | "support";
export type EventStatus = "draft" | "upcoming" | "completed" | "cancelled";
export type TicketStatus = "confirmed" | "checked_in" | "cancelled";

export type { Database, Json } from "./database.types";
