export type ReportStatus = "PENDING" | "UNDER_REVIEW" | "RESOLVED";
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface User {
  id: string;
  name: string;
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
  image_url: string;
  status: ReportStatus;
  severity: Severity;
  location: Location;
  agency_id: string;
  user_id: string;
  created_at: string;
  upvotes: number;
  shares: number;
  heat_score: number; // calculated: upvotes + (shares * 5)
  comments_count: number;
  user?: User;         // Nested for mock data
  agency?: Agency;     // Nested for mock data
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
