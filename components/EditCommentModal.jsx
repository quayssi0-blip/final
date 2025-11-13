"use client";

import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";

export default function EditCommentModal({ comment, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (comment && isOpen) {
      setFormData({
        name: comment.name || "",
        email: comment.email || "",
        message: comment.message || "",
      });
      setErrors({});
    }
  }, [comment, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.length > 100) {
      newErrors.name = "Le nom ne peut pas dépasser 100 caractères";
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Le message ne peut pas dépasser 1000 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedData = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        message: formData.message.trim(),
      };

      await onSave(comment.id, updatedData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen || !comment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Modifier le commentaire</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* General error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Name field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Nom du commentateur"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email (optionnel)
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Message field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              id="message"
              rows={6}
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.message ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Contenu du commentaire"
            />
            <div className="mt-1 flex justify-between">
              {errors.message && (
                <p className="text-sm text-red-600">{errors.message}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.message.length}/1000 caractères
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Aperçu du commentaire</h3>
            <div className="bg-white p-3 rounded border">
              <div className="text-sm font-medium text-gray-900">
                {formData.name || "Nom"}
              </div>
              {formData.email && (
                <div className="text-xs text-gray-500">{formData.email}</div>
              )}
              <div className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                {formData.message || "Message..."}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}