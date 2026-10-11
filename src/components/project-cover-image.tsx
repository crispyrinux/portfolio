"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function ProjectCoverImage({
  src,
  alt,
  slug,
  priority = false,
  sizes,
  className = "object-cover",
}: {
  src: string;
  alt: string;
  slug?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const getMock = () => {
    const available = [
      "joints-inspire",
      "reflow",
      "p2p-terminal-chat",
      "url-shortener",
      "expert-system-cbr",
    ];
    if (slug && available.includes(slug)) {
      return `/images/projects/${slug}.svg`;
    }
    return "/images/projects/placeholder.svg";
  };

  const defaultMock = getMock();
  const [currentSrc, setCurrentSrc] = useState<string>(src || defaultMock);

  useEffect(() => {
    setCurrentSrc(src || defaultMock);
  }, [src, defaultMock]);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => {
        if (currentSrc !== defaultMock) {
          setCurrentSrc(defaultMock);
        } else if (currentSrc !== "/images/projects/placeholder.svg") {
          setCurrentSrc("/images/projects/placeholder.svg");
        }
      }}
    />
  );
}
