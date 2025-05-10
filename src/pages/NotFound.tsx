import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-primary-500">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;