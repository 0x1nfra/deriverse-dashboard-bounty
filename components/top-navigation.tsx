"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function TopNavigation() {
  const pathname = usePathname();

  const handleConnectWallet = () => {
    console.log(
      "Connect Wallet clicked - implement wallet connection logic here",
    );
  };

  // Portfolio is the only active link as per requirements
  const isActive = pathname === "/" || pathname === "/portfolio";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border">
      <div className="flex items-center justify-between h-full px-6 max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/light.svg" alt="Deriverse" className="h-4" />
        </Link>

        {/* Navigation - Only Portfolio */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "text-foreground bg-secondary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
            )}
          >
            Portfolio
          </Link>
        </nav>

        {/* Connect Wallet Button */}
        <Button
          onClick={handleConnectWallet}
          className="bg-[#5471f6] hover:bg-[#5471f6]/90 text-[#000000]"
        >
          Connect Wallet
        </Button>
      </div>
    </header>
  );
}

function DeriverseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 2L4 9V23L16 30L28 23V9L16 2Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M16 2V16M16 16L4 9M16 16L28 9M16 16V30"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
