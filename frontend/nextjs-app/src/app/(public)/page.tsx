import Link from 'next/link';

export default async function Home() {
  return (
    <div className="mx-auto flex h-lvh max-w-md flex-col justify-center text-center">
      <h2 className="mb-6 text-2xl font-semibold">Welcome to My Page</h2>
      <Link href="/chat" className={`rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-500`}>
        chat
      </Link>
    </div>
  );
}
