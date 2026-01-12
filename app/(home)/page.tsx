import { HeroSection } from "@/app/(home)/_components/hero-section";
import LatestPost from "@/app/(home)/_components/latest-post";

export default async function Home() {
  return (
    <>
      <HeroSection />
      <LatestPost />
    </>
  );
}
