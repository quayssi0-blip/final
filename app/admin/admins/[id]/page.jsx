"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useAdmins } from "../../../../hooks/useAdmins";
import AdminCard from "../../../../components/AdminCard/AdminCard";
import AdminButton from "../../../../components/AdminButton/AdminButton";
import AdminInput from "../../../../components/AdminInput/AdminInput";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";

export default function EditAdminPage() {
  const params = useParams();
  const router = useRouter();
  const { admins, updateAdmin, deleteAdmin, mutate } = useAdmins();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "content_manager",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAdmin = async () => {
      if (admins && admins.length > 0) {
        // Find the admin from the list
        const foundAdmin = admins.find(admin => admin.id === params.id);
        if (foundAdmin) {
          setFormData({
            email: foundAdmin.email || "",
            role: foundAdmin.role || "content_manager",
          });
        }
        setLoading(false);
      } else if (admins) {
        // Admins loaded but not found
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [params.id, admins]);

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

    setSaving(true);

    try {
      // Use the hook to update the admin
      await updateAdmin(params.id, formData);
      
      // Success - redirect to admins list
      router.push("/admin/admins");
    } catch (error) {
      console.error("Error updating admin:", error.message);
      setErrors({ submit: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer cet administrateur ? Cette action ne peut pas être annulée.",
      )
    ) {
      try {
        // Use the hook to delete the admin
        await deleteAdmin(params.id);
        
        // Success - redirect to admins list
        router.push("/admin/admins");
      } catch (error) {
        console.error("Error deleting admin:", error.message);
        setErrors({ submit: error.message });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-text-primary)]">
            Modifier l'Administrateur
          </h1>
          <p className="text-[var(--admin-text-muted)]">
            Mettre à jour les informations et permissions de l'administrateur
          </p>
        </div>
        <AdminButton
          variant="secondary"
          as={Link}
          href="/admin/admins"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour aux Administrateurs
        </AdminButton>
      </div>

      {/* Form */}
      <AdminCard className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <AdminCard className="bg-red-50 border-red-200">
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </AdminCard>
          )}

          {/* Email */}
          <AdminInput
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!errors.email}
            required
            label="Adresse Email"
            placeholder="admin@exemple.com"
            helperText={errors.email}
          />

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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
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

          {/* Submit Buttons */}
          <div className="flex justify-between">
            <AdminButton
              variant="danger"
              onClick={handleDelete}
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Supprimer l'Admin
            </AdminButton>

            <div className="flex space-x-3">
              <AdminButton
                variant="secondary"
                as={Link}
                href="/admin/admins"
              >
                Annuler
              </AdminButton>
              <AdminButton
                type="submit"
                loading={saving}
              >
                <Save className="h-5 w-5 mr-2" />
                Sauvegarder les Modifications
              </AdminButton>
            </div>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
