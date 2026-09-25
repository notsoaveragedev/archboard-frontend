import authHero from "../../assets/auth-hero.webp";

export function AuthShowcase() {
  return (
    <aside aria-hidden="true" className="relative hidden overflow-hidden bg-ink lg:block">
      <img
        src={authHero}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover object-center"
      />
    </aside>
  );
}
