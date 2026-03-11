"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Camera, AlignLeft, CheckCircle2, ChevronRight, ChevronLeft, AlertTriangle, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const GoogleMapPicker = dynamic(() => import("@/components/map/GoogleMapPicker"), { ssr: false });

interface AgencyRow {
  id: string;
  name: string;
  slug: string;
  color: string;
  verified: boolean | null;
}

interface CountyRow {
  id: number;
  name: string;
  code: number;
}

interface ConstituencyRow {
  id: number;
  name: string;
  county_id: number;
}

export default function SubmitPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Data from DB
  const [agencies, setAgencies] = useState<AgencyRow[]>([]);
  const [counties, setCounties] = useState<CountyRow[]>([]);
  const [constituencies, setConstituencies] = useState<ConstituencyRow[]>([]);

  // Form State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [locationText, setLocationText] = useState("Click on the map to place a pin...");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [agency, setAgency] = useState("");

  // Custom agency modal
  const [showAddAgency, setShowAddAgency] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState("");

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      const [agenciesRes, countiesRes, constituenciesRes] = await Promise.all([
        supabase.from("agencies").select("*").order("name"),
        supabase.from("counties").select("*").order("name"),
        supabase.from("constituencies").select("*").order("name"),
      ]);
      if (agenciesRes.data) setAgencies(agenciesRes.data);
      if (countiesRes.data) setCounties(countiesRes.data);
      if (constituenciesRes.data) setConstituencies(constituenciesRes.data);
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter constituencies when county changes (derived state via useMemo)
  const filteredConstituencies = useMemo(() => {
    if (selectedCounty) {
      const county = counties.find(c => c.name === selectedCounty);
      if (county) {
        return constituencies.filter(c => c.county_id === county.id);
      }
    }
    return [];
  }, [selectedCounty, counties, constituencies]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleLocationSelect = (selectedLat: number, selectedLng: number) => {
    setLat(selectedLat);
    setLng(selectedLng);
    setLocationText(`${selectedLat.toFixed(4)}, ${selectedLng.toFixed(4)}`);
  };

  const handleAddAgency = async () => {
    if (!newAgencyName.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const slug = newAgencyName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const { data, error } = await supabase.from("agencies").insert({
      name: newAgencyName.trim(),
      slug,
      is_custom: true,
      created_by: user.id,
    }).select().single();

    if (!error && data) {
      setAgencies(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setAgency(data.id);
      setShowAddAgency(false);
      setNewAgencyName("");
    } else {
      alert("Failed to create agency: " + (error?.message || "Unknown error"));
    }
  };

  const submitReport = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to submit a report.");
        router.push("/login");
        return;
      }

      let imageUrl: string | null = null;
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("report-images").upload(fileName, photoFile);
        if (uploadError) {
          alert("Failed to upload image: " + uploadError.message);
          setIsSubmitting(false);
          return;
        }
        const { data: { publicUrl } } = supabase.storage.from("report-images").getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      const locationPoint = lat && lng ? `POINT(${lng} ${lat})` : null;
      const addressText = selectedConstituency
        ? `${selectedConstituency}, ${selectedCounty}`
        : selectedCounty || locationText;

      const { error } = await supabase.from("reports").insert({
        title,
        description,
        image_url: imageUrl,
        status: "PENDING",
        severity,
        location: locationPoint,
        address: addressText,
        county: selectedCounty || "Unknown",
        agency_id: agency && agency !== "unknown" ? agency : null,
        user_id: user.id,
      });

      if (error) {
        alert("Failed to submit report: " + error.message);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => router.push("/feed"), 3000);
    } catch (err) {
      console.error("Submit error:", err);
      alert("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Progress Bar */}
      {!isSuccess && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(step / 4) * 100}%` }} />
          </div>
          <div className={styles.stepsText}>Step {step} of 4</div>
        </div>
      )}

      {/* SUCCESS */}
      {isSuccess && (
        <Card className={styles.successCard}>
          <div className={styles.successIconBox}>
            <CheckCircle2 size={64} className={styles.successIcon} />
          </div>
          <h2 className={styles.successTitle}>Report Submitted!</h2>
          <p className={styles.successText}>Thank you for being the eyes of the nation. Your report is now live and gathering heat.</p>
          <div className={styles.heatBadge}>🔥 +50 Citizen Credits Earned</div>
          <p className={styles.redirectText}>Redirecting to feed...</p>
        </Card>
      )}

      {/* STEP 1: PHOTO */}
      {!isSuccess && step === 1 && (
        <div className={`${styles.stepPanel} ${styles.active}`}>
          <h2 className={styles.stepTitle}>Evidence</h2>
          <p className={styles.stepDesc}>Snap a clear photo of the infrastructure issue.</p>
          <div className={styles.uploadZone}>
            {photoPreview ? (
              <div className={styles.previewContainer}>
                <Image src={photoPreview} alt="Preview" className={styles.previewImage} width={600} height={300} unoptimized style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                <button className={styles.changePhotoBtn} onClick={() => { setPhotoPreview(null); setPhotoFile(null); }}>Retake Photo</button>
              </div>
            ) : (
              <label className={styles.uploadLabel}>
                <input type="file" accept="image/*" className={styles.fileInput} onChange={handlePhotoUpload} />
                <div className={styles.uploadIconWrapper}><Camera size={40} /></div>
                <span>Tap to take a photo or upload</span>
                <span className={styles.uploadHint}>JPG, PNG up to 5MB</span>
              </label>
            )}
          </div>
          <div className={styles.navButtons}>
            <Link href="/" style={{ flex: 1 }}><Button variant="ghost" fullWidth>Cancel</Button></Link>
            <Button fullWidth style={{ flex: 1 }} onClick={() => setStep(2)} disabled={!photoPreview}>
              Next <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: LOCATION */}
      {!isSuccess && step === 2 && (
        <div className={`${styles.stepPanel} ${styles.active}`}>
          <h2 className={styles.stepTitle}>Location</h2>
          <p className={styles.stepDesc}>Pin the exact location on the map and select county.</p>

          <GoogleMapPicker onLocationSelect={handleLocationSelect} initialLat={lat || undefined} initialLng={lng || undefined} />

          <div className={styles.formGrid} style={{ marginTop: 16 }}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>County</label>
              <select className={styles.select} value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)}>
                <option value="">Select County...</option>
                {counties.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {filteredConstituencies.length > 0 && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Constituency</label>
                <select className={styles.select} value={selectedConstituency} onChange={(e) => setSelectedConstituency(e.target.value)}>
                  <option value="">Select Constituency...</option>
                  {filteredConstituencies.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className={styles.navButtons}>
            <Button variant="ghost" fullWidth onClick={() => setStep(1)} style={{ flex: 1 }}>
              <ChevronLeft size={18} /> Back
            </Button>
            <Button fullWidth onClick={() => setStep(3)} disabled={!selectedCounty} style={{ flex: 1 }}>
              Next <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS */}
      {!isSuccess && step === 3 && (
        <div className={`${styles.stepPanel} ${styles.active}`}>
          <h2 className={styles.stepTitle}>Details</h2>
          <p className={styles.stepDesc}>Provide context to help agencies fix it faster.</p>
          <div className={styles.formGrid}>
            <Input label="Short Title" placeholder="e.g. Massive pothole on highway" icon={AlignLeft} value={title} onChange={(e) => setTitle(e.target.value)} />

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Agency Responsible</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select className={styles.select} value={agency} onChange={(e) => { if (e.target.value === '__add__') { setShowAddAgency(true); } else { setAgency(e.target.value); } }} style={{ flex: 1 }}>
                  <option value="" disabled>Select Agency...</option>
                  {agencies.map(a => (
                    <option key={a.id} value={a.id}>{a.name}{a.verified === false ? '' : ' ✓'}</option>
                  ))}
                  <option value="unknown">I don&apos;t know</option>
                  <option value="__add__">➕ Add New Agency</option>
                </select>
              </div>
              {showAddAgency && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <input
                    className={styles.select}
                    placeholder="New agency name..."
                    value={newAgencyName}
                    onChange={(e) => setNewAgencyName(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Button onClick={handleAddAgency} disabled={!newAgencyName.trim()}>
                    <Plus size={16} /> Add
                  </Button>
                </div>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Severity</label>
              <div className={styles.severityTabs}>
                {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map(sev => (
                  <button key={sev} className={`${styles.sevTab} ${severity === sev ? styles[`sev${sev}`] : ""}`} onClick={() => setSeverity(sev)}>
                    {sev === "CRITICAL" && <AlertTriangle size={14} />} {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Detailed Description</label>
              <textarea className={styles.textarea} rows={4} placeholder="Describe the issue, any hazards it poses, how long it's been there..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
          <div className={styles.navButtons}>
            <Button variant="ghost" fullWidth onClick={() => setStep(2)} style={{ flex: 1 }}>
              <ChevronLeft size={18} /> Back
            </Button>
            <Button fullWidth onClick={() => setStep(4)} disabled={!title || !agency || !description} style={{ flex: 1 }}>
              Review <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW */}
      {!isSuccess && step === 4 && (
        <div className={`${styles.stepPanel} ${styles.active}`}>
          <h2 className={styles.stepTitle}>Review</h2>
          <p className={styles.stepDesc}>Double check your report before making it public.</p>
          <Card className={styles.reviewCard}>
            <div className={styles.reviewImage} style={{ backgroundImage: `url(${photoPreview})` }} />
            <div className={styles.reviewContent}>
              <div className={styles.reviewRow}>
                <span className={styles.rLabel}>Title</span>
                <span className={styles.rValue}>{title}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.rLabel}>Location</span>
                <span className={styles.rValue}>{selectedConstituency ? `${selectedConstituency}, ` : ""}{selectedCounty}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.rLabel}>GPS</span>
                <span className={styles.rValue}>{lat && lng ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : "Not set"}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.rLabel}>Agency</span>
                <span className={styles.rValue}>{agencies.find(a => a.id === agency)?.name || "Unknown"}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.rLabel}>Severity</span>
                <span className={styles.rValue} style={{ color: severity === "CRITICAL" ? "var(--color-status-critical)" : "inherit" }}>{severity}</span>
              </div>
            </div>
          </Card>
          <div className={styles.navButtons}>
            <Button variant="ghost" fullWidth onClick={() => setStep(3)} style={{ flex: 1 }} disabled={isSubmitting}>
              <ChevronLeft size={18} /> Back
            </Button>
            <Button fullWidth onClick={submitReport} style={{ flex: 1 }} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
