import React, { useEffect, useState } from 'react';
import { VideoCard } from '../components/VideoCard';
import { SEO } from '../components/SEO';
import { Video, Category } from '../types';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, cRes] = await Promise.all([
          fetch('/api/videos'),
          fetch('/api/categories')
        ]);
        const vData = await vRes.json();
        const cData = await cRes.json();
        setVideos(vData);
        setCategories(cData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      <SEO 
        title="Home" 
        description="Discover the most optimized and trending videos on TubeSEO. Your hub for video search engine optimization."
      />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/tubeseo/1920/1080?blur=10" 
            className="w-full h-full object-cover"
            alt="Hero Background"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              The Future of Video Discovery
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9]">
              OPTIMIZE <br />
              <span className="text-emerald-500">EVERY</span> VIEW.
            </h1>
            <p className="text-xl text-zinc-400 max-w-xl leading-relaxed">
              TubeSEO is the world's first video platform built from the ground up for search engine dominance and user engagement.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/trending" className="h-14 px-8 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-500 transition-all group">
                Explore Trending
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/blog" className="h-14 px-8 bg-white/10 text-white border border-white/20 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all">
                Read SEO Guide
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
          <Link to="/" className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium whitespace-nowrap">All Videos</Link>
          {categories.map(cat => (
            <Link 
              key={cat.id} 
              to={`/category/${cat.slug}`}
              className="px-6 py-2 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Videos */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              Featured Content
            </h2>
            <p className="text-zinc-500">Hand-picked videos optimized for your viewing experience.</p>
          </div>
          <Link to="/trending" className="text-sm font-bold text-emerald-600 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      {/* SEO Tools Section */}
      <section className="bg-zinc-900 py-24 text-white">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Built-in SEO Tools for <br />
              <span className="text-emerald-500">Maximum Reach.</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="font-bold">Schema Markup</h4>
                <p className="text-sm text-zinc-400">Automatic VideoObject and Article schema for Google rich results.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="font-bold">Keyword Analysis</h4>
                <p className="text-sm text-zinc-400">Smart tagging system to improve internal linking and search ranking.</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10">
            <img 
              src="https://picsum.photos/seed/analytics/800/800" 
              className="w-full h-full object-cover opacity-60"
              alt="Analytics Dashboard"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          </div>
        </div>
      </section>
    </div>
  );
};
