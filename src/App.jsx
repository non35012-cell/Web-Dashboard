import { useMemo, useRef, useState } from "react";
import { translations } from "./data/translations.js";
import {
  APPOINTMENT_TIMES,
  CLINIC_ADDRESS,
  CLINIC_HOURS,
  SERVICES,
  TWO_GIS_SEARCH_URL,
  WHATSAPP_PHONE,
} from "./data/config.js";

function getInitialLanguage() {
  const savedLanguage = window.localStorage.getItem("ak-tis-language");
  return savedLanguage === "ru" ? "ru" : "kk";
}

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  const paths = {
    tooth: (
      <>
        <path d="M12 4.3c-1.6-1.1-4.4-1.5-6-.1-2 1.7-1.1 5.3-.1 7.8.8 2 1.4 6.7 3.2 7.4 1.3.5 1.7-2 2-3.4.2-1 .6-2 1-2s.8 1 1 2c.3 1.4.7 3.9 2 3.4 1.8-.7 2.4-5.4 3.2-7.4 1-2.5 1.9-6.1-.1-7.8-1.6-1.4-4.4-1-6 .1Z" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />
        <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
      </>
    ),
    heart: (
      <path d="M20.8 8.8c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.7Z" />
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    whatsapp: (
      <>
        <path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3 20l1-4.8a8.4 8.4 0 1 1 16.5-3.6Z" />
        <path d="M8.2 8.2c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4 0 .6.5.9 1.3 1.6 2.2 2.1.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .3-.2 1.1-.7 1.5-.5.5-1.1.7-1.8.7-.5 0-1.2-.2-2-.5-1.3-.6-2.5-1.6-3.4-2.7-.7-.9-1.2-1.9-1.3-2.6-.1-.8.1-1.5.5-2.2Z" />
      </>
    ),
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function formatPrice(value, language) {
  const locale = language === "kk" ? "kk-KZ" : "ru-KZ";
  return `${new Intl.NumberFormat(locale).format(value)} ₸`;
}

function getLocalDateString() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function getServiceCountText(t, language, count) {
  if (count === 1) return t.panel.countOne;
  if (language === "ru" && count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14)) {
    return t.panel.countFew;
  }
  return t.panel.count;
}

function Header({ t, language, onLanguageChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["#home", t.nav.home],
    ["#services", t.nav.services],
    ["#about", t.nav.about],
    ["#contact", t.nav.contact],
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Ақ Тіс — басты бет">
          <span className="brand-mark">
            <Icon name="tooth" size={23} />
          </span>
          <span className="brand-copy">
            <strong>Ақ Тіс</strong>
            <small>СТОМАТОЛОГИЯ</small>
          </span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.menu}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
        <nav
          id="primary-navigation"
          className={`main-nav${menuOpen ? " is-open" : ""}`}
          aria-label={t.nav.navigation}
        >
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={closeMenu}>
              {label}
            </a>
          ))}
          <div className="language-switch" role="group" aria-label="Language">
            {["kk", "ru"].map((item) => (
              <button
                type="button"
                key={item}
                className={language === item ? "active" : ""}
                aria-pressed={language === item}
                onClick={() => {
                  onLanguageChange(item);
                  closeMenu();
                }}
              >
                {item === "kk" ? "ҚАЗ" : "РУС"}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

function Hero({ t, onBook }) {
  return (
    <section className="hero-section" id="home">
      <div className="hero-layout page-width">
        <div className="hero-copy">
          <div className="eyebrow"><span />{t.hero.eyebrow}</div>
          <h1>{t.hero.title}</h1>
          <p className="hero-description">{t.hero.description}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#services">
              {t.hero.servicesButton}<Icon name="arrow" size={18} />
            </a>
            <button className="button button-whatsapp" type="button" onClick={onBook}>
              <Icon name="whatsapp" size={19} />{t.hero.whatsappButton}
            </button>
          </div>
          <div className="hero-trust">
            <div className="trust-item">
              <span className="trust-icon"><Icon name="heart" size={18} /></span>
              <span>{t.hero.care}</span>
            </div>
            <span className="trust-separator" />
            <div className="trust-item">
              <span className="trust-icon"><Icon name="spark" size={18} /></span>
              <span>{t.hero.comfort}</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo-wrap">
            <img
              className="hero-photo"
              src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1400&q=85"
              alt={t.hero.imageAlt}
            />
            <div className="photo-caption">
              <span className="caption-icon"><Icon name="tooth" size={19} /></span>
              <span>{t.hero.imageTag}</span>
            </div>
          </div>
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-dot dot-one" />
          <div className="hero-dot dot-two" />
        </div>
      </div>
      <a className="scroll-cue" href="#services" aria-label={t.nav.services}>
        <span />
      </a>
    </section>
  );
}

function ServiceCard({ service, selected, title, onToggle, t, price }) {
  return (
    <label className={`service-card${selected ? " is-selected" : ""}`}>
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggle(service.id)}
        aria-label={`${title}, ${price}`}
      />
      <span className="service-check" aria-hidden="true">
        {selected && <Icon name="check" size={15} />}
      </span>
      <span className="service-content">
        <span className="service-index">0{SERVICES.findIndex((item) => item.id === service.id) + 1}</span>
        <strong>{title}</strong>
        <span className="service-price">{price}</span>
      </span>
      <span className="service-select">{selected ? t.services.selected : t.services.select}</span>
    </label>
  );
}

function Services({ t, selectedIds, onToggle, onClear, language, total }) {
  return (
    <section className="section services-section" id="services">
      <div className="page-width">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span />{t.services.eyebrow}</div>
            <h2>{t.services.title}</h2>
            <p>{t.services.description}</p>
          </div>
          {selectedIds.length > 0 && (
            <button className="text-button" type="button" onClick={onClear}>
              {t.services.clear}<Icon name="close" size={17} />
            </button>
          )}
        </div>
        <div className="services-grid">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selected={selectedIds.includes(service.id)}
              title={t.services.names[service.id]}
              price={formatPrice(service.price, language)}
              onToggle={onToggle}
              t={t}
            />
          ))}
        </div>
        <div className="services-total" aria-live="polite">
          <div className="total-copy">
            <span className="total-label">{t.services.total}</span>
            <strong>{formatPrice(total, language)}</strong>
          </div>
          <p>{selectedIds.length ? `${selectedIds.length} ${getServiceCountText(t, language, selectedIds.length)}` : t.services.empty}</p>
        </div>
      </div>
    </section>
  );
}

function BookingForm({ t, language, selectedServices, total, formRef, onSubmit, fallbackUrl }) {
  const minDate = getLocalDateString();

  return (
    <section className="section booking-section" id="booking">
      <div className="booking-layout page-width">
        <div className="booking-intro">
          <div className="eyebrow"><span />{t.booking.eyebrow}</div>
          <h2>{t.booking.title}</h2>
          <p>{t.booking.description}</p>
          <div className="booking-note">
            <span><Icon name="clock" size={19} /></span>
            <p>{t.booking.disclaimer}</p>
          </div>
        </div>
        <form className="booking-form" ref={formRef} onSubmit={onSubmit} noValidate>
          <div className="form-grid">
            <label className="form-field form-full">
              <span>{t.booking.name} <i>*</i></span>
              <input name="name" type="text" autoComplete="name" placeholder={t.booking.namePlaceholder} />
            </label>
            <label className="form-field">
              <span>{t.booking.date} <i>*</i></span>
              <input name="date" type="date" min={minDate} />
            </label>
            <label className="form-field">
              <span>{t.booking.time} <i>*</i></span>
              <select name="time" defaultValue="">
                <option value="" disabled>{t.booking.timePlaceholder}</option>
                {APPOINTMENT_TIMES.map((time) => <option key={time} value={time}>{time}</option>)}
              </select>
            </label>
          </div>
          <div className="form-selection">
            <span className="form-selection-title">{t.booking.services}</span>
            {selectedServices.length ? (
              <ul>
                {selectedServices.map((service) => (
                  <li key={service.id}>
                    <span>{t.services.names[service.id]}</span>
                    <strong>{formatPrice(service.price, language)}</strong>
                  </li>
                ))}
              </ul>
            ) : <p>{t.booking.noServices}</p>}
            <div className="form-total">
              <span>{t.booking.total}</span>
              <strong>{formatPrice(total, language)}</strong>
            </div>
          </div>
          <p className="form-error" role="alert" aria-live="assertive" />
          {fallbackUrl && (
            <p className="form-fallback" role="status">
              {t.booking.fallback}{" "}
              <a href={fallbackUrl} target="_blank" rel="noopener noreferrer">{t.contact.whatsapp}</a>
            </p>
          )}
          <button className="button button-primary form-submit" type="submit">
            <Icon name="whatsapp" size={19} />{t.booking.send}
          </button>
          <p className="form-footnote">{t.booking.disclaimer}</p>
        </form>
      </div>
    </section>
  );
}

function About({ t }) {
  const icons = ["heart", "spark", "tooth"];
  return (
    <section className="section about-section" id="about">
      <div className="page-width">
        <div className="about-heading">
          <div className="eyebrow"><span />{t.about.eyebrow}</div>
          <h2>{t.about.title}</h2>
          <p>{t.about.description}</p>
        </div>
        <div className="features-grid">
          {t.about.features.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-icon"><Icon name={icons[index]} size={23} /></span>
              <span className="feature-number">0{index + 1}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ t, language }) {
  const greeting = encodeURIComponent(
    language === "kk"
      ? "Сәлеметсіз бе! Ақ Тіс стоматологиясы туралы ақпарат алғым келеді."
      : "Здравствуйте! Хочу узнать информацию о стоматологии «Ақ Тіс».",
  );
  return (
    <section className="section contact-section" id="contact">
      <div className="contact-layout page-width">
        <div className="contact-copy">
          <div className="eyebrow"><span />{t.contact.eyebrow}</div>
          <h2>{t.contact.title}</h2>
          <p>{t.contact.description}</p>
          <div className="contact-actions">
            <a className="button button-whatsapp" href={`https://wa.me/${WHATSAPP_PHONE}?text=${greeting}`} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={19} />{t.contact.whatsapp}
            </a>
            <a className="button button-outline" href={TWO_GIS_SEARCH_URL} target="_blank" rel="noopener noreferrer">
              <Icon name="pin" size={18} />{t.contact.openMaps}
            </a>
          </div>
        </div>
        <div className="contact-card">
          <div className="contact-card-top">
            <span className="brand-mark"><Icon name="tooth" size={22} /></span>
            <div><strong>Ақ Тіс</strong><span>{t.contact.locationLabel}</span></div>
          </div>
          <div className="contact-detail">
            <span className="detail-icon"><Icon name="pin" size={18} /></span>
            <div><small>{t.contact.address}</small><p>{CLINIC_ADDRESS[language]}</p></div>
          </div>
          <div className="contact-detail">
            <span className="detail-icon"><Icon name="clock" size={18} /></span>
            <div>
              <small>{t.contact.hours}</small>
              <p>{t.contact.weekdays}: {CLINIC_HOURS.open}–{CLINIC_HOURS.close}<br />{t.contact.sunday}: {t.contact.closed}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner page-width">
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark"><Icon name="tooth" size={22} /></span>
          <span className="brand-copy"><strong>Ақ Тіс</strong><small>СТОМАТОЛОГИЯ</small></span>
        </a>
        <p>{t.footer.tagline}</p>
        <small>© {new Date().getFullYear()} Ақ Тіс. {t.footer.rights}</small>
      </div>
    </footer>
  );
}

function BookingPanel({ t, language, selectedServices, total, onClear, formRef }) {
  if (!selectedServices.length) return null;

  return (
    <aside className="booking-panel" aria-label={t.panel.summary}>
      <div className="booking-panel-inner">
        <div className="panel-services">
          <span className="panel-count">{selectedServices.length} {getServiceCountText(t, language, selectedServices.length)}</span>
          <span className="panel-summary">
            {selectedServices.map((service) => t.services.names[service.id]).join(", ")}
          </span>
        </div>
        <div className="panel-total">
          <span>{t.panel.total}</span>
          <strong>{formatPrice(total, language)}</strong>
        </div>
        <button
          className="button button-whatsapp panel-button"
          type="button"
          onClick={() => {
            formRef.current?.requestSubmit();
            document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <Icon name="whatsapp" size={18} /><span>{t.panel.book}</span>
        </button>
        <button className="panel-clear" type="button" onClick={onClear} aria-label={t.services.clear}>
          <Icon name="close" size={18} />
        </button>
      </div>
    </aside>
  );
}

export default function App() {
  const [language, setLanguage] = useState(getInitialLanguage);
  const [selectedIds, setSelectedIds] = useState([]);
  const [fallbackUrl, setFallbackUrl] = useState("");
  const formRef = useRef(null);
  const t = translations[language];
  const selectedServices = useMemo(
    () => SERVICES.filter((service) => selectedIds.includes(service.id)),
    [selectedIds],
  );
  const total = useMemo(
    () => selectedServices.reduce((sum, service) => sum + service.price, 0),
    [selectedServices],
  );

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem("ak-tis-language", nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  const toggleService = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    const error = formRef.current?.querySelector(".form-error");
    if (error) error.textContent = "";
  };

  const openWhatsApp = (event) => {
    event.preventDefault();
    const form = formRef.current;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const date = String(data.get("date") ?? "");
    const time = String(data.get("time") ?? "");
    const error = form.querySelector(".form-error");
    let message = "";

    if (!name) message = t.booking.errors.name;
    else if (!date) message = t.booking.errors.date;
    else if (date < getLocalDateString()) message = t.booking.errors.pastDate;
    else if (!time) message = t.booking.errors.time;
    else if (!selectedServices.length) message = t.booking.errors.services;

    if (message) {
      error.textContent = message;
      if (!selectedServices.length) {
        document.querySelector("#services")?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        const fieldName = !name ? "name" : !date ? "date" : date < getLocalDateString() ? "date" : "time";
        form.elements.namedItem(fieldName)?.focus();
      }
      return;
    }

    error.textContent = "";
    const lines = [
      t.whatsapp.greeting,
      "",
      `${t.whatsapp.name}: ${name}`,
      `${t.whatsapp.date}: ${date}`,
      `${t.whatsapp.time}: ${time}`,
      "",
      `${t.whatsapp.services}:`,
      ...selectedServices.map(
        (service, index) => `${index + 1}. ${t.services.names[service.id]} — ${formatPrice(service.price, language)}`,
      ),
      "",
      t.whatsapp.thanks,
    ];
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setFallbackUrl(url);
  };

  const bookFromHero = () => {
    document.querySelector(selectedServices.length ? "#booking" : "#services")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Header t={t} language={language} onLanguageChange={changeLanguage} />
      <main>
        <Hero t={t} onBook={bookFromHero} />
        <Services
          t={t}
          selectedIds={selectedIds}
          onToggle={toggleService}
          onClear={() => setSelectedIds([])}
          language={language}
          total={total}
        />
        <BookingForm
          t={t}
          language={language}
          selectedServices={selectedServices}
          total={total}
          formRef={formRef}
          onSubmit={openWhatsApp}
          fallbackUrl={fallbackUrl}
        />
        <About t={t} />
        <Contact t={t} language={language} />
      </main>
      <Footer t={t} />
      <BookingPanel
        t={t}
        language={language}
        selectedServices={selectedServices}
        total={total}
        onClear={() => setSelectedIds([])}
        formRef={formRef}
      />
    </>
  );
}
