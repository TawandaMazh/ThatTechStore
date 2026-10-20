import { Container } from "@/components/ui/container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const badges = [
  {
    title: "Warranty supported",
    body: "Clear coverage on eligible devices — no guesswork at the counter.",
  },
  {
    title: "IMEI checked",
    body: "Phones verified before they leave the shelf.",
  },
  {
    title: "Delivery across Lusaka",
    body: "We deliver to all Lusaka areas — from town to the compounds.",
  },
];

export function Trust() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="trust">
      <Container>
        <Reveal>
          <h2
            id="trust"
            className="font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl"
          >
            Why shop with us
          </h2>
          <p className="mt-2 max-w-xl text-text-muted">
            Built for Lusaka realities — heat, storms, and the grid.
          </p>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {badges.map((badge) => (
            <StaggerItem key={badge.title}>
              <div className="border-t border-border-strong pt-5">
                <p className="font-display text-base font-semibold text-text">
                  {badge.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {badge.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
