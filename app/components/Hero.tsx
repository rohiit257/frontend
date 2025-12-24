export default function Hero() {
  return (
    <section className="relative min-h-screen hero-bg flex items-center pt-20 lg:pt-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-left space-y-6 lg:space-y-8 z-10">
            <div className="space-y-2">
              <p className="text-gold text-sm lg:text-base font-medium tracking-wider uppercase">
                Prakash Bhambhani
              </p>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
              Helping Businesses Scale with Strategic Leadership & Consulting
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-white/70 leading-relaxed max-w-2xl">
              20+ years of experience in business growth, strategy, and execution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-gold text-black font-semibold text-base lg:text-lg rounded-sm hover:bg-gold-light transition-colors"
              >
                Book a Free Consultation
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gold/50 text-gold font-semibold text-base lg:text-lg rounded-sm hover:border-gold hover:bg-gold/10 transition-colors"
              >
                View Services
              </a>
            </div>
          </div>

          {/* Right Column - Image Placeholder */}
          <div className="relative lg:flex lg:justify-end z-10">
            <div className="relative w-full max-w-md mx-auto lg:mx-0">
              {/* Gold glow outline container */}
              <div className="relative p-1 rounded-lg bg-gradient-to-br from-gold/30 via-gold/20 to-transparent">
                {/* Inner container with subtle glow */}
                <div className="relative bg-black/40 backdrop-blur-sm rounded-lg p-8 lg:p-12 border border-gold/30">
                  {/* Placeholder for CEO image */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-white/5 to-white/10 rounded-lg flex items-center justify-center border border-gold/20">
                    <div className="text-center space-y-2">
                      <svg
                        className="w-16 h-16 mx-auto text-gold/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <p className="text-gold/40 text-xs font-medium">CEO Image</p>
                    </div>
                  </div>
                  
                  {/* Subtle gold glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-gold/20 via-transparent to-transparent rounded-lg blur-xl opacity-50 -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
