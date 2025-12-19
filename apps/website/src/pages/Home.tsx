import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BeforeAfterSlider } from '../components/ImageSlider';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/ui/WhatsApp';
import { getWebsiteConfig, DEFAULT_WEBSITE_DATA } from '../services/configService';
import type { WebsiteSettings } from '@garden/shared';

export default function Home() {
  // Initialize with your existing hardcoded values as a fallback
  const [WebsiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(DEFAULT_WEBSITE_DATA);

  useEffect(() => {
    const loadData = async () => {
      const data = await getWebsiteConfig();
      setWebsiteSettings(data);
    };

    loadData();
  }, []);

  return (
    <main className="bg-white text-gray-800">

      {/* Hero Section */}
      <section className="relative flex h-[100vh] min-h-[600px] items-center justify-center text-center text-white">
        <img
          src="/rose-garden.webp"
          alt={`A garden created by ${WebsiteSettings.title}`}
          className="absolute z-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative z-10 p-4 space-y-4">

          {WebsiteSettings.content.hero.logo && (
            <img src={`${WebsiteSettings.logo.url}`} className="mx-auto mb-4 max-w-60 w-60" />
          )}

          {WebsiteSettings.content.hero.title && (
            <h1 className="text-4xl font-bold text-white md:text-6xl drop-shadow-lg">
              {WebsiteSettings.title}
            </h1>
          )}

          {WebsiteSettings.content.hero.tagline && (
            <p className=" text-xl font-bold text-teal-500 md:text-3xl drop-shadow-lg rounded-t-xl">
              {WebsiteSettings.tagline}
            </p>
          )}

          {WebsiteSettings.content.hero.description && (
            <p className=" max-w-2xl *:text-lg font-light text-white md:text-lg drop-shadow-lg rounded-b-xl">
              {WebsiteSettings.description}
            </p>
          )}

          {/* CTA BUTTON */}
          {WebsiteSettings.content.hero.showCTA && (
            <div className="space-y-4">
              {WebsiteSettings.content.hero.cta.text && (
                <p className=" max-w-2xl *:text-lg font-light text-yellow-500 md:text-lg drop-shadow-lg rounded-b-xl">
                  {WebsiteSettings.content.hero.cta.text}
                </p>
              )}
              {WebsiteSettings.content.hero.cta.buttonVariant == 'solid' && (
                <WhatsAppButton 
                  phoneNumber={WebsiteSettings.social.whatsapp} 
                  variant={WebsiteSettings.content.hero.cta.buttonVariant}
                  label={WebsiteSettings.content.hero.cta.buttonText}
                  message={WebsiteSettings.social.whatsappMessage} 
                />
              )}
              {WebsiteSettings.content.hero.cta.buttonVariant == 'projects' && (
                <Link
                  to={`/${WebsiteSettings.content.hero.cta.buttonVariant}`}
                  className="inline-block rounded-full bg-white border-2 border-teal-600 px-8 py-2 font-bold text-teal-600 transition-colors hover:bg-teal-600 hover:text-white"
                >
                  {WebsiteSettings.content.hero.cta.buttonText}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <Header />

      {/* About Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">

          {WebsiteSettings.content.about.title && (
          <h2 className="text-3xl font-bold text-teal-800 md:text-4xl">
            {WebsiteSettings.content.about.title}
          </h2>
          )}

          {WebsiteSettings.content.about.text && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {WebsiteSettings.content.about.text}
            </p>
          )}
        </div>
      </section>

      {/* About CTA Section */}
      <section className="relative flex h-[80vh] min-h-[600px] items-center justify-center text-center text-white">
        <img
          src="/aj00.jpg"
          alt={`Meet the team`}
          className="absolute z-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 p-4">
          {/* CTA BUTTON */}
          {WebsiteSettings.content.about.showCTA && (
            <div className="space-y-4">
              {WebsiteSettings.content.about.cta.text && (
                <p className=" max-w-2xl *:text-lg font-light text-yellow-500 md:text-lg drop-shadow-lg rounded-b-xl">
                  {WebsiteSettings.content.about.cta.text}
                </p>
              )}
              {WebsiteSettings.content.about.cta.buttonVariant == 'solid' && (
                <WhatsAppButton 
                  phoneNumber={WebsiteSettings.social.whatsapp} 
                  variant={WebsiteSettings.content.about.cta.buttonVariant}
                  label={WebsiteSettings.content.about.cta.buttonText}
                  message={WebsiteSettings.social.whatsappMessage} 
                />
              )}
              {WebsiteSettings.content.about.cta.buttonVariant == 'projects' && (
                <Link
                  to={`/${WebsiteSettings.content.about.cta.buttonVariant}`}
                  className="inline-block rounded-full bg-white border-2 border-teal-600 px-8 py-2 font-bold text-teal-600 transition-colors hover:bg-teal-600 hover:text-white"
                >
                  {WebsiteSettings.content.about.cta.buttonText}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Services Section */}
      <section className="bg-teal-100 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          {WebsiteSettings.content.services.title && (
          <h2 className="text-3xl font-bold text-teal-800 md:text-4xl">
            {WebsiteSettings.content.services.title}
          </h2>
          )}

          {WebsiteSettings.content.services.text && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {WebsiteSettings.content.services.text}
          </p>
          )}

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

          {WebsiteSettings.content.gallery.title && (
            <h2 className="text-3xl font-bold text-teal-800 md:text-4xl">
              {WebsiteSettings.content.gallery.title}
            </h2>
          )}
          
          {WebsiteSettings.content.gallery.text && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {WebsiteSettings.content.gallery.text}
          </p>
          )}

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
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        
        <div className="relative z-10 p-4 max-w-2xl">

          {WebsiteSettings.content.location.title && (
            <h1 className="text-4xl font-bold text-white md:text-4xl">
              {WebsiteSettings.content.location.title}
            </h1>
          )}

          {WebsiteSettings.content.location.text && (
            <p className="mt-4 text-lg font-light text-white md:text-2xl mb-4">
              {WebsiteSettings.content.location.text}
            </p>
          )}
          {/* CTA BUTTON */}
          {WebsiteSettings.content.location.showCTA && (
            <div className="space-y-4">
              {WebsiteSettings.content.location.cta.text && (
                <p className=" max-w-2xl *:text-lg font-light text-yellow-500 md:text-lg drop-shadow-lg rounded-b-xl">
                  {WebsiteSettings.content.location.cta.text}
                </p>
              )}
              {WebsiteSettings.content.location.cta.buttonVariant == 'solid' && (
                <WhatsAppButton 
                  phoneNumber={WebsiteSettings.social.whatsapp} 
                  variant={WebsiteSettings.content.location.cta.buttonVariant}
                  label={WebsiteSettings.content.location.cta.buttonText}
                  message={WebsiteSettings.social.whatsappMessage} 
                />
              )}
              {WebsiteSettings.content.location.cta.buttonVariant == 'projects' && (
                <Link
                  to={`/${WebsiteSettings.content.location.cta.buttonVariant}`}
                  className="inline-block rounded-full bg-white border-2 border-teal-600 px-8 py-2 font-bold text-teal-600 transition-colors hover:bg-teal-600 hover:text-white"
                >
                  {WebsiteSettings.content.location.cta.buttonText}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Why Us Section */}
      <section className="bg-teal-100 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          
          {WebsiteSettings.content.benefits.title && (
            <h2 className="text-3xl font-bold text-teal-800 md:text-4xl">
              {WebsiteSettings.content.benefits.title}
            </h2>
          )}

          {WebsiteSettings.content.benefits.text && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {WebsiteSettings.content.benefits.text}
            </p>
          )}

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* why 1 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/clip-1.png" alt="Clip 1" className="rounded-lg w-[128px] mx-auto" />
              <h3 className="text-xl font-bold text-teal-700">
                Personalized Garden Designs
              </h3>
              <p className="mt-2 text-gray-600">
                Custom garden designs tailored to your style and preferences. We bring your vision to life.
              </p>
            </div>
            {/* why 2 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/clip-2.png" alt="Clip 2" className="rounded-lg w-[128px] mx-auto" />
              <h3 className="text-xl font-bold text-teal-700">
                Professional Garden Maintenance
              </h3>
              <p className="mt-2 text-gray-600">
                Our expert gardeners provide year-round maintenance to ensure your garden flourishes and remains vibrant.
              </p>
            </div>
            {/* why 3 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/clip-3.png" alt="Clip 3" className="rounded-lg w-[128px] mx-auto" />
              <h3 className="text-xl font-bold text-teal-700">
                Creating Stunning and Sustainable Landscapes
              </h3>
              <p className="mt-2 text-gray-600">
                Transform your outdoor space into an eco-friendly haven that will leave your neighbors in awe.
              </p>
            </div>
            {/* why 4 */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <img src="/clip-4.png" alt="Clip 4" className="rounded-lg w-[128px] mx-auto" />
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