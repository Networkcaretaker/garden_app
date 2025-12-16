import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BeforeAfterSlider } from '../components/ImageSlider';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/ui/WhatsApp';
import { getWebsiteConfig, type WebsiteData, DEFAULT_WEBSITE_DATA } from '../services/configService';

export default function Home() {
  // Initialize with your existing hardcoded values as a fallback
  const [websiteData, setWebsiteData] = useState<WebsiteData>(DEFAULT_WEBSITE_DATA);

  useEffect(() => {
    const loadData = async () => {
      const data = await getWebsiteConfig();
      setWebsiteData(data);
    };

    loadData();
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
          <img src="/icons/icon-128.png" className="mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white md:text-6xl">
            {websiteData.title}
          </h1>
          <p className="mt-4 text-lg font-light text-teal-100 md:text-2xl">
            {websiteData.tagline}
          </p>
          <Link
            to="/projects"
            className="mt-8 inline-block rounded-full bg-white border-2 border-teal-600 px-8 py-3 font-bold text-teal-600 transition-colors hover:bg-teal-600 hover:text-white"
          >
            View Our Projects
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-teal-800 md:text-4xl">
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
          src="/aj00.jpg"
          alt={`Meet the team`}
          className="absolute z-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 p-4">
          <WhatsAppButton 
            phoneNumber={websiteData.social.whatsapp} 
            variant="solid"
            label="Let's Chat About Your Next Project"
          />
        </div>
      </section>
      
      {/* Services Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-teal-800 md:text-4xl">
            Our Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            From design to regular maintenance, we offer a complete range of
            services to make your garden thrive.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Service 1 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/aj06.png" alt="Clip 2" className="rounded-lg mb-4" />
              <h3 className="text-xl font-bold text-teal-700">
                Garden Design
              </h3>
              <p className="mt-2 text-gray-600">
                Creative and sustainable garden designs tailored to your space
                and lifestyle.
              </p>
            </div>
            {/* Service 2 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/aj02.png" alt="Clip 2" className="rounded-lg mb-4" />
              <h3 className="text-xl font-bold text-teal-700">
                Lawn & Plant Care
              </h3>
              <p className="mt-2 text-gray-600">
                Expert care to keep your lawn teal, your plants healthy, and
                your garden beautiful.
              </p>
            </div>
            {/* Service 3 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/aj01.png" alt="Clip 2" className="rounded-lg mb-4" />
              <h3 className="text-xl font-bold text-teal-700">
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
              <img src="/aj05.png" alt="Clip 2" className="rounded-lg mb-4" />
              <h3 className="text-xl font-bold text-teal-700">
                Comprehensive Palm Tree and Shrub Care
              </h3>
              <p className="mt-2 text-gray-600">
                Specialized tree and shrub care for vibrant, flourishing landscapes.
              </p>
            </div>
            {/* Service 5 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/aj04.png" alt="Clip 2" className="rounded-lg mb-4" />
              <h3 className="text-xl font-bold text-teal-700">
                Build and Maintain Pools
              </h3>
              <p className="mt-2 text-gray-600">
                Your Pool, Our Passion. Design, build, and maintain your Mallorca dream pool.
              </p>
            </div>
            {/* Service 6 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/aj03.png" alt="Clip 2" className="rounded-lg mb-4" />
              <h3 className="text-xl font-bold text-teal-700">
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
          <h2 className="text-3xl font-bold text-teal-800 md:text-4xl">
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
            className="mt-8 inline-block rounded-full border-2 border-teal-600 px-8 py-3 font-bold text-teal-600 transition-colors hover:bg-teal-600 hover:text-white"
          >
            View All Projects
          </Link>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative flex h-[70vh] min-h-[500px] items-center justify-center text-center text-white">
        <img
          src="/map.png"
          alt={`A map of Mallorca`}
          className="absolute z-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        
        <div className="relative z-10 p-4 max-w-2xl">
          <h1 className="text-4xl font-bold text-white md:text-4xl">
            Serving All of Mallorca
          </h1>
          <p className="mt-4 text-lg font-light text-teal-100 md:text-2xl mb-4">
            No matter where your property is located on the island, our professional gardening team is ready to help. We provide complete island-wide coverage for maintenance and landscaping.
          </p>
          <WhatsAppButton 
            phoneNumber={websiteData.social.whatsapp} 
            variant="solid"
            label="Get a Free Quote"
          />
        </div>
      </section>

      {/* Why Us Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          
          <h2 className="text-3xl font-bold text-teal-800 md:text-4xl">
            Why choose Mallorca Gardens
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Transform your outdoor spaces with Mallorca Gardens
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* why 1 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/clip-1.png" alt="Clip 1" className="rounded-lg" />
              <h3 className="text-xl font-bold text-teal-700">
                Personalized Garden Designs
              </h3>
              <p className="mt-2 text-gray-600">
                Custom garden designs tailored to your style and preferences. We bring your vision to life.
              </p>
            </div>
            {/* why 2 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/clip-2.png" alt="Clip 2" className="rounded-lg" />
              <h3 className="text-xl font-bold text-teal-700">
                Professional Garden Maintenance
              </h3>
              <p className="mt-2 text-gray-600">
                Our expert gardeners provide year-round maintenance to ensure your garden flourishes and remains vibrant.
              </p>
            </div>
            {/* why 3 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/clip-3.png" alt="Clip 3" className="rounded-lg" />
              <h3 className="text-xl font-bold text-teal-700">
                Creating Stunning and Sustainable Landscapes
              </h3>
              <p className="mt-2 text-gray-600">
                Transform your outdoor space into an eco-friendly haven that will leave your neighbors in awe.
              </p>
            </div>
            {/* why 4 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/clip-4.png" alt="Clip 4" className="rounded-lg" />
              <h3 className="text-xl font-bold text-teal-700">
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
          <h2 className="text-2xl font-light text-teal-800 md:text-4xl mt-4">
            <i>"What a fantastic team, thank you Mallorca Gardens"</i>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            <b>John Dow</b> - Mallorca Resident
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <Footer />
    </main>
  );
}