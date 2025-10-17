import { SVGProps } from 'react';

export const XLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
  </svg>
);

export const MazadnetLogo = (props: SVGProps<SVGSVGElement>) => (
    <svg width="28" height="28" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M100 0L200 100L100 200L0 100L100 0Z" fill="currentColor"/>
        <path d="M100 25L175 100L100 175L25 100L100 25Z" fill="var(--color-bg-primary)"/>
        <path d="M100 40L160 100L100 160L40 100L100 40Z" fill="currentColor"/>
        <path d="M100 50L150 100L100 150L50 100L100 50Z" fill="var(--color-bg-primary)"/>
        <text x="100" y="118" fontFamily="Arial, sans-serif" fontSize="60" fill="currentColor" textAnchor="middle" fontWeight="bold">M</text>
    </svg>
);


export const WhatsAppIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M19.05 4.94A9.96 9.96 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.45 1.28 4.94L2 22l5.06-1.28c1.49.81 3.16 1.28 4.94 1.28h.01c5.52 0 10-4.48 10-10c0-2.76-1.12-5.26-2.95-7.06zm-7.05 15.28c-1.57 0-3.05-.49-4.33-1.36L5.8 19.8l1.01-1.84a8.04 8.04 0 0 1-1.39-4.48c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.49-6.2c-.26-.13-1.56-.77-1.8-.87s-.41-.13-.59.13c-.18.26-.68.87-.83 1.04s-.3.2-.56.07c-.26-.13-1.08-.4-2.06-1.27c-.76-.68-1.28-1.52-1.43-1.78s-.03-.39.12-.52c.13-.13.29-.33.43-.49s.19-.26.29-.43c.1-.18.05-.33-.02-.46s-.59-1.41-.8-1.93s-.42-.44-.58-.45c-.16-.01-.33-.01-.5-.01s-.41.06-.62.3c-.22.23-.83.81-.83 1.98s.85 2.3 1 2.46c.12.13 1.66 2.53 4.03 3.53c.59.25 1.05.4 1.41.51c.59.19 1.13.16 1.56.1c.48-.07 1.56-.64 1.78-1.25s.22-1.14.15-1.25c-.07-.12-.25-.19-.51-.32z"/>
  </svg>
);
