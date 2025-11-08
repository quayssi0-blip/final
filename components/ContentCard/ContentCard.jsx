import React from "react";
import Link from "next/link";
import Image from "next/image";

const ContentCard = ({
  title,
  excerpt,
  image,
  link,
  category,
  date,
  index,
  isAboveFold = false,
}) => {
  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden group card-hover blog-card-stagger h-full flex flex-col">
      <Link href={link} className="flex flex-col h-full">
        {image && (
          <div className="relative h-48 w-full flex-shrink-0 overflow-hidden image-hover">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={80}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
              className="h-48 w-full object-cover"
              priority={isAboveFold && index === 0}
            />
          </div>
        )}
        <div className="p-6 flex flex-col h-full">
          <div>
            {category && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider category-filter-item">
                {category}
              </span>
            )}
          </div>
          <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2 leading-tight text-reveal">
            {title}
          </h3>
          <p className="mt-2 text-slate-600 text-sm line-clamp-3 leading-relaxed flex-grow text-reveal">
            {excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default ContentCard;
