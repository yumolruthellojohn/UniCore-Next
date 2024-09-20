import Link from 'next/link';

interface DataTableAddProps {
  text: string;
  href: string;
}

export function DataTableAdd({ text, href }: DataTableAddProps) {
  return (
    <Link
      href={href}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {text}
    </Link>
  );
}