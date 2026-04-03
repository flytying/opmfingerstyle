import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Page Not Found
      </h1>
      <p className="mt-2 text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Go Home
        </Link>
        <Link
          href="/guitarists"
          className="rounded-full border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-surface"
        >
          Browse Guitarists
        </Link>
      </div>
    </div>
  );
}
