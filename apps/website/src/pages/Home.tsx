import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BeforeAfterSlider } from '../components/ImageSlider';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/ui/WhatsApp';
import { getWebsiteConfig, DEFAULT_WEBSITE_DATA } from '../services/configService';
import type { PublishedWebsiteSettings, Project, ProjectImage } from '@garden/shared';

const PROJECTS_URL = import.meta.env.VITE_PROJECTS_URL;

export default function Home() {
  // Initialize with your existing hardcoded values as a fallback
  const [WebsiteSettings, setWebsiteSettings] = useState<PublishedWebsiteSettings>(DEFAULT_WEBSITE_DATA  as PublishedWebsiteSettings);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);  

  useEffect(() => {
    const loadData = async () => {
      const data = await getWebsiteConfig();
      setWebsiteSettings(data as PublishedWebsiteSettings);
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch(PROJECTS_URL);
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    loadData();
    fetchProjects();
  }, []);

  // Filter hero projects based on the IDs in WebsiteSettings using useMemo
  const heroProjects = useMemo(() => {
    if (projects.length > 0 && WebsiteSettings.content.hero.projects) {
      return projects.filter(project => 
        WebsiteSettings.content.hero.projects.includes(project.id)
      );
    }
    return [];
  }, [projects, WebsiteSettings.content.hero.projects]);

  // Rotate through hero project images every 5 seconds
  useEffect(() => {
    if (heroProjects.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroProjects.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroProjects.length]);

  return (
    <main className="bg-white text-gray-800">

      {/* Hero Section */}
      <section className="relative flex h-[100vh] min-h-[600px] items-center justify-center text-center text-white overflow-hidden">
        {/* Background images with crossfade effect */}
        {heroProjects.length > 0 ? (
          heroProjects.map((project, index) => (
            <img
              key={project.id}
              src={project.coverImage}
              alt={`Garden project by ${WebsiteSettings.title}`}
              className={`absolute z-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))
        ) : (
          <img
            src="/rose-garden.webp"
            alt={`A garden created by ${WebsiteSettings.title}`}
            className="absolute z-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative z-10 p-4 space-y-4">

          {WebsiteSettings.content.hero.logo && (
            <img src={`${WebsiteSettings.logo.url}`} className="mx-auto mb-4 h-[150px]" />
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
            {WebsiteSettings.content.services.cards
              .sort((a, b) => a.order - b.order)
              .map((service, index) => (
              <div key={index} className="rounded-lg bg-white p-8 shadow-md flex flex-col items-center">
                <a href={`/projects/${service.link}`}>
                  <img 
                    src={service.image.url} 
                    alt={service.title} 
                    className="rounded-lg mb-4 w-full object-cover" 
                  />
                </a>
                <h3 className="text-xl font-bold text-teal-700">
                  {service.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {service.text}
                </p>
              </div>
            ))}
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

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {projects
              .filter((project) => WebsiteSettings.content.gallery.projects?.includes(project.id))
              .map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
                >
                  <div className="aspect-[3/2] overflow-hidden">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex justify-between items-center p-4 text-left">
                    <h3 className="text-xl font-bold text-teal-800 group-hover:text-teal-600">
                      {project.title}
                    </h3>
                    <h3 className="text-sm font-light text-gray-500 group-hover:text-teal-600">
                      {new Date(project.updatedAt).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric' })}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>
          <Link
            to="/projects"
            className="mt-8 inline-block rounded-full border-2 border-teal-600 w-full py-3 font-bold text-teal-600 transition-colors hover:bg-teal-600 hover:text-white"
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
            {WebsiteSettings.content.benefits.cards
              .sort((a, b) => a.order - b.order)
              .map((benefit, index) => (
              <div key={index} className="rounded-lg bg-white p-8 shadow-md">
                <img 
                  src={benefit.image.url} 
                  alt={benefit.title} 
                  className="rounded-lg w-[150px] mx-auto mb-4" 
                />
                <h3 className="text-xl font-bold text-teal-700">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center space-y-4">
          {WebsiteSettings.content.testimonials.title && (
            <h1 className="text-4xl font-bold text-teal-800 md:text-4xl">
              {WebsiteSettings.content.testimonials.title}
            </h1>
          )}
          {WebsiteSettings.content.testimonials.text && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-teal-500 border-b-2 border-teal-300 pb-2">
              {WebsiteSettings.content.testimonials.text}
            </p>
          )}
          {WebsiteSettings.content.testimonials.projects && (
            WebsiteSettings.content.testimonials.projects.map((project, projectIndex) => (
              <div key={projectIndex} className='max-w-6xl items-center mx-auto'>
                <div className='p-4 border border-teal-500 rounded-lg'>
                  {project.testimonial.image === 'gallery' && project.testimonial.imageGroup && (
                    <div>
                      {project.testimonial.imageGroup.type === 'slider' && (
                        <div>
                          <BeforeAfterSlider 
                            beforeImage={project.testimonial.imageGroup.images[0].url}
                            afterImage={project.testimonial.imageGroup.images[1].url}
                            altText="Testimonial Image"
                            className='w-full lg:w-full'
                          />
                        </div>
                      )}
                      {project.testimonial.imageGroup.type === 'gallery' && (
                        <div className="mx-auto columns-2 gap-0">
                          {project.testimonial.imageGroup.images?.map((imageItem: ProjectImage, imageIndex: number) => (
                            <div
                              key={imageItem.id || imageIndex}
                              className="break-inside-avoid cursor-pointer overflow-hidden"
                            >
                              <img
                                src={imageItem.url}
                                alt={imageItem.alt || 'Testimonial image'}
                                className="w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {project.testimonial.image === 'featured' && (
                    <div className="items-center">
                      <img
                        src={project.coverImage}
                        alt='Testimonial Image'
                        className="m-auto object-cover"
                      />
                    </div>
                  )}

                  <h2 className="text-2xl font-light text-teal-600 md:text-4xl mt-4">
                    <i>"{project.testimonial.text}"</i>
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-lg text-teal-800">
                    <b>{project.testimonial.name}</b> - {project.testimonial.occupation}
                  </p>
                </div>
              </div>
            ))
          )}
          <div className="grid grid-cols-2 gap-4 max-w-6xl mx-auto">
            <button className=" p-2 flex items-center gap-2 justify-center bg-teal-800 text-teal-200 hover:bg-teal-600">
              <ArrowLeft size={16}/>Previous
            </button>
            <button className=" p-2 flex items-center gap-2 justify-center bg-teal-800 text-teal-200 hover:bg-teal-600">
              Next<ArrowRight size={16}/>
            </button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <Footer />
    </main>
  );
}