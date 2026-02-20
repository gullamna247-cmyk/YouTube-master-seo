import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { VideoCard } from '../components/VideoCard';
import { Video, Comment } from '../types';
import { ThumbsUp, MessageSquare, Share2, Send, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video & { comments: Comment[] } | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, rRes] = await Promise.all([
          fetch(`/api/videos/${id}`),
          fetch('/api/videos')
        ]);
        const vData = await vRes.json();
        const rData = await rRes.json();
        setVideo(vData);
        setRelatedVideos(rData.filter((v: Video) => v.youtube_id !== id).slice(0, 6));
      } catch (error) {
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentContent) return;

    try {
      const res = await fetch(`/api/videos/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: commentName, content: commentContent })
      });
      const newComment = await res.json();
      setVideo(prev => prev ? { ...prev, comments: [newComment, ...prev.comments] } : null);
      setCommentName('');
      setCommentContent('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!video) return <div className="min-h-screen flex items-center justify-center">Video not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title={video.title} 
        description={video.description}
        ogImage={video.thumbnail}
        ogType="video.other"
        videoUrl={`https://www.youtube.com/embed/${video.youtube_id}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-widest">
                <Link to={`/category/${video.category_name.toLowerCase()}`} className="hover:underline">{video.category_name}</Link>
                <ChevronRight className="w-3 h-3" />
                <span>Trending</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                {video.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-black/5">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-600">
                    {video.category_name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{video.category_name} Channel</p>
                    <p className="text-xs text-zinc-500">Verified Creator</p>
                  </div>
                </div>
                <button className="h-10 px-6 bg-black text-white rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors">
                  Subscribe
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button className="h-10 px-4 bg-zinc-100 rounded-full flex items-center gap-2 text-sm font-medium hover:bg-zinc-200 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  {(video.likes / 1000).toFixed(1)}K
                </button>
                <button className="h-10 px-4 bg-zinc-100 rounded-full flex items-center gap-2 text-sm font-medium hover:bg-zinc-200 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-4 text-sm font-bold">
                <span>{(video.views / 1000).toFixed(1)}K views</span>
                <span className="text-zinc-400">•</span>
                <span>{new Date(video.published_at).toLocaleDateString()}</span>
              </div>
              <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
                {video.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-4">
                {['#seo', '#video', '#trending', '#discovery'].map(tag => (
                  <span key={tag} className="text-sm font-medium text-emerald-600 hover:underline cursor-pointer">{tag}</span>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-8 pt-8">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-zinc-400" />
                <h3 className="text-xl font-bold">{video.comments.length} Comments</h3>
              </div>

              <form onSubmit={handleCommentSubmit} className="space-y-4 bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="h-12 px-4 bg-zinc-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <textarea 
                  placeholder="Add a comment..." 
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={3}
                  className="w-full p-4 bg-zinc-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                />
                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="h-12 px-8 bg-black text-white rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-colors"
                  >
                    Post Comment
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                {video.comments.map(comment => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 bg-zinc-100 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-zinc-400">
                      {comment.user_name[0]}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{comment.user_name}</span>
                        <span className="text-xs text-zinc-400">{formatDistanceToNow(new Date(comment.created_at))} ago</span>
                      </div>
                      <p className="text-sm text-zinc-600 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Related Videos */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold tracking-tight">Related Videos</h3>
          <div className="space-y-6">
            {relatedVideos.map(v => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
          
          <div className="sticky top-24 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-4">
            <h4 className="font-bold text-emerald-900">Grow Your Channel</h4>
            <p className="text-sm text-emerald-700 leading-relaxed">
              Want to get more views like this? Join our newsletter for weekly SEO tips and tricks.
            </p>
            <button className="w-full h-10 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">
              Join Newsletter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
