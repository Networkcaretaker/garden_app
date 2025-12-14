import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-green-800 py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">Get in Touch with Our Skilled Gardeners for a Free Consultation</h2>
        <p className="mt-4 text-lg text-green-100">
          Our expert team specializes in custom and sustainable gardening solutions across beautiful Mallorca.<br />
          Contact us for a free consultation and let us bring your unique vision to life.
        </p>
        <Link to="/contact" className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-bold text-green-800 transition-transform hover:scale-105">
          Get in Touch
        </Link>
      </div>
    </footer>
  );
}