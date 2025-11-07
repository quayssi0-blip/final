/**
 * Strategic preloading utilities for critical images
 */

/**
 * Preload a single image
 * @param {string} src - Image source URL
 * @param {string} as - Resource type hint ('image')
 * @param {string} type - MIME type (optional)
 */
export const preloadImage = (src, as = "image", type = null) => {
  if (!src || typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = as;
  link.href = src;

  if (type) {
    link.type = type;
  }

  // Add crossorigin for external images
  if (src.startsWith("http") && !src.includes(window.location.hostname)) {
    link.crossOrigin = "anonymous";
  }

  document.head.appendChild(link);
};

/**
 * Preload multiple critical images
 * @param {string[]} images - Array of image URLs to preload
 */
export const preloadCriticalImages = (images) => {
  if (!Array.isArray(images) || typeof window === "undefined") return;

  images.forEach((src, index) => {
    // Stagger preloading to avoid overwhelming the network
    setTimeout(() => {
      preloadImage(src);
    }, index * 100);
  });
};

/**
 * Preload images based on priority levels
 * @param {Object} imageGroups - Object with priority levels as keys and image arrays as values
 * @param {string[]} imageGroups.critical - Critical above-the-fold images
 * @param {string[]} imageGroups.high - High priority images
 * @param {string[]} imageGroups.medium - Medium priority images
 */
export const preloadByPriority = ({
  critical = [],
  high = [],
  medium = [],
}) => {
  // Preload critical images immediately
  preloadCriticalImages(critical);

  // Preload high priority images after a short delay
  if (high.length > 0) {
    setTimeout(() => preloadCriticalImages(high), 500);
  }

  // Preload medium priority images after a longer delay
  if (medium.length > 0) {
    setTimeout(() => preloadCriticalImages(medium), 1500);
  }
};

/**
 * Smart preloading based on viewport and user interaction patterns
 * @param {string[]} images - Array of image URLs
 * @param {Object} options - Preloading options
 */
export const smartPreload = (images, options = {}) => {
  const {
    viewportThreshold = 0.8, // Preload when 80% of viewport height is scrolled
    interactionDelay = 2000, // Delay after user interaction
    maxConcurrent = 3, // Maximum concurrent preloads
  } = options;

  if (typeof window === "undefined" || !images.length) return;

  let preloadedCount = 0;
  let isPreloading = false;

  const preloadNext = () => {
    if (preloadedCount >= images.length || isPreloading) return;

    isPreloading = true;
    const batch = images.slice(preloadedCount, preloadedCount + maxConcurrent);

    batch.forEach((src) => {
      preloadImage(src);
    });

    preloadedCount += batch.length;
    isPreloading = false;
  };

  // Preload on scroll
  const handleScroll = () => {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (scrollTop / (docHeight - windowHeight) > viewportThreshold) {
      preloadNext();
    }
  };

  // Preload on user interaction
  const handleInteraction = () => {
    setTimeout(preloadNext, interactionDelay);
  };

  // Initial preload of first batch
  preloadNext();

  // Add event listeners
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("click", handleInteraction, { once: true });
  window.addEventListener("touchstart", handleInteraction, { once: true });

  // Cleanup function
  return () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("click", handleInteraction);
    window.removeEventListener("touchstart", handleInteraction);
  };
};
