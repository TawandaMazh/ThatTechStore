"use client";

/**
 * WhatsApp “Ask a question” — hidden until NEXT_PUBLIC_WHATSAPP_NUMBER is set
 * (see preferences: no business number yet).
 */
export function AskQuestionButton() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();

  if (!number) {
    return null;
  }

  const href = `https://wa.me/${number.replace(/\D/g, "")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-12 items-center justify-center rounded-[var(--radius-md)] border border-border-strong bg-surface px-6 text-base font-medium text-text transition-colors hover:bg-surface-hover"
    >
      Ask a question
    </a>
  );
}
