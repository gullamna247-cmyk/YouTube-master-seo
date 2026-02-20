import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Menu, Play, TrendingUp, BookOpen, Info, Mail } from 'lucide-react';

export const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
            <Play className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">TubeSEO</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-emerald-600 ${isActive ? 'text-emerald-600' : 'text-zinc-600'}`}>Home</NavLink>
          <NavLink to="/trending" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-emerald-600 ${isActive ? 'text-emerald-600' : 'text-zinc-600'}`}>Trending</NavLink>
          <NavLink to="/blog" className={({ isActive }) => `text-sm font-medium transition-colors hover:text-emerald-600 ${isActive ? 'text-emerald-600' : 'text-zinc-600'}`}>Blog</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <Search className="w-5 h-5 text-zinc-600" />
          </button>
          <button className="md:hidden p-2 hover:bg-zinc-100 rounded-full transition-colors">
            <Menu className="w-5 h-5 text-zinc-600" />
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-black/5 p-4 animate-in slide-in-from-top duration-200">
          <form action="/search" className="container mx-auto max-w-2xl relative">
            <input 
              name="q"
              type="text" 
              placeholder="Search videos, categories, tags..." 
              className="w-full h-12 pl-12 pr-4 bg-zinc-100 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          </form>
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-50 border-t border-black/5 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="text-xl font-bold tracking-tight">TubeSEO</span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              The ultimate platform for video discovery and SEO optimization. Learn from the best and grow your audience.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Home</Link></li>
              <li><Link to="/trending" className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Trending</Link></li>
              <li><Link to="/blog" className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Blog</Link></li>
              <li><Link to="/categories" className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Categories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/sitemap" className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors">Sitemap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-zinc-500 mb-4">Get the latest SEO tips and video trends.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 h-10 px-3 bg-white border border-black/5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="h-10 px-4 bg-black text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-400">© 2026 TubeSEO. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-zinc-400 hover:text-black transition-colors"><TrendingUp className="w-4 h-4" /></a>
            <a href="#" className="text-zinc-400 hover:text-black transition-colors"><BookOpen className="w-4 h-4" /></a>
            <a href="#" className="text-zinc-400 hover:text-black transition-colors"><Mail className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};
