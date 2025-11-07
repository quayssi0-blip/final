"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MapPin,
  Phone,
  Mail,
  Send,
} from "lucide-react";
import UnifiedHero from "@/components/UnifiedHero/UnifiedHero";
import Container from "@/components/Container/Container";
import Input from "@/components/Input/Input";
import Textarea from "@/components/Textarea/Textarea";
import Button from "@/components/Button/Button";

// --- Design System Configuration (Minimalist Light Blue) ---
const ACCENT = "#6495ED"; // Cornflower Blue
const PRIMARY_LIGHT = "#B0E0E6"; // Powder Blue
const DARK_TEXT = "#333333"; // Dark Gray
const BACKGROUND = "#FAFAFA"; // Off-White

// Fixed hex colors for social platforms
const socialColors = {
  facebook: "#1877F2",
  twitter: "#1DA1F2",
  linkedin: "#0A66C2",
  instagram: "#E4405F",
};

export default function Contact() {
  const [activeTab, setActiveTab] = useState("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    project: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState(null);

  // Available projects from the projects page
  const projects = [
    "Forage de Puits",
    "Construction d'Écoles",
    "Village Autosuffisant",
    "Programme Santé",
    "Agriculture Durable",
    "Formation Professionnelle",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage(null);

    // === VALIDATION RENFORCÉE CÔTÉ CLIENT ===
    console.log("🔍 Début de la validation côté client...");

    // Vérifications de base
    if (!formData.name || formData.name.trim() === "") {
      setSubmitStatus("error");
      setErrorMessage(
        'Le champ "Nom complet" est obligatoire. Veuillez le remplir.',
      );
      setIsSubmitting(false);
      return;
    }

    if (!formData.email || formData.email.trim() === "") {
      setSubmitStatus("error");
      setErrorMessage('Le champ "Email" est obligatoire. Veuillez le remplir.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.message || formData.message.trim() === "") {
      setSubmitStatus("error");
      setErrorMessage(
        'Le champ "Message" est obligatoire. Veuillez le saisir.',
      );
      setIsSubmitting(false);
      return;
    }

    // Validation du format de l'email avec regex plus robuste
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setSubmitStatus("error");
      setErrorMessage(
        "L'adresse email saisie n'est pas valide. Veuillez vérifier le format (exemple: nom@domaine.com).",
      );
      setIsSubmitting(false);
      return;
    }

    // Validation supplémentaire pour les champs spécifiques selon l'onglet actif
    if (
      activeTab === "contact" &&
      (!formData.subject || formData.subject.trim() === "")
    ) {
      setSubmitStatus("error");
      setErrorMessage(
        'Le champ "Sujet" est obligatoire pour le contact général. Veuillez le remplir.',
      );
      setIsSubmitting(false);
      return;
    }

    if (
      activeTab === "project" &&
      (!formData.project || formData.project.trim() === "")
    ) {
      setSubmitStatus("error");
      setErrorMessage(
        "Veuillez sélectionner un projet dans la liste déroulante.",
      );
      setIsSubmitting(false);
      return;
    }

    console.log("✅ Validation côté client réussie");
    console.log("📊 Données avant envoi:", {
      activeTab,
      name: formData.name?.trim(),
      email: formData.email?.trim(),
      phone: formData.phone?.trim() || "Non renseigné",
      subject:
        formData.subject?.trim() ||
        (activeTab === "contact" ? "Obligatoire" : "N/A"),
      project:
        formData.project?.trim() ||
        (activeTab === "project" ? "Obligatoire" : "N/A"),
      message: formData.message?.trim(),
    });

    try {
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
        subject: activeTab === "contact" ? formData.subject.trim() : null,
        project: activeTab === "project" ? formData.project.trim() : null,
        message: formData.message.trim(),
        type: activeTab,
      };

      console.log("📤 Données envoyées au serveur:", submitData);
      console.log("🌐 Appel API vers /api/messages...");

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      console.log("📥 Réponse reçue - Status:", response.status);

      // Lire la réponse même en cas d'erreur pour obtenir le message détaillé
      const result = await response.json();
      console.log("📋 Contenu de la réponse:", result);

      if (!response.ok) {
        // Utiliser le message d'erreur spécifique de l'API s'il est disponible
        const errorMessage =
          result.error ||
          "Une erreur s'est produite lors de l'envoi du message";
        console.error("❌ Erreur de l'API:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("✅ Message envoyé avec succès !");
      // Success
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        project: "",
        message: "",
      });
    } catch (error) {
      console.error("❌ Erreur complète lors de l'envoi:", error);

      // Messages d'erreur améliorés en français avec plus de context
      let userFriendlyMessage =
        "Une erreur inattendue s'est produite lors de l'envoi de votre message. Veuillez réessayer dans quelques instants.";

      if (error.message.includes("Name, email, and message are required")) {
        userFriendlyMessage =
          "❌ Erreur de validation : Les champs nom, email et message sont tous obligatoires. Veuillez vérifier que vous avez bien rempli tous les champs requis.";
      } else if (
        error.message.includes("Invalid email format") ||
        error.message.includes("Invalid email")
      ) {
        userFriendlyMessage =
          "❌ Format d'email invalide : Veuillez saisir une adresse email au format correct (exemple: nom@domaine.com).";
      } else if (error.message.includes("Failed to create message")) {
        userFriendlyMessage =
          "❌ Erreur serveur : Une erreur s'est produite lors de l'enregistrement de votre message dans notre base de données. Veuillez réessayer plus tard.";
      } else if (
        error.message.includes("NetworkError") ||
        error.message.includes("fetch") ||
        error.message.includes("Failed to fetch")
      ) {
        userFriendlyMessage =
          "❌ Problème de connexion : Impossible de joindre notre serveur. Veuillez vérifier votre connexion internet et réessayer.";
      } else if (error.message.includes("timeout")) {
        userFriendlyMessage =
          "❌ Timeout : Le serveur met trop de temps à répondre. Veuillez réessayer dans quelques instants.";
      } else if (error.message && error.message !== "Failed to send message") {
        userFriendlyMessage = `❌ Erreur spécifique : ${error.message}`;
      }

      console.log("💬 Message d'erreur utilisateur:", userFriendlyMessage);
      setSubmitStatus("error");
      setErrorMessage(userFriendlyMessage);
    } finally {
      setIsSubmitting(false);
      console.log("🏁 Fin du processus d'envoi (état: ", submitStatus, ")");
    }
  };

  const tabs = [
    { id: "contact", label: "Contact Général", icon: Mail },
    { id: "project", label: "Parler d'un Projet", icon: Send },
    { id: "volunteer", label: "Devenir Bénévole", icon: Send },
  ];

  const getFormTitle = () => {
    switch (activeTab) {
      case "project":
        return "Participer à un Projet";
      case "volunteer":
        return "Devenir Bénévole";
      default:
        return "Contactez-nous";
    }
  };

  const getFormDescription = () => {
    switch (activeTab) {
      case "project":
        return "Vous souhaitez nous proposer un projet ou en discuter avec nous ? Remplissez ce formulaire et nous vous contacterons rapidement.";
      case "volunteer":
        return "Envie de vous engager dans nos actions de solidarité ? Dites-nous en plus sur vous et vos motivations.";
      default:
        return "Pour toute question ou demande d'information, vous pouvez nous contacter directement via les coordonnées ci-dessus.";
    }
  };

  return (
    <div style={{ backgroundColor: BACKGROUND }}>
      <UnifiedHero
        title="L'Espace de Communication et d'Engagement"
        subtitle="Nous sommes là pour répondre à vos questions sur nos actions, partenariats ou toute autre demande. Votre engagement commence ici."
      />

      <Container className="py-16 px-6 space-y-16">
        {/* Main Contact Section */}
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl"></div>

          <div className="relative py-20 px-8 rounded-3xl border border-white/50">
            <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
              {/* Contact Info Section */}
              <div className="space-y-8">
                {/* Contact Info Card */}
                <div className="rounded-2xl p-8 border shadow-lg bg-white">
                  <h3
                    className="text-xl font-semibold mb-6"
                    style={{ color: ACCENT }}
                  >
                    Notre Siège Social au Maroc
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        icon: MapPin,
                        title: "Adresse du Siège:",
                        details:
                          "152, boulevard Yacoub El Mansour, 20380 Casablanca, Maroc",
                        isLink: false,
                      },
                      {
                        icon: Mail,
                        title: "Email de Contact:",
                        details: "assalamassociation@gmail.com",
                        href: "mailto:assalamassociation@gmail.com",
                        isLink: true,
                      },
                      {
                        icon: Phone,
                        title: "Ligne Directe:",
                        details: "05 22 99 36 99",
                        href: "tel:0522993699",
                        isLink: true,
                      },
                      {
                        icon: () => (
                          <div
                            className="h-6 w-6 flex-shrink-0"
                            style={{ color: ACCENT }}
                          >
                            🕒
                          </div>
                        ),
                        title: "Horaires d'Accueil:",
                        details:
                          "Lundi - Vendredi: 9h00 - 17h00 (Heure Marocaine)",
                        isLink: false,
                      },
                    ].map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <div key={index} className="flex items-start gap-4">
                          <IconComponent
                            className="h-6 w-6 mt-1 flex-shrink-0"
                            style={{ color: ACCENT }}
                          />
                          <div className="text-lg">
                            <p
                              className="font-semibold"
                              style={{ color: DARK_TEXT }}
                            >
                              {item.title}
                            </p>
                            {item.isLink ? (
                              <a
                                href={item.href}
                                className="transition-colors duration-200 hover:opacity-80"
                                style={{ color: ACCENT }}
                              >
                                {item.details}
                              </a>
                            ) : (
                              <p style={{ color: `${DARK_TEXT}B3` }}>
                                {item.details}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Google Map Integration */}
                <div className="rounded-2xl overflow-hidden h-80 relative shadow-inner border bg-white">
                  <iframe
                    src="https://maps.google.com/maps?q=152,+boulevard+Yacoub+El+Mansour,+20380+Casablanca,+Maroc&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation de la Fondation Assalam"
                  ></iframe>
                </div>

                {/* Social Media */}
                <div className="mt-6">
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: DARK_TEXT }}
                  >
                    Suivez nos Actions de Solidarité
                  </h3>
                  <div className="flex gap-4">
                    {[
                      { icon: Facebook, href: "#f", platform: "facebook" },
                      { icon: Twitter, href: "#t", platform: "twitter" },
                      { icon: Linkedin, href: "#l", platform: "linkedin" },
                      { icon: Instagram, href: "#", platform: "instagram" },
                    ].map(({ icon: Icon, href, platform }, index) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Lien vers ${platform}`}
                        className={`text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-50`}
                        style={{ backgroundColor: socialColors[platform] }}
                      >
                        <Icon className="w-6 h-6" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-xl p-8 card-lift">
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-1 mb-4 border-b border-gray-200">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 cursor-pointer ${
                          activeTab === tab.id
                            ? "bg-blue-100 text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Form Content */}
                <div>
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: ACCENT }}
                  >
                    {getFormTitle()}
                  </h3>
                  <p className="mb-6 text-gray-600 text-sm">
                    {getFormDescription()}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Nom complet *"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Votre nom et prénom"
                      />
                      <Input
                        label="Email *"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="votre.email@example.com"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Téléphone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+212 XXX XXX XXX"
                      />
                      {activeTab === "contact" && (
                        <Input
                          label="Sujet *"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          placeholder="Objet de votre message"
                        />
                      )}
                      {activeTab === "project" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Projet concerné *
                          </label>
                          <div className="relative">
                            <select
                              name="project"
                              value={formData.project}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 hover:border-gray-400 text-gray-900 text-sm appearance-none"
                            >
                              <option value="">Sélectionnez un projet</option>
                              {projects.map((project, index) => (
                                <option key={index} value={project}>
                                  {project}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Textarea
                      label="Message *"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder={
                        activeTab === "project"
                          ? "Décrivez votre projet ou idée..."
                          : activeTab === "volunteer"
                            ? "Parlez-nous de vos motivations et expériences..."
                            : "Votre message..."
                      }
                      rows={5}
                    />

                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      style={{ backgroundColor: ACCENT }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Envoi en cours..."
                        : "Envoyer le message"}
                    </Button>

                    {submitStatus === "success" && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm">
                          ✅ Merci ! Votre message a été envoyé avec succès.
                          Nous vous répondrons bientôt.
                        </p>
                      </div>
                    )}

                    {submitStatus === "error" && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">
                          ❌{" "}
                          {errorMessage ||
                            "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer."}
                        </p>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections can be added here following the same pattern */}
      </Container>
    </div>
  );
}
