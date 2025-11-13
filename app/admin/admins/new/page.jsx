"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useAdmins } from "../../../../hooks/useAdmins";
import AdminButton from "@/components/AdminButton/AdminButton";
import AdminCard from "@/components/AdminCard/AdminCard";
import AdminInput from "@/components/AdminInput/AdminInput";

export default function NewAdminPage() {
  const router = useRouter();
  const { createAdmin } = useAdmins();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "content_manager",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Veuillez saisir une adresse email valide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!formData.role) {
      newErrors.role = "Le rôle est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare admin data (remove confirmPassword and extra fields)
      const { confirmPassword, ...adminData } = formData;
      
      // Use the hook to create admin
      await createAdmin(adminData);
      
      // Success - redirect to admins list
      router.push("/admin/admins");
    } catch (error) {
      console.error("Error creating admin:", error.message);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-text-primary)]">
            Ajouter un Nouvel Administrateur
          </h1>
          <p className="text-[var(--admin-text-muted)]">Créer un nouveau compte administrateur</p>
        </div>
        <AdminButton variant="outline">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <Link href="/admin/admins">Retour aux Administrateurs</Link>
        </AdminButton>
      </div>

      {/* Form */}
      <AdminCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2"
            >
              Adresse Email *
            </label>
            <AdminInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full ${errors.email ? "border-red-300" : ""}`}
              placeholder="admin@exemple.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2"
            >
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.role ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="content_manager">Gestionnaire de Contenu</option>
              <option value="message_manager">Gestionnaire de Messages</option>
              <option value="super_admin">Super Administrateur</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2"
            >
              Mot de Passe *
            </label>
            <AdminInput
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full ${errors.password ? "border-red-300" : ""}`}
              placeholder="Saisir le mot de passe"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2"
            >
              Confirmer le Mot de Passe *
            </label>
            <AdminInput
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full ${errors.confirmPassword ? "border-red-300" : ""}`}
              placeholder="Confirmer le mot de passe"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <AdminButton variant="outline">
              <Link href="/admin/admins">Annuler</Link>
            </AdminButton>
            <AdminButton variant="primary" type="submit" disabled={loading} loading={loading}>
              <Save className="h-5 w-5 mr-2" />
              {loading ? "Création..." : "Créer l'Admin"}
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
