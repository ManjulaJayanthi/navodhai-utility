import Image from 'next/image';

export function Navbar() {
  return (
    <nav className=" flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="container flex items-center space-x-2">
        <Image
          src="/logo.png"
          alt="Navodhai Logo"
          width={32}
          height={32}
          className="object-contain rounded-md"
        />
        <span className="text-xl font-semibold">Navodhai</span>
      </div>
    </nav>
  );
}
