"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useBlogs } from "../../../../hooks/useBlogs";
import ImageUpload from "../../../../components/ImageUpload/ImageUpload";
import AdminButton from "@/components/AdminButton/AdminButton";
import AdminCard from "@/components/AdminCard/AdminCard";
import AdminInput from "@/components/AdminInput/AdminInput";

export default function NewBlogPage() {
  const router = useRouter();
  const { createBlog, mutate } = useBlogs();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",
    tags: "",
    category: "general",
    image: null,
    share_on_social: false,
  });
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Auto-generate slug from title
    if (name === "title") {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .trim();
      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }
  };

  const handleImageUploaded = (url) => {
    setFormData((prev) => ({
      ...prev,
      image: url || null,
    }));
    setImageUrl(url);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Le slug est requis";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Le slug ne peut contenir que des lettres minuscules, des chiffres et des traits d'union";
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "L'extrait est requis";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Le contenu est requis";
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
      // Create blog with image URL (already uploaded by ImageUpload component)
      const blogData = {
        ...formData,
        image: imageUrl,
        category: formData.category, // Use selected category
        tags: formData.tags, // Keep tags as string
      };

      // Use the hook to create blog
      await createBlog(blogData);

      // Actualiser la liste des blogs
      mutate();

      // Succès - redirection vers la liste des blogs
      router.push("/admin/blogs");
    } catch (error) {
      console.error("Erreur lors de la création du blog :", error.message);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <AdminCard className="page-header-card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--admin-text-primary)] mb-2">
              Nouvel Article de Blog
            </h1>
            <p className="text-[var(--admin-text-secondary)] text-lg">
              Créez un nouvel article pour votre site web
            </p>
          </div>
          <AdminButton variant="secondary" size="lg">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <Link href="/admin/blogs" className="text-[var(--admin-text-primary)]">Retour aux Articles</Link>
          </AdminButton>
        </div>
      </AdminCard>

      {/* Form */}
      <AdminCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <AdminCard className="border-[var(--admin-error)] bg-[var(--admin-error)]/10 mb-6">
              <p className="text-[var(--admin-error)] text-sm font-medium">{errors.submit}</p>
            </AdminCard>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[var(--admin-text-primary)] mb-2"
            >
              Titre *
            </label>
            <AdminInput
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full ${errors.title ? "border-[var(--admin-error)]" : ""}`}
              placeholder="Entrez le titre de l'article de blog"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-[var(--admin-error)]">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-[var(--admin-text-primary)] mb-2"
            >
              Slug *
            </label>
            <AdminInput
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className={`w-full ${errors.slug ? "border-[var(--admin-error)]" : ""}`}
              placeholder="slug-de-l-article"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-[var(--admin-error)]">{errors.slug}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-[var(--admin-text-primary)] mb-2"
            >
              Statut *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[var(--admin-border-medium)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary-500)] focus:border-transparent"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-[var(--admin-text-primary)] mb-2"
            >
              Catégorie *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[var(--admin-border-medium)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary-500)] focus:border-transparent"
            >
              <option value="education">Éducation</option>
              <option value="autonomisation">Autonomisation des Femmes</option>
              <option value="projets-sociaux">Projets Sociaux</option>
              <option value="actualites">Actualités</option>
              <option value="formation">Formation</option>
              <option value="solidarite">Solidarité</option>
              <option value="partenariats">Partenariats</option>
              <option value="temoignages">Témoignages</option>
              <option value="benevolat">Bénévolat</option>
              <option value="impact-social">Impact Social</option>
            </select>
          </div>

          {/* Share on social media */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="share_on_social"
              name="share_on_social"
              checked={formData.share_on_social}
              onChange={handleInputChange}
              className="h-4 w-4 text-[var(--admin-primary-600)] focus:ring-[var(--admin-primary-500)] border-[var(--admin-border-medium)] rounded"
            />
            <label
              htmlFor="share_on_social"
              className="ml-2 block text-sm text-[var(--admin-text-primary)]"
            >
              Partager sur les réseaux sociaux
            </label>
          </div>

          {/* Excerpt */}
          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-[var(--admin-text-primary)] mb-2"
            >
              Extrait *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--admin-primary-500)] focus:border-transparent ${
                errors.excerpt ? "border-[var(--admin-error)]" : "border-[var(--admin-border-medium)]"
              }`}
              placeholder="Brève description de l'article"
            />
            {errors.excerpt && (
              <p className="mt-1 text-sm text-[var(--admin-error)]">{errors.excerpt}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-[var(--admin-text-primary)] mb-2"
            >
              Mots-clés
            </label>
            <AdminInput
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full"
              placeholder="javascript, react, tutoriel (séparés par des virgules)"
            />
          </div>

          {/* Image */}
          <div>
            <label
              className="block text-sm font-medium text-[var(--admin-text-primary)] mb-2"
            >
              Image à la une
            </label>
            <ImageUpload
              currentImage={imageUrl}
              onImageUploaded={handleImageUploaded}
              type="blog"
            />
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-[var(--admin-text-primary)] mb-2"
            >
              Contenu *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={15}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--admin-primary-500)] focus:border-transparent font-mono text-sm ${
                errors.content ? "border-[var(--admin-error)]" : "border-[var(--admin-border-medium)]"
              }`}
              placeholder="Écrivez le contenu de votre article ici..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-[var(--admin-error)]">{errors.content}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-[var(--admin-border-light)]">
            <AdminButton variant="secondary" asChild>
              <Link href="/admin/blogs">
                Annuler
              </Link>
            </AdminButton>
            <AdminButton variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 bg-[var(--admin-text-inverse)] mr-2"></div>
                  Création en cours...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Créer l'Article
                </>
              )}
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
