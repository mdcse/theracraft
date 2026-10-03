"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "@/styles/gallery.css";

// To add a photo: drop it in public/gallery/ and add one entry here.
// width/height = the image's real pixel size (used for the enlarged view).
// position     = which part stays visible in the equal-size tile (default centre).
const PHOTOS = [
  {
    src: "/gallery/gallery-5.jpeg",
    width: 1312,
    height: 1199,
    position: "50% 30%",
    title: "Dry Needling",
    alt: "Physiotherapist performing dry needling on a patient's upper back",
  },
  {
    src: "/gallery/gallery-9.jpeg",
    width: 1280,
    height: 853,
    title: "Cupping Therapy",
    alt: "Suction cups placed along a patient's back during cupping therapy",
  },
  {
    src: "/gallery/gallery-8.jpeg",
    width: 1280,
    height: 853,
    title: "IASTM",
    alt: "Therapist using a steel tool for instrument-assisted soft tissue mobilization",
  },
  {
    src: "/gallery/gallery-4.jpeg",
    width: 1280,
    height: 853,
    title: "Knee Replacement Rehab",
    alt: "Doctor showing a knee implant model next to a patient's operated knee",
  },
  {
    src: "/gallery/gallery-6.jpeg",
    width: 1280,
    height: 853,
    title: "Frozen Shoulder",
    alt: "Woman holding her painful shoulder, labelled Frozen Shoulder",
  },
  {
    src: "/gallery/gallery-7.jpeg",
    width: 1280,
    height: 853,
    title: "Cervical Radiculopathy",
    alt: "Woman with neck pain spreading down her arm, labelled Cervical Radiculopathy",
  },
  {
    src: "/gallery/gallery-3.jpeg",
    width: 960,
    height: 1280,
    title: "Shoulder Band Exercises",
    alt: "Six resistance-band shoulder exercises shown in a collage",
  },
  {
    src: "/gallery/gallery-1.jpeg",
    width: 1280,
    height: 853,
    title: "Resistance Band Leg Exercise",
    alt: "Woman lying on a mat doing a leg exercise with a yellow resistance band",
  },
  {
    src: "/gallery/gallery-2.jpeg",
    width: 1280,
    height: 853,
    title: "Foam Roller Mobility",
    alt: "Woman seated with a foam roller under her thigh doing a mobility exercise",
  },
];

export default function Gallery() {
  // index of the photo open in the big view, or null when closed
  const [active, setActive] = useState(null);

  // Keyboard: Esc closes, arrows flip. Page behind stays put while open.
  useEffect(() => {
    if (active === null) return;

    const onKey = (e) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % PHOTOS.length);
      if (e.key === "ArrowLeft")
        setActive((i) => (i - 1 + PHOTOS.length) % PHOTOS.length);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const photo = active !== null ? PHOTOS[active] : null;

  return (
    <section id="gallery" className="gallery">
      <div className="gallery-inner">
        <p className="section-eyebrow">Gallery</p>
        <h2 className="section-title">Treatments &amp; Exercises</h2>
        <p className="section-sub">
          A look at the treatments we offer and the exercises we teach. Tap any
          photo to enlarge it.
        </p>

        <div className="gallery-grid">
          {PHOTOS.map((p, i) => (
            <button
              key={p.src}
              type="button"
              className="gallery-item"
              onClick={() => setActive(i)}
              aria-label={`Enlarge: ${p.title}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                sizes="(max-width: 600px) 50vw, (max-width: 1024px) 50vw, 33vw"
                style={p.position ? { objectPosition: p.position } : undefined}
              />
              <span className="gallery-caption">{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {photo && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={photo.title}
          onClick={() => setActive(null)} /* click the dark area to close */
        >
          <button
            type="button"
            className="lightbox-btn lightbox-close"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <button
            type="button"
            className="lightbox-btn lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active - 1 + PHOTOS.length) % PHOTOS.length);
            }}
            aria-label="Previous photo"
          >
            ‹
          </button>

          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="100vw"
              priority
            />
            <figcaption>{photo.title}</figcaption>
          </figure>

          <button
            type="button"
            className="lightbox-btn lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active + 1) % PHOTOS.length);
            }}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
