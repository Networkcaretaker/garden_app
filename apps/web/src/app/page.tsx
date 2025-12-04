import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-green-700">
        Garden Portfolio
      </h1>
      <Link href={`/projects`}className="text-4xl font-bold text-green-700">
        <div><h2>Projects</h2></div>
      </Link>
      <p>Coming Soon...</p>
    </main>
  );
}