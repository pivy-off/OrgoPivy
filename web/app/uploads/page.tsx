export default async function Home() {
  const res = await fetch("http://127.0.0.1:8000/health", { cache: "no-store" });
  const data = await res.json();

  return (
    <main className="p-8 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">OrgoPivy</h1>
        <p className="mt-2">API status: {data.status}</p>
      </div>

      <a className="underline" href="/uploads">
        View uploads
      </a>
    </main>
  );
}
