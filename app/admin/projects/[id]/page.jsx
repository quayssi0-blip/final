"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useProjects } from "../../../../hooks/useProjects";
import ImageUpload from "@/components/ImageUpload/ImageUpload";

// Content builder components
import ContentBuilderBlock from "@/components/blocks/ContentBuilderBlock.jsx";
import ContentBlock from "@/components/blocks/ContentBlock.jsx";

// Content types for the builder
import {
  Type,
  Image,
  List,
  Quote,
  Play,
  Users,
  BarChart3,
  Calendar,
  HelpCircle,
  Target,
  FileText,
  MapPin,
  Award,
  BookOpen,
  Heart,
  TrendingUp,
  UserCheck,
} from "lucide-react";

const contentTypes = [
  { type: "text", label: "Texte", icon: Type },
  { type: "image", label: "Image", icon: Image },
  { type: "list", label: "Liste", icon: List },
  { type: "quote", label: "Citation", icon: Quote },
  { type: "video", label: "Vidéo", icon: Play },
  { type: "testimonial", label: "Témoignage", icon: Users },
  { type: "stats", label: "Statistiques", icon: BarChart3 },
  { type: "timeline", label: "Chronologie", icon: Calendar },
  { type: "faq", label: "FAQ", icon: HelpCircle },
  { type: "cta", label: "Call to Action", icon: Target },
  { type: "file", label: "Document", icon: FileText },
  { type: "map", label: "Carte", icon: MapPin },
  { type: "award", label: "Récompense", icon: Award },
  { type: "programme", label: "Programme", icon: BookOpen },
  { type: "services", label: "Services", icon: Heart },
  { type: "sponsorship", label: "Parrainage", icon: Users },
  { type: "impact", label: "Impact", icon: TrendingUp },
  { type: "team", label: "Équipe", icon: UserCheck },
];

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, updateProject, deleteProject, mutate } = useProjects();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    image: "",
    categories: [],
    start_date: "",
    location: "",
    people_helped: 0,
    status: "draft",
    content: [],
    goals: [],
  });
  const [errors, setErrors] = useState({});

  // Content builder functions
  const addContentBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: {},
    };
    setFormData((prev) => ({
      ...prev,
      content: [...prev.content, newBlock],
    }));
  };

  const updateContentBlock = (id, updates) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.map((block) =>
        block.id === id
          ? { ...block, content: { ...block.content, ...updates } }
          : block,
      ),
    }));
  };

  const removeContentBlock = (id) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.filter((block) => block.id !== id),
    }));
  };

  const renderContentBlock = (block, index) => (
    <ContentBlock
      key={block.id}
      block={block}
      index={index}
      contentTypes={contentTypes}
      updateContentBlock={(id, updates) => updateContentBlock(id, updates)}
      removeContentBlock={removeContentBlock}
      handleDragStart={() => {}}
      handleDragOver={() => {}}
      handleDrop={() => {}}
      isEditing={true}
    />
  );

  useEffect(() => {
    const fetchProject = async () => {
      if (projects && projects.length > 0) {
        // Find the project from the list
        const foundProject = projects.find(project => project.id === params.id);
        if (foundProject) {
          setFormData({
            title: foundProject.title || "",
            slug: foundProject.slug || "",
            excerpt: foundProject.excerpt || "",
            image: foundProject.image || "",
            categories: foundProject.categories || [],
            start_date: foundProject.start_date || "",
            location: foundProject.location || "",
            people_helped: foundProject.people_helped || 0,
            status: foundProject.status || "draft",
            content: foundProject.content || [],
            goals: foundProject.goals || [],
          });
          setCurrentImage(foundProject.image || "");
        }
        setLoading(false);
      } else if (projects) {
        // Projects loaded but not found
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id, projects]);

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

  const handleImageUploaded = (imageUrl) => {
    setCurrentImage(imageUrl);
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
    setImageUploaded(true);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
    }

    // Content validation will be handled differently for content builder

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
      // Use the hook to update the project
      await updateProject(params.id, formData);
      
      // Refresh the projects list
      mutate();
      
      // Success - redirect to projects list
      router.push("/admin/projects");
    } catch (error) {
      console.error("Error updating project:", error.message);
      setErrors({ submit: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      try {
        // Use the hook to delete the project
        await deleteProject(params.id);
        
        // Refresh the projects list
        mutate();
        
        // Success - redirect to projects list
        router.push("/admin/projects");
      } catch (error) {
        console.error("Error deleting project:", error.message);
        setErrors({ submit: error.message });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-text-primary)]">Edit Project</h1>
          <p className="text-[var(--admin-text-muted)]">
            Update project information and content
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-[var(--admin-text-secondary)] hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Projects
        </Link>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2"
            >
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter project title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2"
            >
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.slug ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="project-slug"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2"
            >
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.excerpt ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Brief description of the project"
            />
            {errors.excerpt && (
              <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2">
              Image principale du projet
            </label>
            <ImageUpload
              currentImage={currentImage}
              onImageUploaded={handleImageUploaded}
              type="project-main"
              projectId={params.id}
            />
          </div>

          {/* Categories */}
          <div>
            <label
              htmlFor="categories"
              className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2"
            >
              Categories (comma separated)
            </label>
            <input
              type="text"
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="education, health, social"
            />
          </div>

          {/* Start Date */}
          <div>
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2"
            >
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Casablanca, Morocco"
            />
          </div>

          {/* People Helped */}
          <div>
            <label
              htmlFor="people_helped"
              className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2"
            >
              Number of People Helped
            </label>
            <input
              type="number"
              id="people_helped"
              name="people_helped"
              value={formData.people_helped}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2"
            >
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="Actif">Actif</option>
              <option value="Terminé">Terminé</option>
              <option value="Archivé">Archivé</option>
            </select>
          </div>

          {/* Content Builder */}
          <div>
            <label className="block text-sm font-medium text-[var(--admin-text-secondary)] mb-2">
              Project Content *
            </label>
            <ContentBuilderBlock
              projectData={formData}
              contentTypes={contentTypes}
              addContentBlock={addContentBlock}
              renderContentBlock={renderContentBlock}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete Project
            </button>

            <div className="flex space-x-3">
              <Link
                href="/admin/projects"
                className="px-4 py-2 border border-gray-300 rounded-lg text-[var(--admin-text-secondary)] hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
