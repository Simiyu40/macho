"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Camera, MapPin, AlignLeft, CheckCircle2, ChevronRight, ChevronLeft, AlertTriangle } from "lucide-react";
import { mockAgencies } from "@/data/mock";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SubmitPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [location, setLocation] = useState("Tap to detect location...");
  const [isDetecting, setIsDetecting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [agency, setAgency] = useState("");

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulate photo upload & metadata extraction
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotoPreview(url);
    } else {
      // Fallback for demo
      setPhotoPreview("https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800");
    }
  };

  const detectLocation = () => {
    setIsDetecting(true);
    // Simulate GPS delay
    setTimeout(() => {
      setLocation("Mombasa Road, Near Syokimau (-1.353, 36.924)");
      setIsDetecting(false);
    }, 1500);
  };

  const submitReport = () => {
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Auto redirect after 3s
      setTimeout(() => {
        router.push("/feed");
      }, 3000);
    }, 2000);
  };

  return (
    <div className={styles.container}>
      
      {/* Progress Bar */}
      {!isSuccess && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(step / 4) * 100}%` }} 
            />
          </div>
          <div className={styles.stepsText}>Step {step} of 4</div>
        </div>
      )}

      {/* SUCCESS STATE */}
      {isSuccess && (
        <Card className={styles.successCard}>
          <div className={styles.successIconBox}>
             <CheckCircle2 size={64} className={styles.successIcon} />
          </div>
          <h2 className={styles.successTitle}>Report Submitted!</h2>
          <p className={styles.successText}>
            Thank you for being the eyes of the nation. Your report is now live and gathering heat.
          </p>
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
                <img src={photoPreview} alt="Preview" className={styles.previewImage} />
                <button className={styles.changePhotoBtn} onClick={() => setPhotoPreview(null)}>
                  Retake Photo
                </button>
              </div>
            ) : (
              <label className={styles.uploadLabel}>
                <input type="file" accept="image/*" className={styles.fileInput} onChange={handlePhotoUpload} />
                <div className={styles.uploadIconWrapper}><Camera size={40} /></div>
                <span>Tap to take a photo or upload</span>
                <span className={styles.uploadHint}>JPG, PNG up to 10MB</span>
              </label>
            )}
          </div>

          <div className={styles.navButtons}>
            <Link href="/" style={{ flex: 1 }}><Button variant="ghost" fullWidth>Cancel</Button></Link>
            <Button 
              fullWidth 
              style={{ flex: 1 }}
              onClick={() => setStep(2)} 
              disabled={!photoPreview}
            >
              Next <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}


      {/* STEP 2: LOCATION */}
      {!isSuccess && step === 2 && (
        <div className={`${styles.stepPanel} ${styles.active}`}>
          <h2 className={styles.stepTitle}>Location</h2>
          <p className={styles.stepDesc}>Where exactly is this issue located?</p>
          
          <Card className={styles.locationCard}>
             <div className={styles.mapPlaceholder}>
               {isDetecting ? (
                 <div className={styles.sonar} />
               ) : (
                 <MapPin size={48} color={location !== "Tap to detect location..." ? "var(--color-primary)" : "var(--color-text-muted)"} />
               )}
             </div>
             
             <div className={styles.locationControls}>
               <Input 
                 icon={MapPin}
                 value={location}
                 onChange={(e) => setLocation(e.target.value)}
                 className={styles.locInput}
               />
               <Button 
                 variant="secondary" 
                 fullWidth 
                 onClick={detectLocation}
                 disabled={isDetecting}
               >
                 {isDetecting ? "Detecting GPS..." : "Auto-Detect Current Location"}
               </Button>
             </div>
          </Card>

          <div className={styles.navButtons}>
            <Button variant="ghost" fullWidth onClick={() => setStep(1)} style={{ flex: 1 }}>
              <ChevronLeft size={18} /> Back
            </Button>
            <Button 
              fullWidth 
              onClick={() => setStep(3)} 
              disabled={location === "Tap to detect location..." || isDetecting}
              style={{ flex: 1 }}
            >
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
            <Input 
              label="Short Title" 
              placeholder="e.g. Massive pothole on highway" 
              icon={AlignLeft}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Agency Responsible</label>
              <select 
                className={styles.select}
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
              >
                <option value="" disabled>Select Agency...</option>
                {mockAgencies.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
                <option value="unknown">I don&apos;t know</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Severity</label>
              <div className={styles.severityTabs}>
                {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map(sev => (
                  <button 
                    key={sev}
                    className={`${styles.sevTab} ${severity === sev ? styles[`sev${sev}`] : ""}`}
                    onClick={() => setSeverity(sev)}
                  >
                    {sev === "CRITICAL" && <AlertTriangle size={14} />}
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Detailed Description</label>
              <textarea 
                className={styles.textarea} 
                rows={4} 
                placeholder="Describe the issue, any hazards it poses, how long it's been there..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.navButtons}>
            <Button variant="ghost" fullWidth onClick={() => setStep(2)} style={{ flex: 1 }}>
              <ChevronLeft size={18} /> Back
            </Button>
            <Button 
              fullWidth 
              onClick={() => setStep(4)} 
              disabled={!title || !agency || !description}
              style={{ flex: 1 }}
            >
              Review <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}


      {/* STEP 4: REVIEW & SUBMIT */}
      {!isSuccess && step === 4 && (
        <div className={`${styles.stepPanel} ${styles.active}`}>
          <h2 className={styles.stepTitle}>Review</h2>
          <p className={styles.stepDesc}>Double check your report before making it public.</p>
          
          <Card className={styles.reviewCard}>
            <div className={styles.reviewImage} style={{ backgroundImage: `url(${photoPreview})`}} />
            <div className={styles.reviewContent}>
              <div className={styles.reviewRow}>
                <span className={styles.rLabel}>Title</span>
                <span className={styles.rValue}>{title}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.rLabel}>Location</span>
                <span className={styles.rValue}>{location}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.rLabel}>Agency</span>
                <span className={styles.rValue}>{mockAgencies.find(a => a.id === agency)?.name || "Unknown"}</span>
              </div>
              <div className={styles.reviewRow}>
                <span className={styles.rLabel}>Severity</span>
                <span className={styles.rValue} style={{ color: severity === "CRITICAL" ? "var(--color-status-critical)" : "inherit" }}>
                  {severity}
                </span>
              </div>
            </div>
          </Card>

          <div className={styles.navButtons}>
            <Button variant="ghost" fullWidth onClick={() => setStep(3)} style={{ flex: 1 }} disabled={isSubmitting}>
              <ChevronLeft size={18} /> Back
            </Button>
            <Button 
              fullWidth 
              onClick={submitReport} 
              style={{ flex: 1 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
