// components/layout/Header.tsx
import Flex from "@/components/common/Flex";
import ModeToggle from "@/components/layout/header/mode-toggle";
import { Milestone } from "lucide-react";
import Link from "next/link";

function Header() {
  const Links = [
    {
      href: "/blog",
      display: "Blog",
    },
    {
      href: "/series",
      display: "Series",
    },
    {
      href: "/portofolio",
      display: "Portofolio",
    },
  ] as const;

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md">
      <div className="max-w-default mx-auto px-4">
        <Flex justify="between" align="center" gap={4} className="h-16">
          <Flex align="center" justify="between" className="w-full">
            <Flex align="center" gap={2}>
              <Milestone />
              <Link href="/" className="text-lg font-bold">
                SeongYeon
              </Link>
            </Flex>
            <Flex align="center" gap={6}>
              {Links.map(({ href, display }) => (
                <Link
                  key={display}
                  href={href}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {display}
                </Link>
              ))}
              <ModeToggle />
            </Flex>
          </Flex>
        </Flex>
      </div>
    </nav>
  );
}

export default Header;
