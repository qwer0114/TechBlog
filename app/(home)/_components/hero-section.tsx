import ProfileCodeCard from "@/app/(home)/_components/profile-code-card";
import Link from "next/link";

export function HeroSection() {
  return (
    <section>
      <div className="py-12 md:py-16 max-w-default mx-auto border-b border-border">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
          {/* 텍스트 영역 */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-medium  w-fit">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-green-500" />
              </span>
              Frontend Developer
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight">
              Seong Yeon.
              <br />
              <span className="font-black">Frontend Developer</span>
            </h1>

            <p className="text-lg leading-relaxed max-w-lg">
              사용자 경험을 최우선으로 고민하는 프론트엔드 개발자입니다.
              <br />
              문제 해결 경험을 문서화하고 공유합니다.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                href="https://github.com/qwer0114"
                className="text-sm font-medium hover:underline"
              >
                GitHub
              </Link>
              <Link
                href="mailto:rnalgh0114@gmail.com"
                className="text-sm font-medium hover:underline"
              >
                Email
              </Link>
            </div>
          </div>

          <div className="hidden md:block md:w-[360px] shrink-0">
            <ProfileCodeCard />
          </div>
        </div>
      </div>
    </section>
  );
}
