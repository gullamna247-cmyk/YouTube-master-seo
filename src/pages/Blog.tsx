import React, { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { BlogPost } from '../types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, BookOpen } from 'lucide-react';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-20 space-y-16">
      <SEO 
        title="Blog & SEO Guides" 
        description="Learn the latest video SEO strategies, content creation tips, and digital marketing guides on the TubeSEO blog."
      />

      <div className="max-w-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest">
          <BookOpen className="w-3 h-3" />
          Knowledge Hub
        </div>
        <h1 className="text-5xl font-bold tracking-tight">SEO Guides & Insights</h1>
        <p className="text-xl text-zinc-500 leading-relaxed">
          Master the art of video discoverability with our expert-led articles and case studies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {posts.map(post => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="group space-y-6">
            <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-zinc-100">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-3">
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                {format(new Date(post.published_at), 'MMMM dd, yyyy')}
              </div>
              <h2 className="text-3xl font-bold tracking-tight group-hover:text-emerald-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-zinc-500 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold group-hover:gap-4 transition-all">
                Read Article <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
