import { useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Asterisk, Check, ChevronDown,
  Code2, Layers3, Menu, MonitorSmartphone, MousePointer2, PenTool,
  Send, Sparkles, X, Zap
} from 'lucide-react';
import { resetFeedback, sendContact, updateDraft } from './features/contact/contactSlice.js';

const projects = [
  { number: '01', type: 'DIGITAL PRODUCT', title: 'Forma — пространство для идей', description: 'Айдентика и цифровая платформа для команды, которая меняет подход к совместной работе.', tags: ['Брендинг', 'UX/UI', 'Разработка'], art: 'forma' },
  { number: '02', type: 'E-COMMERCE', title: 'MONO — меньше, но лучше', description: 'Интернет-магазин предметного дизайна с фокусом на продукт и удобный пользовательский путь.', tags: ['Стратегия', 'UX/UI', 'E-commerce'], art: 'mono' },
  { number: '03', type: 'WEB EXPERIENCE', title: 'North — ближе к природе', description: 'Иммерсивный сайт туристического бренда с выразительной типографикой и динамикой.', tags: ['Концепция', 'Анимация', 'Web'], art: 'north' }
];

function Header({ onContact }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); setServicesOpen(false); }, [location]);

  const closeMenu = () => setMenuOpen(false);
  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="NEXUS — на главную"><span className="brand-mark"><Asterisk size={22} strokeWidth={2.5} /></span>NEXUS<span className="brand-dot">.</span></Link>
      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Главная навигация">
        <a href="#about" onClick={closeMenu}>Студия</a>
        <div className={`nav-dropdown ${servicesOpen ? 'expanded' : ''}`} onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
          <button className="nav-dropdown-trigger" onClick={() => setServicesOpen(v => !v)} aria-expanded={servicesOpen}>Услуги <ChevronDown size={14} /></button>
          <div className="dropdown-panel">
            <a href="#services" onClick={closeMenu}><span>01</span> Веб-разработка</a>
            <a href="#services" onClick={closeMenu}><span>02</span> UX/UI дизайн</a>
            <a href="#services" onClick={closeMenu}><span>03</span> Цифровая стратегия</a>
          </div>
        </div>
        <a href="#work" onClick={closeMenu}>Проекты</a>
        <a href="#process" onClick={closeMenu}>Процесс</a>
        <button className="nav-contact-mobile" onClick={() => { closeMenu(); onContact(); }}>Связаться с нами <ArrowUpRight size={16} /></button>
      </nav>
      <button className="header-cta" onClick={onContact}>Связаться с нами <ArrowUpRight size={16} /></button>
      <button className="menu-toggle" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X /> : <Menu />}</button>
    </header>
  );
}

function ContactFields({ compact = false }) {
  const dispatch = useDispatch();
  const { draft, status, error, success } = useSelector(state => state.contact);
  const change = (event) => dispatch(updateDraft({ [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    dispatch(sendContact(draft));
  };
  return (
    <form className={`contact-form ${compact ? 'compact' : ''}`} onSubmit={submit}>
      <div className="form-grid">
        <label>Ваше имя<input name="name" value={draft.name} onChange={change} placeholder="Как к вам обращаться?" required minLength="2" /></label>
        <label>Email<input name="email" type="email" value={draft.email} onChange={change} placeholder="name@example.com" required /></label>
        <label className="full-field">Что вас интересует?
          <select name="service" value={draft.service} onChange={change}>
            <option>Сайт под ключ</option><option>UX/UI дизайн</option><option>Разработка продукта</option><option>Консультация</option>
          </select>
        </label>
        <label className="full-field">Расскажите о задаче<textarea name="message" value={draft.message} onChange={change} placeholder="Пара слов о вашем проекте..." rows="3" required minLength="10" /></label>
      </div>
      {error && <p className="form-message error" role="alert">{error}</p>}
      {success && <p className="form-message success" role="status"><Check size={16} /> Сообщение отправлено. Скоро вернёмся с ответом.</p>}
      <div className="form-bottom"><p>Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p><button className="button button-primary submit-button" type="submit" disabled={status === 'loading'}>{status === 'loading' ? <><span className="spinner" /> Отправляем</> : <>Отправить запрос <Send size={16} /></>}</button></div>
    </form>
  );
}

function ContactModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const frameRef = useRef(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    setVisible(true);
    const node = dialogRef.current;
    if (!node) return undefined;
    node.style.setProperty('--modal-progress', '0');
    let start = null;
    const duration = 360;
    const animate = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.style.setProperty('--modal-progress', String(eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    document.body.classList.add('modal-open');
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-open');
    };
  }, [open, onClose]);

  const closeAnimated = () => {
    const node = dialogRef.current;
    if (!node) { onClose(); return; }
    cancelAnimationFrame(frameRef.current);
    let start = null;
    const duration = 220;
    const animate = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      node.style.setProperty('--modal-progress', String(1 - progress));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
      else { setVisible(false); onClose(); }
    };
    frameRef.current = requestAnimationFrame(animate);
  };

  if (!open && !visible) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeAnimated(); }}>
      <section className="contact-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" onClick={closeAnimated} aria-label="Закрыть"><X /></button>
        <div className="eyebrow"><span className="eyebrow-line" /> LET'S TALK</div>
        <h2 id="modal-title">Давайте создадим<br /><span>что-то значимое.</span></h2>
        <p className="modal-intro">Расскажите о своей идее — мы поможем превратить её в работающий цифровой продукт.</p>
        <ContactFields compact />
      </section>
    </div>
  );
}

function Hero({ onContact }) {
  return (
    <section className="hero" id="top">
      <video className="hero-video" autoPlay muted loop playsInline poster={`${import.meta.env.BASE_URL}media/hero-poster.jpg`} aria-hidden="true">
        <source src={`${import.meta.env.BASE_URL}media/hero.mp4`} type="video/mp4" />
      </video>
      <div className="hero-shade" />
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow light"><span className="eyebrow-line" /> INDEPENDENT DIGITAL STUDIO · EST. 2024</div>
          <h1>Создаём<br /><span>цифровое</span><br />будущее<span className="accent-dot">.</span></h1>
          <p className="hero-description">Соединяем стратегию, дизайн и технологии, чтобы превращать сложные идеи в простые и сильные цифровые решения.</p>
          <div className="hero-actions"><a className="button button-primary" href="#work">Смотреть проекты <ArrowUpRight size={17} /></a><button className="button button-ghost" onClick={onContact}>Обсудить проект <ArrowRight size={17} /></button></div>
        </div>
        <div className="hero-side-note"><span className="side-note-line" /> DESIGN × TECHNOLOGY<br />BUILT FOR WHAT'S NEXT</div>
      </div>
      <div className="hero-bottom"><span>SCROLL TO EXPLORE <ArrowDown size={14} /></span><span>BERLIN · WORKING WORLDWIDE</span><span>01 — 04</span></div>
    </section>
  );
}

function SectionHeading({ index, label, title, accent }) {
  return <div className="section-heading"><div className="section-meta"><span>{index}</span><span>{label}</span></div><h2>{title} <span>{accent}</span></h2></div>;
}

function About() {
  return (
    <section className="section about-section" id="about">
      <div className="about-top"><SectionHeading index="01 / WHO WE ARE" label="О СТУДИИ" title="Дизайн с идеей." accent="Технологии с целью." /><p className="about-lead">NEXUS — независимая цифровая студия на стыке дизайна, технологий и бизнеса. Мы помогаем брендам находить свой голос и создавать продукты, которыми хочется пользоваться.</p></div>
      <div className="about-bottom"><div className="about-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-core"><Asterisk size={76} strokeWidth={1.1} /></div><span className="orbit-label label-top">IDEA</span><span className="orbit-label label-right">DESIGN</span><span className="orbit-label label-bottom">IMPACT</span></div><div className="about-stats"><div><strong>03<span>+</span></strong><p>направления экспертизы</p></div><div><strong>100<span>%</span></strong><p>вовлечённость в каждый проект</p></div><div><strong>∞</strong><p>возможностей для роста</p></div><a href="#process" className="text-link">Как мы работаем <ArrowUpRight size={17} /></a></div></div>
    </section>
  );
}

const services = [
  { n: '01', icon: <PenTool />, title: 'Цифровой дизайн', text: 'Создаём понятные интерфейсы и выразительные визуальные системы, которые усиливают бренд и помогают пользователю.' },
  { n: '02', icon: <Code2 />, title: 'Веб-разработка', text: 'Разрабатываем быстрые, адаптивные и масштабируемые сайты — от промо-страниц до сложных веб-продуктов.' },
  { n: '03', icon: <Layers3 />, title: 'Стратегия продукта', text: 'Исследуем аудиторию, находим точки роста и превращаем бизнес-задачи в последовательный план действий.' }
];

function Services() {
  return <section className="section services-section" id="services"><SectionHeading index="02 / WHAT WE DO" label="ЭКСПЕРТИЗА" title="От первой мысли" accent="до запуска." /><div className="services-grid">{services.map(item => <article className="service-card" key={item.n}><div className="service-card-top"><span>{item.n}</span><span className="service-icon">{item.icon}</span></div><h3>{item.title}</h3><p>{item.text}</p><a href="#contact" className="round-link" aria-label={`Обсудить: ${item.title}`}><ArrowUpRight size={19} /></a></article>)}</div></section>;
}

function Work() {
  const [active, setActive] = useState(0);
  const current = projects[active];
  const next = () => setActive(v => (v + 1) % projects.length);
  const previous = () => setActive(v => (v - 1 + projects.length) % projects.length);
  return <section className="section work-section" id="work"><div className="work-heading"><SectionHeading index="03 / SELECTED WORK" label="ИЗБРАННЫЕ ПРОЕКТЫ" title="Идеи, которые" accent="работают." /><div className="slider-controls"><button onClick={previous} aria-label="Предыдущий проект">←</button><span>0{active + 1} <i>/</i> 0{projects.length}</span><button onClick={next} aria-label="Следующий проект">→</button></div></div><div className="project-stage"><div className={`project-art ${current.art}`} key={current.art}><div className="art-orb" /><div className="art-lines" /><div className="art-wordmark">{current.art === 'forma' ? 'forma' : current.art === 'mono' ? 'm—o' : 'NORTH'}</div><span className="art-caption">{current.type}</span><span className="art-index">N°{current.number}</span><div className="art-decoration"><Asterisk size={100} strokeWidth={0.8} /></div></div><div className="project-info"><div className="project-type">{current.type} <span>— 2025</span></div><h3>{current.title}</h3><p>{current.description}</p><div className="project-tags">{current.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a className="text-link" href="#contact">Обсудить похожий проект <ArrowUpRight size={17} /></a></div></div><div className="slider-progress"><span style={{ width: `${((active + 1) / projects.length) * 100}%` }} /></div></section>;
}

const steps = [
  ['01', 'Погружение', 'Знакомимся с задачей, изучаем контекст и формулируем общую цель.'],
  ['02', 'Концепция', 'Определяем направление, создаём структуру и согласуем визуальную идею.'],
  ['03', 'Создание', 'Проектируем, разрабатываем и проверяем каждую деталь продукта.'],
  ['04', 'Запуск', 'Публикуем проект, анализируем результат и помогаем ему развиваться.']
];

function Process() {
  return <section className="section process-section" id="process"><SectionHeading index="04 / HOW WE WORK" label="ПРОЦЕСС" title="Чёткий путь." accent="Сильный результат." /><div className="process-list">{steps.map(([n, title, text]) => <article className="process-step" key={n}><span className="step-number">{n}</span><h3>{title}</h3><p>{text}</p><ArrowUpRight className="step-arrow" size={20} /></article>)}</div></section>;
}

function Contact() {
  return <section className="contact-section" id="contact"><div className="contact-bg-mark"><Asterisk /></div><div className="contact-inner"><div className="eyebrow light"><span className="eyebrow-line" /> HAVE A PROJECT IN MIND?</div><h2>Есть идея?<br /><span>Давайте обсудим.</span></h2><p>Хорошие проекты начинаются с разговора. Расскажите, что задумали, — мы на связи.</p><ContactFields /></div></section>;
}

function Footer() {
  return <footer className="footer"><Link to="/" className="brand"><span className="brand-mark"><Asterisk size={22} /></span>NEXUS<span className="brand-dot">.</span></Link><span>© 2026 NEXUS DIGITAL STUDIO</span><div><a href="#top">Наверх ↑</a><a href="mailto:hello@nexus.studio">hello@nexus.studio</a></div></footer>;
}

function Home({ onContact }) {
  return <><Hero onContact={onContact} /><About /><Services /><Work /><Process /><Contact /><Footer /></>;
}

function NotFound() {
  return <main className="not-found"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>Кажется, здесь<br /><span>пустое место.</span></h1><Link to="/" className="button button-primary">На главную <ArrowRight size={16} /></Link></main>;
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const openContact = () => {
    window.history.pushState({ contactModal: true }, '', `${window.location.pathname}#contact-modal`);
    setModalOpen(true);
  };
  const closeContact = () => {
    setModalOpen(false);
    if (window.location.hash === '#contact-modal') navigate(location.pathname, { replace: true });
  };

  useEffect(() => {
    const handlePopState = () => setModalOpen(window.location.hash === '#contact-modal');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (location.hash && location.hash !== '#contact-modal') {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }));
    }
  }, [location]);

  return <><Header onContact={openContact} /><Routes><Route path="/" element={<Home onContact={openContact} />} /><Route path="*" element={<NotFound />} /></Routes><ContactModal open={modalOpen} onClose={closeContact} /></>;
}