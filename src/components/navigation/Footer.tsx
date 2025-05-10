import { Link } from 'react-router-dom';
import { Newspaper, Twitter, Facebook, Instagram, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Newspaper className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold">ModernBlog</span>
            </div>
            <p className="text-gray-300 text-sm">
              A modern blogging platform for writers, professionals and businesses to share content with the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/technology" className="text-gray-400 hover:text-white transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/category/lifestyle" className="text-gray-400 hover:text-white transition-colors">
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link to="/category/business" className="text-gray-400 hover:text-white transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/category/health" className="text-gray-400 hover:text-white transition-colors">
                  Health & Wellness
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link to="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/auth/register" className="text-gray-400 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-sm text-center">
            &copy; {currentYear} ModernBlog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;