import { WhatsAppButton } from './ui/WhatsApp';
import {FacebookButton} from './ui/Facebook';
import { useState, useEffect } from 'react';
import { getWebsiteConfig, DEFAULT_WEBSITE_DATA } from '../services/configService';
import type { WebsiteSettings } from '@garden/shared';

export function Footer() {
  const [WebsiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(DEFAULT_WEBSITE_DATA);

  useEffect(() => {
    getWebsiteConfig().then(setWebsiteSettings);
  }, []);

  return (
    <footer className="bg-teal-800 pt-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">{WebsiteSettings.content.footer.title}</h2>
        <p className="mt-4 text-lg text-teal-200 mb-4">
          {WebsiteSettings.content.footer.text}<br />{WebsiteSettings.content.footer.cta.text}
        </p>
        <div className="my-6 grid gap-4 max-w-xl mx-auto justify-items-center">
          <WhatsAppButton 
            phoneNumber={WebsiteSettings.social.whatsapp} 
            variant="solid"
            label={WebsiteSettings.content.footer.cta.buttonText}
            message={WebsiteSettings.social.whatsappMessage} 
          />
          <FacebookButton
            action="follow"
            pageId="100004995376382" 
            variant="solid"
            label="follow us on facebook"
          />
        </div>
      </div>
      <div className="container mx-auto px-4 text-xs text-center py-8 text-teal-400">
        Copyright © 2026 NETWORKCARETAKER. All Rights Reserved.
      </div>
    </footer>
  );
}