import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import LeafBackground from '../components/LeafBackground';

const PRIVACY_POLICY_URL = import.meta.env.VITE_PRIVACY_POLICY_URL || '/data/privacy-policy.md';

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await fetch(PRIVACY_POLICY_URL);
        
        if (!response.ok) {
          throw new Error('Failed to load privacy policy');
        }
        
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error(err);
        setError('Could not load privacy policy. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LeafBackground />
          <div className="text-center space-y-4">
            <img 
              src="/logo.png" 
              alt=""
              className="mx-auto h-24 w-24 object-contain animate-pulse"
            />
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-teal-200 text-3xl font-medium">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <LeafBackground />
        <div className="text-center py-20 text-red-500">{error}</div>
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LeafBackground />
      <Header />
      <main className="container mx-auto flex-grow px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8">
          <article className="prose prose-slate prose-headings:text-teal-700 prose-a:text-teal-600 prose-strong:text-gray-800 max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}