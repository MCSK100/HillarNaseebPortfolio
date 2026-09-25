import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  ArrowUpRight, Award, BarChart3, CheckCircle, ExternalLink, GraduationCap,
  Mail, MapPin, Megaphone, Phone, Search,
  Target, TrendingUp, Globe,
} from 'lucide-react';
import {
  certifications, contact, currentProjects, education, experience, keyHighlights,
  navigation, process, projects, services, skillGroups, socialLinks, stats,
} from './data/siteData';
import MagneticButton from './components/MagneticButton';

const serviceIcons = {
  code: Search,
  monitor: Megaphone,
  sparkles: Target,
  layers: BarChart3,
  bolt: TrendingUp,
  rocket: Globe,
};

const skillIconStyles = ['skill-icon', 'skill-icon teal', 'skill-icon violet', 'skill-icon amber'];
const skillIconComponents = [Search, BarChart3, Megaphone, Target];

const toolStrip = ['SEMrush', 'Ahrefs', 'Moz Pro', 'GA4', 'Search Console', 'Google Ads', 'Meta Ads', 'Screaming Frog', 'WordPress', 'HubSpot', 'Tag Manager', 'Ubersuggest'];

function SectionHeading({ eyebrow, tone = '', title, sub, align = 'left' }) {
  return (
    <motion.div
      className={`section-heading ${align === 'center' ? 'section-heading--center' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <span className={`eyebrow-pill ${tone}`}>{eyebrow}</span>
      <h2>{title}</h2>
      {sub ? <p className="sub">{sub}</p> : null}
    </motion.div>
  );
}

/* 3D tilt wrapper — rotates children toward the cursor with spring physics.
   Disabled on touch devices / reduced-motion for accessibility. */
function Tilt({ children, max = 10 }) {
  const reduce = useReducedMotion();
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 16 });
  const sry = useSpring(ry, { stiffness: 160, damping: 16 });

  const handleMove = (e) => {
    if (!enabled || reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="tilt-stage" ref={ref} onMouseMove={handleMove} onMouseLeave={reset}>
      <motion.div className="tilt-inner" style={{ rotateX: srx, rotateY: sry }}>
        {children}
      </motion.div>
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const reduceMotion = useReducedMotion();

  /* page scroll progress bar */
  const { scrollYProgress } = useScroll();
  const pageProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });

  /* hero 3D parallax — layers drift at different speeds on scroll */
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const copyY = useTransform(heroProgress, [0, 1], [0, -70]);
  const copyOpacity = useTransform(heroProgress, [0, 0.85], [1, 0.1]);
  const photoY = useTransform(heroProgress, [0, 1], [0, 110]);
  const tagOneY = useTransform(heroProgress, [0, 1], [0, -80]);
  const tagTwoY = useTransform(heroProgress, [0, 1], [0, 150]);
  const orbY = useTransform(heroProgress, [0, 1], [0, 160]);
  const px = (value) => (reduceMotion ? undefined : value);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 30);
      setHeaderHidden(current > lastScroll && current > 140);
      lastScroll = current;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
  }, [menuOpen]);

  return (
    <div className="app-shell">
      <motion.div className="progress-bar" style={{ scaleX: pageProgress }} aria-hidden="true" />
      <div className="top-strip">Available for SEO & Meta Ads roles and freelance growth projects — Coimbatore / Remote</div>

      <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''} ${headerHidden ? 'site-header--hidden' : ''}`}>
        <nav className="nav container" aria-label="Main navigation">
          <a href="#home" className="brand" aria-label="Hillar home">
            <span className="brand-mark">HN</span>
            <span>HILLAR NASEEB<small>SEO • META ADS</small></span>
          </a>
          <div className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`}>
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={activeSection === item.href.replace('#', '') ? 'active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            <a href="#contact" className="nav-cta">Let&apos;s Talk <ArrowUpRight size={15} /></a>
            <button type="button" className="menu-toggle" aria-label="Toggle navigation menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
              <span /><span />
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section id="home" className="hero container" ref={heroRef}>
          <motion.div className="orb orb--one" style={px({ y: orbY })} aria-hidden="true" />
          <motion.div className="orb orb--two" style={px({ y: orbY })} aria-hidden="true" />
          <div className="hero-grid">
            <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
              <motion.div style={px({ y: copyY, opacity: copyOpacity })}>
              <span className="badge"><span className="badge-dot" /> DIGITAL MARKETING & SEO ANALYST</span>
              <h1 className="hero-title">
                I turn searches into traffic, and <span className="gradient-text">traffic into revenue.</span>
              </h1>
              <p className="hero-text">
                I&apos;m <strong>Hillar Naseeb N</strong>, SEO Analyst at TN Industrial Connect — I combine
                technical, on-page & local SEO with high-intent Meta Ads so businesses don&apos;t just get
                found, they get <strong>enquiries, admissions and sales</strong>. 3+ years, 15+ tools, one
                obsession: measurable growth.
              </p>
              <div className="hero-actions">
                <MagneticButton href="#projects">View SEO Work</MagneticButton>
                <MagneticButton href="#contact" variant="secondary">Hire Me</MagneticButton>
                <a href="/resume.pdf" className="resume-link" download>Download Resume</a>
              </div>
              <div className="hero-proof">
                {stats.map((s) => (
                  <div key={s.label} className="proof-item">
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="contact-chips">
                <a className="chip" href={`mailto:${contact.email}`}><Mail size={14} /> {contact.email}</a>
                <a className="chip" href="tel:+918778000970"><Phone size={14} /> {contact.phone}</a>
                <span className="chip"><MapPin size={14} /> {contact.location}</span>
              </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
            >
              <motion.div className="photo-wrap" style={px({ y: photoY })}>
              <Tilt max={10}>
                <div className="photo-frame tilt-pop-sm">
                  <img src="/banner-img.jpeg" alt="Hillar Naseeb N — Digital Marketing and SEO Analyst" />
                  <div className="photo-caption">
                    <div>
                      <strong>Hillar Naseeb N</strong>
                      <span>SEO • META ADS • LEAD GEN</span>
                    </div>
                    <div className="exp">3+<br />YRS</div>
                  </div>
                </div>
              </Tilt>
              <motion.div className="float-tag float-tag--one" style={px({ y: tagOneY })}><TrendingUp size={15} className="up" /> Meta Ads • Facebook + Instagram</motion.div>
              <motion.div className="float-tag float-tag--two" style={px({ y: tagTwoY })}><CheckCircle size={15} className="up" /> GA4 • Search Console Certified</motion.div>
              <div className="photo-stats">
                <div className="photo-stat"><strong>HubSpot</strong><span>CERTIFIED</span></div>
                <div className="photo-stat"><strong>GA4</strong><span>CERTIFIED</span></div>
                <div className="photo-stat"><strong>Google Ads</strong><span>CERTIFIED</span></div>
              </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* TOOLS */}
        <div className="container">
          <div className="tools-strip">
            <div className="marquee">
              {[...toolStrip, ...toolStrip].map((t, i) => (
                <span key={`${t}-${i}`} aria-hidden={i >= toolStrip.length}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <section id="about" className="section container">
          <SectionHeading eyebrow="ABOUT ME" title="A marketer who thinks in pipelines, not just clicks." sub="Most marketers hand you traffic reports. I hand you leads — because I've carried a sales target too." />
          <div className="about-grid">
            <aside className="profile-card">
              <img className="profile-photo" src="/banner-img.jpeg" alt="Hillar Naseeb N" />
              <h3>Hillar Naseeb N</h3>
              <span className="profile-role">Digital Marketing & SEO Analyst</span>
              <div className="profile-rows">
                <div><Mail size={16} /> {contact.email}</div>
                <div><Phone size={16} /> {contact.phone}</div>
                <div><MapPin size={16} /> {contact.location}</div>
                <div><ExternalLink size={16} /> linkedin.com/in/hillar-naseeb</div>
              </div>
              <div className="stats-row">
                {stats.map((s) => (
                  <div key={s.label} className="stat"><strong>{s.value}</strong><span>{s.label}</span></div>
                ))}
              </div>
            </aside>
            <div>
              <p className="about-copy">
                I&apos;m currently <strong>Digital Marketing & SEO Analyst at TN Industrial Connect</strong>, where
                I own the full growth loop — technical and on-page SEO, Meta Ads, and GA4 reporting that
                connects every rupee spent to pipeline generated.
              </p>
              <p className="about-copy">
                Before that, at <strong>Inmakes Infotech (Kochi)</strong>, I climbed from Business Development
                Executive to <strong>Assistant Team Manager</strong> — promoting digital marketing programs and
                webinars, running end-to-end lead generation, and coaching sales executives to hit targets
                month after month. That sales-floor experience is my edge: I optimize for
                <strong> revenue, not rankings alone</strong>.
              </p>
              <div className="highlights-grid">
                {keyHighlights.map((h) => (
                  <div key={h} className="highlight"><CheckCircle size={17} /> {h}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="section container" style={{ paddingTop: 0 }}>
          <SectionHeading align="center" eyebrow="TOOLKIT" tone="violet" title="Every tool needed to rank, track and scale." sub="From crawl audits to creative testing — one stack, full funnel." />
          <div className="skills-grid">
            {skillGroups.map((group, i) => {
              const Icon = skillIconComponents[i % skillIconComponents.length];
              return (
                <motion.article
                  key={group.category}
                  className={`skill-card ${i === 0 ? 'featured' : ''}`}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className={skillIconStyles[i % skillIconStyles.length]}><Icon size={22} /></div>
                  <h3>{group.category}</h3>
                  <p>{group.items.length} tools & skills</p>
                  <div className="tag-cloud">
                    {group.items.map((item) => <span key={item}>{item}</span>)}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="section container" style={{ paddingTop: 0 }}>
          <SectionHeading eyebrow="EXPERIENCE" title="3+ years across SEO, ads, sales & leadership." />
          <div className="timeline">
            {experience.map((item, idx) => (
              <motion.article
                key={`${item.role}-${item.period}`}
                className="timeline-card"
                initial={{ opacity: 0, y: 34, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <div className="timeline-head">
                  <div>
                    <span className="company">{item.company}</span>
                    <h3>{item.role}</h3>
                  </div>
                  <span className={`period ${idx === 0 ? 'live' : ''}`}>{item.period}</span>
                </div>
                <p className="timeline-summary">{item.summary}</p>
                <ul>
                  {item.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <div className="tech-tags">
                  {item.stack.map((t) => <span key={t}>{t}</span>)}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="section container" style={{ paddingTop: 0 }}>
          <SectionHeading eyebrow="SELECTED WORK" tone="amber" title="SEO projects, documented end to end." sub="Here's exactly what each engagement covered — ask me for the full walkthrough." />
          <div className="project-grid">
            {projects.map((project, i) => (
              <motion.article
                key={project.title}
                className="project-card"
                initial={{ opacity: 0, y: 48, rotateX: 12 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className={`project-banner ${i % 2 ? 'project-banner--violet' : 'project-banner--emerald'}`}>
                  <span className="project-status">{project.status}</span>
                  <div className="big">{project.number} — {project.title.split(' ').slice(0, 2).join(' ')}</div>
                </div>
                <div className="project-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul className="deliver-list">
                    {project.deliverables.map((d) => (
                      <li key={d}><CheckCircle size={15} /> {d}</li>
                    ))}
                  </ul>
                  <p className="outcome"><strong>Outcome:</strong> {project.outcome}</p>
                  <div className="project-tech">
                    {project.tech.map((t) => <span key={t}>{t}</span>)}
                  </div>
                  <div className="project-actions">
                    <a className="link-btn" href={`${project.contactUrl}?subject=Case study: ${project.title}`}>Request case study <ArrowUpRight size={15} /></a>
                    <a className="link-btn alt" href={project.profileUrl} target="_blank" rel="noreferrer">LinkedIn</a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* FOCUS */}
        <section className="container" style={{ paddingBottom: 8 }}>
          <div className="focus-grid">
            {currentProjects.map(({ name, status }) => (
              <div key={name} className="focus-item">
                <span className="focus-dot" />
                <div><strong>{name}</strong><small>{status}</small></div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section className="section container">
          <SectionHeading align="center" eyebrow="SERVICES" tone="violet" title="Hire me for outcomes, not activities." sub="Every service ends in something you can measure — rankings, leads or cost-per-result." />
          <div className="services-grid">
            {services.map(({ title, description, icon }, i) => {
              const Icon = serviceIcons[icon] || Search;
              return (
                <motion.article key={title} className="service-card" initial={{ opacity: 0, y: 34, rotateX: 10 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: '-60px' }} whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
                  <div className="service-icon"><Icon size={22} /></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* PROCESS */}
        <section className="section container" style={{ paddingTop: 0 }}>
          <div className="band-dark">
          <SectionHeading eyebrow="HOW I WORK" title="A simple process. No black box." sub="You'll always know what's happening, why it matters, and what comes next." />
          <div className="process-grid">
            {process.map(({ step, title, description }, i) => (
              <motion.div
                key={step}
                className="process-step"
                initial={{ opacity: 0, y: 34, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <span className="process-step-num">{step}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </motion.div>
            ))}
          </div>
          </div>
        </section>

        {/* CREDENTIALS */}
        <section className="section container" style={{ paddingTop: 0 }}>
          <SectionHeading eyebrow="CREDENTIALS" tone="amber" title="Certified skills, solid foundation." sub="Google and HubSpot certified — plus the maths degree that makes analytics click." />
          <div className="cred-grid">
            {certifications.map(({ title, issuer }) => (
              <div key={title} className="cred-card">
                <span className="cred-ico"><Award size={20} /></span>
                <h3>{title}</h3>
                <p>{issuer}</p>
              </div>
            ))}
            {education.map(({ degree, school, period }) => (
              <div key={degree} className="cred-card">
                <span className="cred-ico" style={{ background: '#e6f7ef', color: '#046c4e' }}><GraduationCap size={20} /></span>
                <h3>{degree}</h3>
                <p>{school} — {period}</p>
              </div>
            ))}
            <div className="cred-card">
              <span className="cred-ico" style={{ background: '#ede9fe', color: '#7c3aed' }}><Globe size={20} /></span>
              <h3>Tamil • English • Malayalam</h3>
              <p>WordPress • HubSpot • Meta Business Suite • MS Office</p>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section container" style={{ paddingTop: 0 }}>
          <div className="contact-card">
            <div>
              <span className="eyebrow-pill">LET&apos;S WORK TOGETHER</span>
              <h2>Need more traffic? Let&apos;s grow it.</h2>
              <p className="contact-copy">
                Hiring for a <strong>Digital Marketing & SEO Analyst</strong> role, or need a freelancer for
                SEO / Meta Ads? Send me your website or ad account — I&apos;ll reply within 24 hours with
                honest first impressions, free. Based in {contact.location}, working worldwide.
              </p>
            </div>
            <div className="contact-actions">
              <a className="contact-btn primary" href={`mailto:${contact.email}`}>
                <Mail size={20} />
                <span> {contact.email}<small>Email me — fastest reply</small></span>
              </a>
              <a className="contact-btn" href="tel:+918778000970">
                <Phone size={20} />
                <span> {contact.phone}<small>Mon–Sat, 9am–7pm IST</small></span>
              </a>
              <a className="contact-btn" href={contact.linkedin} target="_blank" rel="noreferrer">
                <ExternalLink size={20} />
                <span> linkedin.com/in/hillar-naseeb<small>Connect professionally</small></span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <div className="footer-brand"><span className="brand-mark">HN</span> HILLAR NASEEB N</div>
              <span className="footer-role">Digital Marketing & SEO Analyst — {contact.location}. SEO • Meta Ads • Lead Generation • GA4.</span>
            </div>
            <div className="footer-links">
              {socialLinks.map(({ label, url }) => (
                <a key={label} href={url} target="_blank" rel="noreferrer">{label}</a>
              ))}
            </div>
          </div>
          <div className="copyright">
            <span className="copyright-dot" />
            <span>© 2026 {contact.name} — Built for growth.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
