'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './page.module.css';
import { Camera } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  initials: string;
  userId: string;
}

export default function AvatarUpload({ currentAvatarUrl, initials, userId }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError.message);
        alert('Error uploading image: ' + uploadError.message);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile in DB
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        console.error('Profile update error:', updateError.message);
        return;
      }

      setAvatarUrl(publicUrl + '?t=' + Date.now()); // cache bust
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.avatarWrapper} onClick={() => fileInputRef.current?.click()}>
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt="Profile" 
          className={styles.avatarImage}
        />
      ) : (
        <div className={styles.avatarFallback}>
          <span>{initials}</span>
        </div>
      )}
      <div className={styles.avatarOverlay}>
        <Camera size={18} />
      </div>
      <div className={styles.onlineBadge} />
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        onChange={handleUpload} 
        disabled={uploading}
        style={{ display: 'none' }}
      />
    </div>
  );
}
