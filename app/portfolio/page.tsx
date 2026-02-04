import { redirect } from "next/navigation"

// All portfolio content is now consolidated into the main page
export default function PortfolioPage() {
  redirect("/")
}
