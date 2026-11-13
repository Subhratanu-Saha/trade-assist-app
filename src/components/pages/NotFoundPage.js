import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4 py-8">
      <section
        aria-labelledby="not-found-title"
        className="w-full max-w-lg rounded-3xl bg-slate-900 px-8 py-12 text-center text-white shadow-2xl"
      >
        <p className="text-7xl font-bold tracking-tight text-slate-300">404</p>
        <h1 id="not-found-title" className="mt-4 text-2xl font-semibold">
          Page Not Found
        </h1>
        <p className="mt-3 text-slate-300">
          The page you requested does not exist or may have been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-white px-6 py-3 font-semibold text-[#0A2947] transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Go to Home
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
