"use client";

import type { Review } from "@/types";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

interface ReviewsProps {
  reviews: Review[];
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? "text-accent" : "text-text-subtle"}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function Reviews({ reviews }: ReviewsProps) {
  return (
    <section className="pb-20 pt-8 sm:pb-28 sm:pt-12" aria-labelledby="reviews">
      <Container>
        <Reveal>
          <SectionHeading
            id="reviews"
            title="From Lusaka customers"
            description="Mock reviews for Phase 1 — real voices come with live orders later."
          />
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <StaggerItem key={review.id}>
              <blockquote className="h-full border-l-2 border-accent/50 pl-4">
                <Stars rating={review.rating} />
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  “{review.body}”
                </p>
                <footer className="mt-4 text-sm text-text">
                  <cite className="not-italic font-medium">{review.author}</cite>
                  <span className="text-text-subtle"> · {review.location}</span>
                </footer>
              </blockquote>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
