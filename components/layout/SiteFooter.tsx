import { CLINIC_INFO } from "../../config/clinicData";
import { getWhatsAppLink } from "../../utils/contact";
import { Phone, Mail, MapPin, ExternalLink, Globe, Share2 } from "lucide-react";
import "./SiteFooter.css";

export default function SiteFooter() {
  const whatsappUrl = getWhatsAppLink(CLINIC_INFO.phone);
  const currentYear = new Date().getFullYear();

  const NAV_LINKS = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Panels", href: "#panels" },
    { label: "Doctor", href: "#profile" },
    { label: "Reviews", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="site-footer">
      <div className="container-shell site-footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-row">
              <img
                src="/logo/logo.png"
                alt="Pelita Clinic"
                className="footer-logo"
                width={40}
                height={40}
              />
              <div>
                <p className="footer-name">{CLINIC_INFO.name}</p>
                <p className="footer-tagline">Miri family clinic</p>
              </div>
            </div>
            <p className="footer-blurb">
              Compassionate care for general, women&apos;s, and children&apos;s health in Miri.
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com" className="footer-social" aria-label="Facebook">
                <Globe size={17} strokeWidth={1.75} />
              </a>
              <a href="https://instagram.com" className="footer-social" aria-label="Instagram">
                <Share2 size={17} strokeWidth={1.75} />
              </a>
              <a href={whatsappUrl} className="footer-social" aria-label="WhatsApp">
                <Phone size={17} strokeWidth={1.75} />
              </a>
            </div>
          </div>

          <nav className="footer-nav" aria-label="Footer">
            <p className="footer-label">Site</p>
            <ul className="footer-linklist">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-contact">
            <p className="footer-label">Contact</p>
            <ul className="footer-contact-list">
              <li>
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="footer-contact-line">
                  <Phone size={15} strokeWidth={1.75} aria-hidden />
                  <span>{CLINIC_INFO.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CLINIC_INFO.email}`} className="footer-contact-line">
                  <Mail size={15} strokeWidth={1.75} aria-hidden />
                  <span>{CLINIC_INFO.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={CLINIC_INFO.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-contact-line"
                >
                  <MapPin size={15} strokeWidth={1.75} aria-hidden />
                  <span>
                    Downtown Miri
                    <ExternalLink size={11} className="footer-ext" aria-hidden />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-meta">
          <p className="footer-copy">© {currentYear} {CLINIC_INFO.name}</p>
          <p className="footer-scribear">
            Paws-itively Professional <span className="footer-scribear-dot">•</span> Coded by{" "}
            <a
              href="https://scribear.my/"
              className="footer-scribear-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Scribear
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
