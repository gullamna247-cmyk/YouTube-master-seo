import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { VideoCard } from '../components/VideoCard';
import { SEO } from '../components/SEO';
import { Video } from '../types';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/videos?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error('Error searching videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <SEO 
        title={`Search results for "${query}"`} 
        description={`Find the best videos related to ${query} on TubeSEO.`}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <SearchIcon className="w-8 h-8 text-emerald-600" />
            Results for "{query}"
          </h1>
          <p className="text-zinc-500">{videos.length} videos found</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-video bg-zinc-100 rounded-2xl" />
              <div className="h-4 bg-zinc-100 rounded w-3/4" />
              <div className="h-4 bg-zinc-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      {!loading && videos.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
            <SearchIcon className="w-10 h-10 text-zinc-300" />
          </div>
          <h3 className="text-xl font-bold">No videos found</h3>
          <p className="text-zinc-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};
