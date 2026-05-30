import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronRight,
  Dna,
  Network,
  FileText,
  Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';

const LandingPage = () => {
  const researchCards = [
    {
      category: 'RESEARCH REPORT',
      title: 'Drug Interaction Intelligence: Advancing Pharmacovigilance with AI',
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop',
      color: 'from-violet-900/80'
    },
    {
      category: 'CLINICAL STUDY',
      title: 'AI-Powered Clinical Documentation: Transforming Healthcare Data',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
      color: 'from-fuchsia-900/80'
    },
    {
      category: 'KNOWLEDGE GRAPHS',
      title: 'The Revolution of Knowledge Graphs in Drug Discovery',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop',
      color: 'from-blue-900/80'
    },
    {
      category: 'PERSPECTIVE',
      title: 'Building Enterprise-Ready Biomedical AI Systems',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      color: 'from-emerald-900/80'
    }
  ];

  return (
    <div className="min-h-screen bg-black" data-testid="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239333ea' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        
        <div className="container-app relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Large Typography */}
            <div className="fade-up">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                  <Dna className="w-8 h-8 text-violet-400" />
                </div>
                <span className="text-sm font-bold tracking-wider text-violet-400">PHARMACEUTICAL AI PLATFORM</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-8">
                <span className="text-white">Drug</span>
                <span className="text-violet-400">KG Text</span>
                <span className="text-white"> AI</span>
              </h1>
              
              <p className="text-xl text-neutral-400 leading-relaxed mb-8 max-w-lg">
                Transform complex pharmaceutical knowledge graphs into clear, 
                actionable clinical insights with enterprise-grade AI.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/demo">
                  <Button className="btn-primary text-lg px-8 py-5 h-auto" data-testid="hero-cta-generate">
                    Start Generating
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-secondary text-lg px-8 py-5 h-auto">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right - Description Card */}
            <div className="fade-up delay-200">
              <div className="bg-neutral-900/50 border border-neutral-800 p-8 backdrop-blur">
                <div className="accent-line" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  Transforming Pharmaceutical Intelligence
                </h2>
                <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                  In an era of exponential biomedical data growth, knowledge synthesis 
                  demands intelligent automation. We transform complex drug relationship 
                  graphs into actionable clinical insights, accelerating research and 
                  improving patient outcomes.
                </p>
                <Link to="/demo">
                  <button className="btn-ghost text-lg group" data-testid="hero-cta-link">
                    See how it works
                    <ChevronRight className="w-5 h-5 text-violet-500 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Cards Section */}
      <section className="py-24 bg-black" data-testid="research-section">
        <div className="container-app">
          <div className="mb-12">
            <p className="section-overline">LATEST RESEARCH</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Explore Our Work</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchCards.map((card, index) => (
              <Link 
                to="/demo" 
                key={index}
                className="card-overlay cursor-pointer h-[400px] group"
                data-testid={`research-card-${index}`}
              >
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${card.color} via-black/60 to-transparent z-10`} />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <p className="text-xs font-bold tracking-wider text-violet-400 mb-3">
                    {card.category}
                  </p>
                  <h3 className="text-xl font-bold text-white leading-tight group-hover:text-violet-300 transition-colors">
                    {card.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-neutral-950 border-t border-b border-neutral-800">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: '<8s', label: 'Average Response Time', icon: Zap },
              { value: '99.9%', label: 'Platform Uptime', icon: Network },
              { value: '50K+', label: 'Drug Entities Processed', icon: FileText }
            ].map((stat, index) => (
              <div key={index} className="text-center fade-up p-8 border border-neutral-800 bg-neutral-900/50" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-violet-400" />
                </div>
                <p className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</p>
                <p className="text-sm text-neutral-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="fade-up">
              <p className="section-overline">CAPABILITIES</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Enterprise-Grade Biomedical NLP
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-8">
                Our platform processes complex pharmaceutical knowledge graphs and 
                transforms them into clear, clinically-relevant natural language 
                descriptions suitable for research documentation, regulatory submissions, 
                and clinical decision support.
              </p>
              
              <div className="space-y-6">
                {[
                  'Multi-format input support (CSV, JSON, TTL, RDF)',
                  'DrugBank ontology optimized processing',
                  'Real-time inference with sub-10s response',
                  'Research-grade output quality'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="w-4 h-4 text-violet-400" />
                    </div>
                    <p className="text-neutral-300">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link to="/demo">
                  <Button className="btn-primary" data-testid="cta-generate">
                    Start Generating
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="fade-up delay-200 relative">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=700&h=500&fit=crop"
                  alt="Research Laboratory"
                  className="w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              </div>
              
              {/* Floating stat card */}
              <div className="absolute -bottom-8 -left-8 stat-card max-w-[280px]">
                <p className="text-xs font-bold tracking-wider text-violet-400 mb-2">PERFORMANCE METRICS</p>
                <p className="text-2xl font-bold text-white mb-1">7,600ms</p>
                <p className="text-sm text-neutral-400">Average generation latency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-violet-600">
        <div className="container-app">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Pharmaceutical Research?
            </h2>
            <p className="text-violet-100 text-lg mb-8">
              Join research institutions leveraging DrugKG Text AI for 
              accelerated drug discovery and clinical documentation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/demo">
                <Button className="bg-white text-violet-600 font-semibold px-8 py-4 h-auto rounded-none hover:bg-neutral-100">
                  Start Now
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 h-auto rounded-none hover:bg-white/10">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
