import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative flex h-[60vh] min-h-[400px] items-center justify-center text-center text-white">
        <Image
          src="/rose-garden.webp"
          alt="A beautiful, lush garden created by Acrollam Gardens"
          layout="fill"
          objectFit="cover"
          className="absolute z-0"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl font-bold text-white md:text-6xl">
            Mallorca Gardens
          </h1>
          <p className="mt-4 text-lg font-light text-green-100 md:text-2xl">
            Mallorcas Premier Gardening & Landscaping Experts
          </p>
          <Link
            href="/contact"
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
            <Image src="/project-1.webp" alt="Garden project 1" width={600} height={400} className="rounded-lg" />
            <Image src="/project-2.webp" alt="Garden project 2" width={600} height={400} className="rounded-lg" />
            <Image src="/project-3.webp" alt="Garden project 3" width={600} height={400} className="rounded-lg" />
          </div>
          <Link
            href="/projects"
            className="mt-8 inline-block rounded-full border-2 border-green-600 px-8 py-3 font-bold text-green-600 transition-colors hover:bg-green-600 hover:text-white"
          >
            View All Projects
          </Link>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-green-800 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to transform your garden?</h2>
          <p className="mt-4 text-lg text-green-100">
            Contact us today for a free, no-obligation consultation.
          </p>
          <Link href="/contact" className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-bold text-green-800 transition-transform hover:scale-105">
            Get in Touch
          </Link>
        </div>
      </footer>
    </main>
  );
}