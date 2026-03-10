export type ReportStatus = "PENDING" | "UNDER_REVIEW" | "RESOLVED";
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface User {
  id: string;
  name: string;
  username?: string;
  avatar_url?: string;
  citizen_credits: number;
}

export interface Agency {
  id: string;
  name: string;
  slug: string;
  color: string;
  verified: boolean;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  county: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  status: ReportStatus;
  severity: Severity;
  location: Location;
  agency_id: string | null;
  user_id: string;
  created_at: string;
  upvotes: number;
  shares: number;
  heat_score: number;
  comments_count: number;
  address?: string | null;
  county?: string | null;
  user?: User;
  agency?: Agency;
}

export interface Comment {
  id: string;
  report_id: string;
  user_id: string;
  content: string;
  created_at: string;
  is_official_response: boolean;
  user?: User;
}

export interface CountyStat {
  county: string;
  pending: number;
  resolved: number;
  heat: number;
}
