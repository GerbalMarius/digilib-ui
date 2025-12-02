import NavBar from "./ui/NavBar";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
       <NavBar
        links={[
          { label: "Browse books", href: "/books" },
          { label: "About", href: "/#about" },
          { label: "How it works", href: "/#how-it-works" },
          { label: "Features", href: "/#features" },
          { label: "Log in", href: "/auth" },
        ]}
        showButton={true}
        buttonHref="/auth"
        orientation="horizontal"
      />

      <main className="bg-amber-50">

        {/* HERO */}
        <section className="container mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Reserving books has never been{" "}
            <span className="text-amber-700">this easy.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-700 mb-8">
            Digilib connects you with multiple libraries in one unified place.
            Browse catalogs, check availability, and reserve books instantly —
            without jumping between websites.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/auth"
              className="rounded-full bg-amber-700 text-white px-8 py-3 text-lg font-semibold shadow-sm hover:bg-amber-600 transition"
            >
              Get started
            </Link>

            <Link
              href="#how-it-works"
              className="rounded-full border border-amber-300 bg-white px-8 py-3 text-lg font-semibold text-amber-800 hover:bg-amber-100 transition"
            >
              How it works
            </Link>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="bg-white border-y border-amber-100">
          <div className="container mx-auto px-6 py-14 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How Digilib Works
            </h2>

            <p className="text-slate-600 max-w-xl mx-auto mb-10">
              Three simple steps to reserve your next book with zero frustration.
            </p>

            <div className="grid gap-10 md:grid-cols-3">
              <Step
                number={1}
                title="Discover libraries"
                description="Connect to public, campus, or partner libraries and explore their full catalog in one place."
              />
              <Step
                number={2}
                title="Find the perfect book"
                description="Filter by topic, genre, availability, or format — easily see which library has your book."
              />
              <Step
                number={3}
                title="Reserve instantly"
                description="Place your reservation in a single click. No forms, no separate logins, no chaos."
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="container mx-auto px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Features Designed for Readers
            </h2>
            <p className="text-slate-700">
              No matter which libraries you use, Digilib keeps everything organized.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Feature
              title="Unified Dashboard"
              description="View all your reservations, holds, and returns in one clean dashboard."
            />
            <Feature
              title="Real-Time Availability"
              description="See which branch has copies available before you reserve."
            />
            <Feature
              title="Smart Reminders"
              description="We notify you about pickups, returns, and expiring reservations."
            />
          </div>
        </section>

        {/* ABOUT + FOOTER */}
        <footer id="about" className="bg-amber-100/60 border-t border-amber-200 mt-10">
          <div className="container mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">About Digilib</h3>
              <p className="text-sm text-slate-700">
                We’re building a simpler, smarter way to reserve books from any
                library. No more confusing forms or outdated portals.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Partner with us
              </h3>
              <p className="text-sm text-slate-700">
                Want your library connected to Digilib?
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-2">
                contact@digilib.app
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Stay Updated</h3>
              <p className="text-sm text-slate-700">
                New features and integrations are coming soon.
              </p>
            </div>

          </div>

          <div className="border-t border-amber-200 py-4 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} Digilib — Built for readers who love their libraries.
          </div>
        </footer>

      </main>
    </>
  );
}

const Step = ({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) => (
  <div className="relative bg-amber-50 border border-amber-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
    <span className="absolute -top-3 left-3 h-7 w-7 flex items-center justify-center rounded-full bg-amber-700 text-white text-xs font-bold shadow">
      {number}
    </span>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-slate-600">{description}</p>
  </div>
);

const Feature = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="p-8 bg-white border border-amber-200 rounded-2xl shadow-sm hover:shadow-md transition">
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-600">{description}</p>
  </div>
);
