'use client'

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../utils/AuthContext';
import { useRouter } from 'next/navigation';
import Loading from '../../components/ui/loading';

// JSON data with video information
const videoData = [
  {
    id: 'fSB5EyMnQ4o',
    url: 'https://youtu.be/MAtBkSNTkCc?si=g1_xrf8E13UZkBzM',
    title: 'Advanced Game Development Techniques',
    channel: 'GameDev Mastery',
    status: 'In Progress',
    progress: 65,
    difficulty: 'Hard',
  },
  {
    id: 'dQw4w9WgXcQ',
    url: 'https://youtu.be/EGXASuDJ9vw?si=dC7xXVdOoCQDNJGN',
    title: 'Mastering Multiplayer Game Mechanics',
    channel: 'Online Gaming Pro',
    status: 'Not Started',
    progress: 0,
    difficulty: 'Expert',
  },
  {
    id: '3tmd-ClpJxA',
    url: 'https://youtu.be/_hC4JsmqvFU?si=K6Ge9fPPSWwKqgSy',
    title: 'Creating Pixel Art for Indie Games',
    channel: 'ArtStation Academy',
    status: 'Watched',
    progress: 100,
    difficulty: 'Medium',
  },
  {
    id: 'G1IbRujko-A',
    url: 'https://youtu.be/jmbPvGhdnJ4?si=As5c_-OFabI1h6r-',
    title: 'Game Physics Engine Fundamentals',
    channel: 'Physics For Gamers',
    status: 'In Progress',
    progress: 35,
    difficulty: 'Hard',
  },
  {
    id: 'Kt-lbZJ2RjQ',
    url: 'https://youtu.be/R-YBFEwUmic?si=7fhFVF4ZQssg5RyC',
    title: 'Level Design Masterclass',
    channel: 'Game Design Institute',
    status: 'Not Started',
    progress: 0,
    difficulty: 'Medium',
  },
  {
    id: '9bZkp7q19f0',
    url: 'https://youtu.be/H8oE4qKNorc?si=K9g7RgCtEXSoJsPZ',
    title: 'Sound Design for Immersive Games',
    channel: 'Audio Masters',
    status: 'Watched',
    progress: 100,
    difficulty: 'Easy',
  },
  {
    id: 'fSB5EyMnQ4od',
    url: 'https://youtu.be/MAtBkSNTkCc?si=g1_xrf8E13UZkBzM',
    title: 'Advanced Game Development Techniques',
    channel: 'GameDev Mastery',
    status: 'In Progress',
    progress: 65,
    difficulty: 'Hard',
  },
  {
    id: 'dQw4w9WgXc23',
    url: 'https://youtu.be/EGXASuDJ9vw?si=dC7xXVdOoCQDNJGN',
    title: 'Mastering Multiplayer Game Mechanics',
    channel: 'Online Gaming Pro',
    status: 'Not Started',
    progress: 0,
    difficulty: 'Expert',
  },
  {
    id: '3tmd-ClpJxs',
    url: 'https://youtu.be/_hC4JsmqvFU?si=K6Ge9fPPSWwKqgSy',
    title: 'Creating Pixel Art for Indie Games',
    channel: 'ArtStation Academy',
    status: 'Watched',
    progress: 100,
    difficulty: 'Medium',
  },
];

export default function WatchPage() {
  const [videos, setVideos] = useState(videoData);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0
  });
  const router = useRouter();
  const {isAuthenticated} = useAuth();
  
  // Calculate stats
  useEffect(() => {
    const total = videos.length;
    const completed = videos.filter(v => v.status === 'Watched').length;
    const inProgress = videos.filter(v => v.status === 'In Progress').length;
    const notStarted = videos.filter(v => v.status === 'Not Started').length;
    
    setStats({ total, completed, inProgress, notStarted });
  }, [videos]);

  // Filter videos based on status and search
  const filteredVideos = videos.filter(video => {
    const statusMatch = activeFilter === 'all' || video.status === activeFilter;
    const searchMatch = 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  // Update video status
  const updateStatus = (id, newStatus) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, status: newStatus } : video
    ));
  };

  // Update video progress
  const updateProgress = (id, newProgress) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, progress: newProgress } : video
    ));
  };

  const difficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-600 text-green-100';
      case 'Medium': return 'bg-yellow-600 text-yellow-100';
      case 'Hard': return 'bg-orange-600 text-orange-100';
      case 'Expert': return 'bg-red-600 text-red-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  }

  const statusColor = (status) => {
    switch(status) {
      case 'Watched': return 'border-l-4 border-green-500';
      case 'In Progress': return 'border-l-4 border-yellow-500';
      case 'Not Started': return 'border-l-4 border-gray-500';
      default: return 'border-l-4 border-gray-600';
    }
  }

  function extractVideoID(url) {
    try {
      const parsedUrl = new URL(url)
      const pathname = parsedUrl.pathname
      const params = parsedUrl.searchParams
  
      if (pathname.includes('/watch')) {
        return params.get('v')
      } else if (pathname.startsWith('/live/')) {
        return pathname.split('/live/')[1].split('?')[0]
      } else if (pathname.length > 1) {
        return pathname.slice(1)
      }
  
      return null
    } catch (e) {
      console.error('Invalid YouTube URL:', url)
      return null
    }
  }

  if(!isAuthenticated){
    return <Loading/>
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 sm:p-6 text-white">
      {/* Gaming-themed background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-soft-light blur-[100px] opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-600 rounded-full mix-blend-soft-light blur-[100px] opacity-20"></div>
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23414141' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }}
        ></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header with stats */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text   tracking-wide font-orbitron">
          Videos Arena
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Level up your skills with curated tutorials. Track your progress like a pro gamer!
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center shadow-lg">
              <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-gray-300 text-sm">Total Videos</div>
            </div>
            <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center shadow-lg">
              <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-gray-300 text-sm">Completed</div>
            </div>
            <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center shadow-lg">
              <div className="text-3xl font-bold text-yellow-400">{stats.inProgress}</div>
              <div className="text-gray-300 text-sm">In Progress</div>
            </div>
            <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center shadow-lg">
              <div className="text-3xl font-bold text-red-400">{stats.notStarted}</div>
              <div className="text-gray-300 text-sm">Not Started</div>
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-900/50 shadow-lg">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            <Button 
              className={`px-4 py-2 rounded-lg transition-all ${activeFilter === 'all' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setActiveFilter('all')}
            >
              All Videos
            </Button>
            <Button 
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeFilter === 'Not Started' ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setActiveFilter('Not Started')}
            >
              <span className="text-red-300">⏹️</span> Not Started
            </Button>
            <Button 
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeFilter === 'In Progress' ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/30' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setActiveFilter('In Progress')}
            >
              <span className="text-yellow-300">🔄</span> In Progress
            </Button>
            <Button 
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${activeFilter === 'Watched' ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => setActiveFilter('Watched')}
            >
              <span className="text-green-300">✅</span> Watched
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full md:w-64 bg-gray-700/50 border border-purple-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <div
                key={video.id}
                className={`bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-purple-500 relative group ${statusColor(video.status)}`}
              >
                {/* Status indicator corner */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg z-10 ${
                  video.status === 'Not Started' ? 'bg-gray-700' : 
                  video.status === 'In Progress' ? 'bg-yellow-600' : 
                  'bg-green-600'
                }`}>
                  {video.status}
                </div>
                
                {/* Thumbnail with play button */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${extractVideoID(video.url)}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
                      onClick={() => {
                        if (video.status === 'Not Started') {
                          updateStatus(video.id, 'In Progress')
                        }
                      }}
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="p-4 space-y-3">
                  <h2 className="text-lg font-bold text-white" title={video.title}>
                    {video.title}
                  </h2>
                  
                  <div className="flex justify-between items-center">
                    <div className={`px-2 py-1 rounded text-xs font-bold ${difficultyColor(video.difficulty)}`}>
                      {video.difficulty}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {video.status !== 'Not Started' && (
                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress: {video.progress}%</span>
                        <span>{video.status === 'Watched' ? 'Completed!' : 'In Progress'}</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${video.status === 'Watched' ? 'bg-green-500' : 'bg-yellow-500'}`}
                          style={{ width: `${video.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3">
                    <Button
                      onClick={() => {
                        const nextStatus = 
                          video.status === 'Not Started' ? 'In Progress' : 
                          video.status === 'In Progress' ? 'Watched' : 
                          'Not Started';
                        updateStatus(video.id, nextStatus);
                      }}
                      className={`flex-1 text-sm px-3 py-2 rounded-lg transition-all ${
                        video.status === 'Not Started' ? 'bg-yellow-600 hover:bg-yellow-700' : 
                        video.status === 'In Progress' ? 'bg-green-600 hover:bg-green-700' : 
                        'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {video.status === 'Not Started' ? 'Start Learning' : 
                       video.status === 'In Progress' ? 'Mark as Complete' : 
                       'Reset Progress'}
                    </Button>
                  
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-900/50">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-2xl text-gray-300">No videos found</h3>
              <p className="text-gray-500 mt-2">Try changing your filters or search query</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm pb-6">
          <p>Track your learning journey like a pro gamer</p>
          <p className="mt-1">Total videos: {stats.total} • Completed: {stats.completed} ({stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%)</p>
        </div>
      </div>
    </div>
  );
}