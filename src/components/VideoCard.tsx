import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye, ThumbsUp, Calendar } from 'lucide-react';
import { Video } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <Link to={`/video/${video.youtube_id}`} className="group block space-y-3">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-100">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-black fill-current ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded uppercase tracking-wider">
          {video.category_name}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="font-semibold text-zinc-900 line-clamp-2 leading-tight group-hover:text-emerald-600 transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {(video.views / 1000).toFixed(1)}K
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            {(video.likes / 1000).toFixed(1)}K
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDistanceToNow(new Date(video.published_at))} ago
          </span>
        </div>
      </div>
    </Link>
  );
};
