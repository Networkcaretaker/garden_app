import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BeforeAfterSlider } from '../components/ImageSlider';

const VITE_WEBSITE_CONFIG_URL = import.meta.env.VITE_WEBSITE_CONFIG_URL;

interface WebsiteData {
  title: string;
  tagline: string;
}

export default function Home() {
  // Initialize with your existing hardcoded values as a fallback
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    title: 'Mallorca Gardens',
    tagline: 'Mallorcas Premier Gardening & Landscaping Experts'
  });

  useEffect(() => {
    const fetchConfig = async () => {
      // If the URL isn't set, we just stick to the defaults
      if (!VITE_WEBSITE_CONFIG_URL) {
        console.warn('VITE_WEBSITE_CONFIG_URL is not defined in .env');
        return;
      }

      try {
        const response = await fetch(VITE_WEBSITE_CONFIG_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch website config');
        }
        const data = await response.json();
        
        // Update state with the fetched data
        // We use prev state spread to ensure we don't lose defaults if fields are missing
        setWebsiteData(prev => ({
          ...prev,
          title: data.title || prev.title,
          tagline: data.tagline || prev.tagline
        }));
      } catch (error) {
        console.error('Error loading website config:', error);
      }
    };

    fetchConfig();
  }, []);

  return (
    <main className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative flex h-[60vh] min-h-[400px] items-center justify-center text-center text-white">
        <img
          src="/rose-garden.webp"
          alt={`A beautiful, lush garden created by ${websiteData.title}`}
          className="absolute z-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl font-bold text-white md:text-6xl">
            {websiteData.title}
          </h1>
          <p className="mt-4 text-lg font-light text-green-100 md:text-2xl">
            {websiteData.tagline}
          </p>
          <Link
            to="/projects"
            className="mt-8 inline-block rounded-full bg-white border-2 border-green-600 px-8 py-3 font-bold text-green-600 transition-colors hover:bg-green-600 hover:text-white"
          >
            View Our Projects
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-green-800 md:text-4xl">
            A Passionate Team of Expert Gardeners
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Welcome to Mallorca Gardens, the premier gardening and landscape maintenance team in Mallorca. We specialize in custom and sustainable solutions, enhancing your outdoor spaces with attention to detail and customer satisfaction. Transform your garden into a paradise with us.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative flex h-[80vh] min-h-[600px] items-center justify-center text-center text-white">
        <img
          src="/team.jpg"
          alt={`Meet the team`}
          className="absolute z-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 p-4">
          <Link
            to="/contact"
            className="mt-8 inline-block rounded-full bg-green-600 px-8 py-3 font-bold text-white transition-colors hover:bg-green-700"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-green-800 md:text-4xl">
            Our Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            From design to regular maintenance, we offer a complete range of
            services to make your garden thrive.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Service 1 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="text-xl font-bold text-green-700">
                Garden Design
              </h3>
              <p className="mt-2 text-gray-600">
                Creative and sustainable garden designs tailored to your space
                and lifestyle.
              </p>
            </div>
            {/* Service 2 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="text-xl font-bold text-green-700">
                Lawn & Plant Care
              </h3>
              <p className="mt-2 text-gray-600">
                Expert care to keep your lawn green, your plants healthy, and
                your garden beautiful.
              </p>
            </div>
            {/* Service 3 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="text-xl font-bold text-green-700">
                Full Maintenance
              </h3>
              <p className="mt-2 text-gray-600">
                Comprehensive maintenance plans to ensure your garden looks its
                best all year round.
              </p>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Service 4 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="text-xl font-bold text-green-700">
                Comprehensive Palm Tree and Shrub Care
              </h3>
              <p className="mt-2 text-gray-600">
                Specialized tree and shrub care for vibrant, flourishing landscapes.
              </p>
            </div>
            {/* Service 5 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="text-xl font-bold text-green-700">
                Build and Maintain Pools
              </h3>
              <p className="mt-2 text-gray-600">
                Your Pool, Our Passion. Design, build, and maintain your Mallorca dream pool.
              </p>
            </div>
            {/* Service 6 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="text-xl font-bold text-green-700">
                Matting and Gravelling Services
              </h3>
              <p className="mt-2 text-gray-600">
                We offer expert matting and gravelling services to transform your outdoor spaces into long-lasting, eye-catching areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Showcase Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-green-800 md:text-4xl">
            Our Work
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Take a look at some of the beautiful spaces we have had the pleasure
            of creating.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <img src="/project-1.webp" alt="Garden project 1" width={600} height={400} className="rounded-lg" />
            <img src="/project-2.webp" alt="Garden project 2" width={600} height={400} className="rounded-lg" />
            <img src="/project-3.webp" alt="Garden project 3" width={600} height={400} className="rounded-lg" />
          </div>
          <Link
            to="/projects"
            className="mt-8 inline-block rounded-full border-2 border-green-600 px-8 py-3 font-bold text-green-600 transition-colors hover:bg-green-600 hover:text-white"
          >
            View All Projects
          </Link>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative flex h-[70vh] min-h-[600px] items-center justify-center text-center text-white">
        <img
          src="/map.png"
          alt={`A map of Mallorca`}
          className="absolute z-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        
        <div className="relative z-10 p-4">
          <h1 className="text-4xl font-bold text-white md:text-4xl">
            Serving All of Mallorca
          </h1>
          <p className="mt-4 text-lg font-light text-green-100 md:text-2xl">
            No matter where your property is located on the island, our professional gardening team is ready to help.<br></br> We provide complete island-wide coverage for maintenance and landscaping.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block rounded-full bg-green-600 px-8 py-3 font-bold text-white transition-colors hover:bg-green-700"
          >
            Get a Free Quote
          </Link>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          
          <h2 className="text-3xl font-bold text-green-800 md:text-4xl">
            Why choose Mallorca Gardens
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Transform your outdoor spaces with Mallorca Gardens
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* why 1 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/clip-1.png" alt="Clip 1" className="rounded-lg" />
              <h3 className="text-xl font-bold text-green-700">
                Personalized Garden Designs
              </h3>
              <p className="mt-2 text-gray-600">
                Custom garden designs tailored to your style and preferences. We bring your vision to life.
              </p>
            </div>
            {/* why 2 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/clip-2.png" alt="Clip 2" className="rounded-lg" />
              <h3 className="text-xl font-bold text-green-700">
                Professional Garden Maintenance
              </h3>
              <p className="mt-2 text-gray-600">
                Our expert gardeners provide year-round maintenance to ensure your garden flourishes and remains vibrant.
              </p>
            </div>
            {/* why 3 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/clip-3.png" alt="Clip 3" className="rounded-lg" />
              <h3 className="text-xl font-bold text-green-700">
                Creating Stunning and Sustainable Landscapes
              </h3>
              <p className="mt-2 text-gray-600">
                Transform your outdoor space into an eco-friendly haven that will leave your neighbors in awe.
              </p>
            </div>
            {/* why 4 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/clip-4.png" alt="Clip 4" className="rounded-lg" />
              <h3 className="text-xl font-bold text-green-700">
                Customer Happiness Guarantee
              </h3>
              <p className="mt-2 text-gray-600">
                Customer satisfaction is our top priority. We go the extra mile to fulfill your gardening dreams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <BeforeAfterSlider 
              // Using distinct placeholder images to simulate before/after
              // Ideally these would be the same dimensions.
              beforeImage="/project-4.webp"
              afterImage="/project-3.webp"
              altText="Reform Project"
            />
          <h2 className="text-2xl font-light text-green-800 md:text-4xl mt-4">
            <i>"What a fantastic team, thank you Mallorca Gardens"</i>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            <b>John Dow</b> - Mallorca Resident
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-green-800 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Get in Touch with Our Skilled Gardeners for a Free Consultation</h2>
          <p className="mt-4 text-lg text-green-100">
            Our expert team specializes in custom and sustainable gardening solutions across beautiful Mallorca.<br></br>
            Contact us for a free consultation and let us bring your unique vision to life.
          </p>
          <Link to="/contact" className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-bold text-green-800 transition-transform hover:scale-105">
            Get in Touch
          </Link>
        </div>
      </footer>
    </main>
  );
}