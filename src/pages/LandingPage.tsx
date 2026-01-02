import { Link } from "react-router-dom";
import { Github, BarChart3, Layers, ArrowRight } from "lucide-react";

export function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32">
        <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"></div>
        
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden hidden md:block lg:hidden">
          <div 
            className="absolute inset-0"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, transparent 12%, rgba(0,0,0,0.05) 18%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,0.95) 95%, rgba(0,0,0,1) 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 12%, rgba(0,0,0,0.05) 18%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,0.95) 95%, rgba(0,0,0,1) 100%)',
            }}
          >
            <img 
              src="/hero-bg.jpg" 
              alt="" 
              className="h-full w-full object-cover opacity-80" 
            />
          </div>
          <div className="absolute inset-0 bg-white/20"></div>
        </div>

        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden hidden lg:block">
          <div className="absolute inset-0 left-1/2 overflow-hidden">
            <div 
              className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-[5%]"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, transparent 5%, rgba(0,0,0,0.03) 8%, rgba(0,0,0,0.07) 12%, rgba(0,0,0,0.12) 16%, rgba(0,0,0,0.18) 20%, rgba(0,0,0,0.3) 28%, rgba(0,0,0,0.45) 36%, rgba(0,0,0,0.6) 44%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.88) 68%, rgba(0,0,0,0.97) 80%, rgba(0,0,0,1) 90%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 5%, rgba(0,0,0,0.03) 8%, rgba(0,0,0,0.07) 12%, rgba(0,0,0,0.12) 16%, rgba(0,0,0,0.18) 20%, rgba(0,0,0,0.3) 28%, rgba(0,0,0,0.45) 36%, rgba(0,0,0,0.6) 44%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.88) 68%, rgba(0,0,0,0.97) 80%, rgba(0,0,0,1) 90%)',
            }}
          >
            <img src="/hero-bg.jpg" alt="" className="h-[650px] w-auto max-w-[50vw] object-cover rounded-2xl" />
            </div>
          </div>
          
          <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-transparent via-white/10 to-white/25 pointer-events-none"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
          <div className="max-w-2xl text-center md:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              사이드 프로젝트 관리를 위한 최고의 도구
            </div>
            
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl lg:leading-tight">
              문서가 아닌 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">코드 활동</span>으로<br />
              프로젝트를 증명하세요.
            </h1>
            
            <p className="mb-10 text-lg text-gray-600 md:text-xl">
              GitHub 커밋 데이터를 기반으로 당신의 개발 활동을 시각화합니다.<br className="hidden md:block" />
              chrono와 함께 사이드 프로젝트의 성장을 기록해보세요.
            </p>
            
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start md:items-start">
              <Link
                to="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 text-base font-medium text-white transition-all hover:bg-gray-800 hover:shadow-lg"
              >
                <Github className="h-5 w-5" />
                GitHub로 시작하기
              </Link>
              <Link
                to="/about"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 text-base font-medium text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900"
              >
                더 알아보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-100 py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <FeatureCard 
              icon={Github}
              title="GitHub 직접 연동"
              description="번거로운 입력 없이, GitHub 리포지토리만 선택하면 프로젝트 생성 끝. 커밋 데이터를 자동으로 불러옵니다."
            />
            <FeatureCard 
              icon={BarChart3}
              title="주간 활동 시각화"
              description="이번 주에 얼마나 코딩했는지 그래프로 확인하세요. 단순한 잔디보다 더 명확한 인사이트를 제공합니다."
            />
            <FeatureCard 
              icon={Layers}
              title="프로젝트별 관리"
              description="여러 개의 사이드 프로젝트를 한곳에서 관리하세요. 진행 상황과 기술 스택을 한눈에 파악할 수 있습니다."
            />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            지금 바로 시작해보세요
          </h2>
          <p className="mb-8 text-gray-600">
            개발자의 성장은 기록에서 시작됩니다. chrono가 함께합니다.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-white transition-all hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20"
          >
            무료로 시작하기
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-3 text-xl font-bold text-gray-900">{title}</h3>
      <p className="leading-relaxed text-gray-600">
        {description}
      </p>
    </div>
  );
}
