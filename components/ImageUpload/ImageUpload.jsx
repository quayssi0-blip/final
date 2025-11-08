"use client";

import { useState } from "react";
import { Upload, X, Image } from "lucide-react";

const ImageUpload = ({ 
  currentImage, 
  onImageUploaded, 
  type = "project-main", 
  projectId = null,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format de fichier invalide. Seuls JPEG, PNG et WebP sont autorisés.");
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError("Fichier trop volumineux. Taille maximum: 5MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      
      // Only add projectId for project uploads
      if (type === "project-main" && projectId) {
        formData.append("projectId", projectId);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // Include cookies for authentication
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'upload");
      }

      onImageUploaded(result.url);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeImage = () => {
    onImageUploaded("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {currentImage ? (
        <div className="relative">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900 font-medium">Image actuelle</p>
                  <p className="text-xs text-gray-500 truncate max-w-xs">
                    {currentImage}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="text-red-500 hover:text-red-700 p-1"
                title="Supprimer l'image"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-2">
          <div className="flex justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-900 font-medium">
              {uploading ? "Upload en cours..." : "Glissez votre image ici"}
            </p>
            <p className="text-xs text-gray-500">ou</p>
            <label className="inline-block mt-2">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-700 transition-colors">
                {uploading ? "Upload..." : "Sélectionner un fichier"}
              </span>
              <input
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Formats acceptés: JPEG, PNG, WebP (max. 5MB)
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;