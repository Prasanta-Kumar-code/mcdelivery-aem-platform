"use client";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <section className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
          Menu unavailable
        </p>
        <h1 className="mt-2 text-3xl font-bold">We could not load the menu.</h1>
        <p className="mt-4 text-gray-600">
          Check that the local AEM author service is running and that its GraphQL
          credentials are configured, then try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded bg-yellow-400 px-4 py-3 font-bold hover:bg-yellow-500"
        >
          Try again
        </button>
      </section>
    </main>
  );
}