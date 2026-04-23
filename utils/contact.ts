export function getWhatsAppLink(phone: string): string {
  return `https://wa.me/6${phone.replace(/[^0-9]/g, "")}`;
}
