import React from 'react';

interface FacebookIconProps {
  className?: string;
}

const FacebookIcon: React.FC<FacebookIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
  </svg>
);

interface MessengerIconProps {
  className?: string;
}

const MessengerIcon: React.FC<MessengerIconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 512 512"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M256.6 8C116.5 8 8 110.3 8 248.6c0 72.3 29.7 134.8 78.1 177.9 8.4 7.5 6.6 11.9 8.1 58.2A19.9 19.9 0 0 0 122 502.3c52.9-23.3 53.6-25.1 62.6-22.7C337.9 521.8 504 423.7 504 248.6 504 110.3 396.6 8 256.6 8zm149.2 185.1l-73 115.6a37.4 37.4 0 0 1 -53.9 9.9l-58.1-43.5a15 15 0 0 0 -18 0l-78.4 59.4c-10.5 7.9-24.2-4.6-17.1-15.7l73-115.6a37.4 37.4 0 0 1 53.9-9.9l58.1 43.5a15 15 0 0 0 18 0l78.4-59.4c10.4-8 24.1 4.5 17.1 15.6z" />
  </svg>
);

type ButtonVariant = 'solid' | 'outline' | 'floating';
type FacebookAction = 'follow' | 'group' | 'share' | 'messenger';

interface FacebookButtonProps {
  /** The action the button performs */
  action: FacebookAction;
  /** Required for 'follow' action (e.g., 'yourpageusername' or 'profile.php?id=YOUR_ID') */
  pageId?: string;
  /** Required for 'group' action (e.g., 'yourgroupid') */
  groupId?: string;
  /** Required for 'share' action (the URL to share) */
  shareUrl?: string;
  /** Optional text to pre-fill when sharing */
  shareQuote?: string;
  /** Required for 'messenger' action (e.g., 'yourpageusername' or 'YOUR_PAGE_ID') */
  messengerId?: string;
  /** Button label text (not used in icon-only or floating variants) */
  label?: string;
  /** Visual style of the button */
  variant?: ButtonVariant;
  /** Additional CSS classes */
  className?: string;
  /** If true, only the icon will be displayed, overriding the label */
  iconOnly?: boolean;
}

const FacebookButton: React.FC<FacebookButtonProps> = ({
  action,
  pageId,
  groupId,
  shareUrl,
  shareQuote,
  messengerId,
  label,
  variant = 'solid',
  className = '',
  iconOnly = false,
}) => {
  let href = '';
  let defaultLabel = '';
  let IconComponent: React.FC<{ className?: string }> = FacebookIcon;
  let ariaLabel = '';

  switch (action) {
    case 'follow':
      if (!pageId) {
        console.error("FacebookButton: 'pageId' is required for 'follow' action.");
        return null;
      }
      href = `https://www.facebook.com/${pageId}`;
      defaultLabel = 'Follow us on Facebook';
      ariaLabel = `Follow us on Facebook (${pageId})`;
      break;
    case 'group':
      if (!groupId) {
        console.error("FacebookButton: 'groupId' is required for 'group' action.");
        return null;
      }
      href = `https://www.facebook.com/groups/${groupId}`;
      defaultLabel = 'Join our Facebook Group';
      ariaLabel = `Join our Facebook Group (${groupId})`;
      break;
    case 'share':
      if (!shareUrl) {
        console.error("FacebookButton: 'shareUrl' is required for 'share' action.");
        return null;
      }
      { // Add block scope for declarations
        const encodedShareUrl = encodeURIComponent(shareUrl);
        const encodedShareQuote = shareQuote ? `&quote=${encodeURIComponent(shareQuote)}` : '';
        href = `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}${encodedShareQuote}`;
        defaultLabel = 'Share on Facebook';
        ariaLabel = `Share this on Facebook (${shareUrl})`;
      }
      break;
    case 'messenger':
      if (!messengerId) {
        console.error("FacebookButton: 'messengerId' is required for 'messenger' action.");
        return null;
      }
      href = `https://m.me/${messengerId}`;
      defaultLabel = 'Contact us on Messenger';
      IconComponent = MessengerIcon;
      ariaLabel = `Contact us via Facebook Messenger (${messengerId})`;
      break;
    default:
      console.error(`FacebookButton: Unknown action '${action}'.`);
      return null;
  }

  const buttonLabel = label || defaultLabel;

  // Base styles shared across variants
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer";

  // Specific styles for variants
  const variants: Record<ButtonVariant, string> = {
    solid: `bg-[#1877F2] hover:bg-[#156cdb] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`,
    outline: `border-2 border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:text-white px-6 py-3 rounded-full`,
    floating: `fixed bottom-6 right-6 bg-[#1877F2] hover:bg-[#156cdb] text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 z-50`
  };

  const currentStyle = variants[variant] || variants.solid;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${currentStyle} ${className}`}
      aria-label={ariaLabel}
    >
      <IconComponent className={iconOnly || variant === 'floating' ? "w-6 h-6" : "w-5 h-5 mr-2"} />
      {!(iconOnly || variant === 'floating') && <span>{buttonLabel}</span>}
    </a>
  );
};

export { FacebookIcon, MessengerIcon, FacebookButton };