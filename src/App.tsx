import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Header, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { VideoDetail } from './pages/VideoDetail';
import { Blog } from './pages/Blog';
import { Search } from './pages/Search';
import { CategoryPage } from './pages/CategoryPage';

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/video/:id" element={<VideoDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/trending" element={<Home />} /> 
              <Route path="/search" element={<Search />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}
