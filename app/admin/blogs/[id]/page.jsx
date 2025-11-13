"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useBlogs } from "../../../../hooks/useBlogs";
import ImageUpload from "../../../../components/ImageUpload/ImageUpload";
import AdminButton from "@/components/AdminButton/AdminButton";
import AdminCard from "@/components/AdminCard/AdminCard";
import AdminInput from "@/components/AdminInput/AdminInput";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const { blogs, updateBlog, deleteBlog, mutate } = useBlogs();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    status: "draft",
    tags: "",
    category: "education",
    image_url: "",
    share_on_social: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchBlog = async () => {
      if (blogs && blogs.length > 0) {
        // Find the blog from the list
        const foundBlog = blogs.find(blog => blog.id === params.id);
        if (foundBlog) {
          setFormData({
            title: foundBlog.title || "",
            slug: foundBlog.slug || "",
            excerpt: foundBlog.excerpt || "",
            content: foundBlog.content || "",
            status: foundBlog.status || "draft",
            tags: foundBlog.tags || "",
            category: foundBlog.category || "education",
            image_url: foundBlog.image_url || "",
            share_on_social: foundBlog.share_on_social || false,
          });
        }
        setLoading(false);
      } else if (blogs) {
        // Blogs loaded but not found
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id, blogs]);

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
      image_url: url,
    }));
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

    setSaving(true);

    try {
      // Use the hook to update the blog
      await updateBlog(params.id, formData);
      
      // Refresh the blogs list
      mutate();
      
      // Success - redirect to blogs list
      router.push("/admin/blogs");
    } catch (error) {
      console.error("Error updating blog:", error.message);
      setErrors({ submit: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this blog post? This action cannot be undone.",
      )
    ) {
      try {
        // Use the hook to delete the blog
        await deleteBlog(params.id);
        
        // Refresh the blogs list
        mutate();
        
        // Success - redirect to blogs list
        router.push("/admin/blogs");
      } catch (error) {
        console.error("Error deleting blog:", error.message);
        setErrors({ submit: error.message });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 bg-[var(--admin-primary-600)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <AdminCard className="page-header-card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--admin-text-primary)] mb-2">Modifier l'Article</h1>
            <p className="text-[var(--admin-text-secondary)] text-lg">Mettez à jour les informations et le contenu de l'article</p>
          </div>
          <AdminButton variant="secondary" size="lg" asChild>
            <Link href="/admin/blogs">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour aux Articles
            </Link>
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
              className={`${errors.title ? "border-[var(--admin-error)]" : ""}`}
              placeholder="Entrez le titre de l'article"
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
              className={`${errors.slug ? "border-[var(--admin-error)]" : ""}`}
              placeholder="slug-article-blog"
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
              className="ml-2 block text-sm font-medium text-[var(--admin-text-primary)]"
            >
              Partager sur les réseaux sociaux
            </label>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-[var(--admin-text-primary)] mb-2">
              Image
            </label>
            <ImageUpload
              currentImage={formData.image_url}
              onImageUploaded={handleImageUploaded}
              type="blog-main"
            />
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
              Étiquettes
            </label>
            <AdminInput
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="javascript, react, tutoriel (séparés par des virgules)"
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

          {/* Submit Buttons */}
          <div className="flex justify-between pt-6 border-t border-[var(--admin-border-light)]">
            <AdminButton variant="danger" onClick={handleDelete}>
              <Trash2 className="h-5 w-5 mr-2" />
              Supprimer l'Article
            </AdminButton>

            <div className="flex space-x-3">
              <AdminButton variant="secondary" asChild>
                <Link href="/admin/blogs">
                  Annuler
                </Link>
              </AdminButton>
              <AdminButton variant="primary" type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 bg-[var(--admin-text-inverse)] mr-2"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Sauvegarder les Modifications
                  </>
                )}
              </AdminButton>
            </div>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
