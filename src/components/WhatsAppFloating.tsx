import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useTheme } from '../components/useTheme';

/**
 * Floating WhatsApp button component.
 * Renders a circular button fixed at the bottom‑right of the viewport.
 * Clicking the button opens a new WhatsApp chat (replace the phone number
 * with the museum's contact). The component uses Tailwind CSS utilities
 * and respects the dark/light theme via the `useTheme` hook.
 */
const WhatsAppFloating: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const phoneNumber = '+59112345678'; // TODO: replace with actual number
  const message = encodeURIComponent('¡Hola! Quisiera obtener más información sobre la Casa Museo Potosí Mineral.');
  const whatsappLink = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;

  const bg = isDark ? 'bg-green-700/80' : 'bg-green-500/80';
  const hoverBg = isDark ? 'hover:bg-green-600' : 'hover:bg-green-600';

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${bg} ${hoverBg} backdrop-blur-md border border-white/30`}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-white text-2xl" />
    </a>
  );
};

export default WhatsAppFloating;
