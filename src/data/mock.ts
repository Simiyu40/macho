import { User, Agency, Report } from "@/types";

export const mockUsers: User[] = [
  { id: "u1", name: "Njeri Muthoni", citizen_credits: 450 },
  { id: "u2", name: "Ochieng O.", citizen_credits: 1250 },
  { id: "u3", name: "Wanjiku K.", citizen_credits: 890 },
];

export const mockAgencies: Agency[] = [
  { id: "a1", name: "Kenya Power", slug: "kplc", color: "#00e5ff", verified: true },
  { id: "a2", name: "KeNHA", slug: "kenha", color: "#ffab00", verified: true },
  { id: "a3", name: "Nairobi Water", slug: "nairobi-water", color: "#6c3ce0", verified: true },
  { id: "a4", name: "KURA", slug: "kura", color: "#ff1744", verified: true },
];

export const mockReports: Report[] = [
  {
    id: "r1",
    title: "Massive crater on Mombasa Road",
    description: "This pothole near the Syokimau turnoff has caused 3 tire bursts this morning alone. Completely unavoidable.",
    image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    status: "UNDER_REVIEW",
    severity: "CRITICAL",
    location: {
      lat: -1.353396,
      lng: 36.924294,
      address: "Mombasa Rd near Syokimau",
      county: "Machakos",
    },
    agency_id: "a2",
    user_id: "u2",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    upvotes: 1405,
    shares: 342,
    heat_score: 1405 + (342 * 5), // 3115
    comments_count: 89,
    user: mockUsers[1],
    agency: mockAgencies[1],
  },
  {
    id: "r2",
    title: "Open manhole in CBD",
    description: "Cover stolen weeks ago on Kimathi street. Very dangerous for pedestrians at night.",
    image_url: "https://images.unsplash.com/photo-1623838423238-d62fdb0b9ad4?auto=format&fit=crop&q=80&w=800",
    status: "PENDING",
    severity: "HIGH",
    location: {
      lat: -1.28333,
      lng: 36.81667,
      address: "Kimathi St, CBD",
      county: "Nairobi",
    },
    agency_id: "a3",
    user_id: "u1",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hrs ago
    upvotes: 450,
    shares: 80,
    heat_score: 450 + (80 * 5), // 850
    comments_count: 12,
    user: mockUsers[0],
    agency: mockAgencies[2],
  },
  {
    id: "r3",
    title: "Fallen transformer pole",
    description: "Pole is leaning heavily on a residential fence in Kileleshwa, sparking during rain.",
    image_url: "https://images.unsplash.com/photo-1596774641951-419b782ca5c0?auto=format&fit=crop&q=80&w=800",
    status: "RESOLVED",
    severity: "CRITICAL",
    location: {
      lat: -1.275,
      lng: 36.790,
      address: "Mandera Rd, Kileleshwa",
      county: "Nairobi",
    },
    agency_id: "a1",
    user_id: "u3",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    upvotes: 3200,
    shares: 890,
    heat_score: 3200 + (890 * 5),
    comments_count: 234,
    user: mockUsers[2],
    agency: mockAgencies[0],
  }
];

export const siteStats = {
  reportsFiled: 42890,
  issuesResolved: 15420,
  countiesActive: 47,
  citizensEngaged: 128500
};
