"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";

const BlogHero = ({
  title,
  excerpt,
  image,
  author,
  category,
  date,
  tags,
  onBackUrl = "/blogs"
}) => {
  return (
    <div className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Image de fond si disponible */}
      {image && (
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/80" />

      {/* Contenu */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 text-center">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href={onBackUrl}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux articles
          </Link>
        </div>

        {/* Catégorie */}
        {category && (
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {category}
            </span>
          </div>
        )}

        {/* Titre */}
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {title}
        </h1>
        
        {/* Excerpt */}
        {excerpt && (
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {excerpt}
          </p>
        )}

        {/* Métadonnées */}
        <div className="flex items-center justify-center gap-6 text-gray-500 mb-8">
          {date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {new Date(date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}
          
          {author && (
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{author.name}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogHero;