"use client";

import React, { useState } from "react";
import { usePublishedComments, useComments } from "@/hooks/useComments.js";
import Input from "@/components/Input/Input";
import Textarea from "@/components/Textarea/Textarea";
import Button from "@/components/Button/Button";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Alert from "@/components/Alert/Alert";
import { MessageCircle, User, Calendar } from "lucide-react";

const BlogCommentsSection = ({ blogId }) => {
  const { comments, isLoading: commentsLoading, isError: commentsError, mutate: mutateComments } = usePublishedComments(blogId);
  const { createComment } = useComments(blogId);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Validation rules matching server-side
  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Le nom est requis.";
    }
    if (formData.name.length > 100) {
      return "Le nom ne peut pas dépasser 100 caractères.";
    }
    if (!formData.message.trim()) {
      return "Le message est requis.";
    }
    if (formData.message.length > 1000) {
      return "Le message ne peut pas dépasser 1000 caractères.";
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Format d'email invalide.";
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const commentData = {
        blog_id: blogId,
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        message: formData.message.trim(),
        is_published: false, // Will be published after approval
        is_approved: false
      };

      await createComment(commentData);

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: ""
      });

      setSubmitSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    } catch (error) {
      setSubmitError(error.message || "Erreur lors de l'envoi du commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="mt-12 bg-gray-50 rounded-lg p-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-6 h-6 text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900">Commentaires</h2>
      </div>

      {/* Comments List */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Commentaires ({comments?.length || 0})
        </h3>

        {commentsLoading ? (
          <LoadingSpinner />
        ) : commentsError ? (
          <Alert type="error" message="Erreur lors du chargement des commentaires." />
        ) : comments?.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            Aucun commentaire pour le moment. Soyez le premier à commenter !
          </p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 break-words">
                        {comment.name}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={comment.created_at}>
                          {formatDate(comment.created_at)}
                        </time>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap break-words">
                      {comment.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Form */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Laisser un commentaire
        </h3>

        {submitSuccess && (
          <Alert type="success" message="Votre commentaire a été envoyé avec succès et sera publié après modération." />
        )}

        {submitError && (
          <Alert type="error" message={submitError} />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nom"
              name="name"
              required
              placeholder="Votre nom"
              value={formData.name}
              onChange={handleInputChange}
            />

            <Input
              label="Email (optionnel)"
              name="email"
              type="email"
              placeholder="votre.email@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <Textarea
            label="Message"
            name="message"
            required
            rows={6}
            placeholder="Écrivez votre commentaire ici..."
            value={formData.message}
            onChange={handleInputChange}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#b0e0e6] text-white rounded-lg hover:bg-[#6495ed] transition-colors duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Envoi en cours...
                </div>
              ) : (
                "Envoyer le commentaire"
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BlogCommentsSection;