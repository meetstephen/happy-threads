// WhatsApp helpers — phone is in international format without "+" or spaces
export const WHATSAPP_PHONE = '2349065092129';
export const WHATSAPP_DISPLAY = '+234 906 509 2129';

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
}

export function orderMessage(designName: string, designId: string): string {
  return `Hello Happiness Fashion World! 👋

I just discovered your portfolio and I love this piece:

✨ Design: ${designName}
🔖 Reference: ${designId}

Could you share availability, pricing, and how we can proceed with my measurements? Thank you!`;
}

export function generalEnquiryMessage(): string {
  return `Hello Happiness Fashion World! 👋

I came across your beautiful collection and I'd love to ask a few questions about your designs and how to place an order. Thank you!`;
}

export function styleConsultMessage(stylePref: string): string {
  return `Hello Happiness Fashion World! 👋

I just took your AI Style Finder quiz and my recommended style is: ${stylePref}.

I'd love to book a consultation. When are you available?`;
}
