import { WhatsAppButton } from './ui/WhatsApp';

export function Footer() {
  return (
    <footer className="bg-teal-800 py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">Get in Touch with Our Skilled Gardeners for a Free Consultation</h2>
        <p className="mt-4 text-lg text-teal-100 mb-4">
          Our expert team specializes in custom and sustainable gardening solutions across beautiful Mallorca.<br />
          Contact us for a free consultation and let us bring your unique vision to life.
        </p>
        <WhatsAppButton 
            phoneNumber="34123456789" 
            message="Hola James! I need a website built."
            variant="solid"
          />
      </div>
    </footer>
  );
}