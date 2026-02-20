import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VideoCard } from '../components/VideoCard';
import { SEO } from '../components/SEO';
import { Video } from '../types';
import { Tag } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/videos?category=${slug}`);
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching category videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [slug]);

  const categoryName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : '';

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <SEO 
        title={`${categoryName} Videos`} 
        description={`Explore the best ${categoryName} videos on TubeSEO. Optimized for discovery and learning.`}
      />

      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Tag className="w-10 h-10 text-emerald-600" />
          {categoryName}
        </h1>
        <p className="text-xl text-zinc-500">Discover top-rated content in {categoryName}.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {videos.map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};
