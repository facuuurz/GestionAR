"use client";

import { useState, useRef } from "react";
import { updateProfilePicture } from "@/actions/usuarios";

interface ProfilePictureProps {
  userId: number;
  initials: string;
  currentPicture?: string | null;
}

export default function ProfilePicture({ userId, initials, currentPicture }: ProfilePictureProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [picture, setPicture] = useState(currentPicture);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. max 5MB) and type
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida.");
      return;
    }

    setIsUploading(true);
    
    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const result = await updateProfilePicture(userId, base64String);
      
      if (result.success) {
        setPicture(base64String);
      } else {
        alert(result.error);
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        onClick={handleClick}
        className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center text-4xl font-bold shadow-lg mb-4 cursor-pointer overflow-hidden group border-4 border-white dark:border-[#222]"
        title="Haz clic para cambiar tu foto de perfil"
      >
        {picture ? (
          <img src={picture} alt="Foto de perfil" className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
        
        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
        </div>
        
        {/* Loading Spinner */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
    </div>
  );
}
