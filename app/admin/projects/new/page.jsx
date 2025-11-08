"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
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

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject, mutate } = useProjects();
  const [loading, setLoading] = useState(false);
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
    />
  );

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

    setLoading(true);

    try {
      // Use the hook to create project
      await createProject(formData);
      
      // Refresh the projects list
      mutate();
      
      // Success - redirect to projects list
      router.push("/admin/projects");
    } catch (error) {
      console.error("Error creating project:", error.message);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Project</h1>
          <p className="text-gray-600">Create a new project showcase</p>
        </div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
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
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="block text-sm font-medium text-gray-700 mb-2"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image principale du projet
            </label>
            <ImageUpload
              currentImage={currentImage}
              onImageUploaded={handleImageUploaded}
              type="project-main"
              projectId={null} // New project, no ID yet
            />
          </div>

          {/* Categories */}
          <div>
            <label
              htmlFor="categories"
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="block text-sm font-medium text-gray-700 mb-2"
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
              className="block text-sm font-medium text-gray-700 mb-2"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Content *
            </label>
            <ContentBuilderBlock
              projectData={formData}
              contentTypes={contentTypes}
              addContentBlock={addContentBlock}
              renderContentBlock={renderContentBlock}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/projects"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
