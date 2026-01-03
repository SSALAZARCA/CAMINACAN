import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Dog, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Notifications from './Notifications';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  const changeLanguage = () => {
    i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
          }`}
      >
        <div className="container flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group min-w-fit">
            <div className={`p-2 rounded-full text-white shadow-glow transition-transform group-hover:scale-110 ${isScrolled ? 'bg-primary scale-90' : 'bg-primary'}`} style={{ backgroundColor: 'var(--color-primary)' }}>
              <Dog size={isScrolled ? 20 : 24} color="#333" />
            </div>
            <span className={`font-bold text-xl tracking-tight transition-colors ${isScrolled ? 'text-gray-800' : 'text-gray-900'}`}>CaminaCan</span>
          </Link>

          {/* Desktop Menu - Main Links */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-2">
            {[
              { to: '/', label: t('home') },
              { to: '/paseadores', label: t('find_walker') },
              { to: '/planes', label: t('plans') },
              { to: '/tienda', label: t('store') }
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 font-medium text-sm text-gray-600 hover:text-primary hover:bg-yellow-50 rounded-full transition-all"
              >
                {link.label}
              </Link>
            ))}

            <Link to="/live-demo" className="ml-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold flex items-center gap-2 border border-red-100 hover:bg-red-100 transition-colors animate-pulse hover:animate-none">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Live Demo
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/registro-paseador" className="text-sm font-medium text-gray-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
              {t('work_with_us')}
            </Link>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200"></div>

            <div className="flex items-center gap-3">
              <button
                onClick={changeLanguage}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs transition-colors"
                title="Cambiar idioma"
              >
                {i18n.language.toUpperCase()}
              </button>

              <Notifications />

              <Link to="/login" className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <User size={16} />
                <span>{t('my_account')}</span>
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 bg-white z-40 p-6 flex flex-col gap-6 md:hidden"
          >
            <Link to="/" className="text-xl font-medium border-b pb-2">Inicio</Link>
            <Link to="/paseadores" className="text-xl font-medium border-b pb-2">Encontrar Paseador</Link>
            <Link to="/planes" className="text-xl font-medium border-b pb-2">Planes y Precios</Link>
            <Link to="/planes" className="text-xl font-medium border-b pb-2">Planes y Precios</Link>
            <Link to="/tienda" className="text-xl font-medium border-b pb-2">Tienda</Link>
            <Link to="/registro-paseador" className="text-xl font-medium border-b pb-2 text-gray-500">Trabaja con nosotros</Link>
            <Link to="/login" className="btn btn-primary justify-center mt-4">
              Iniciar Sesión
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Dog size={24} color="var(--color-primary)" />
              <span className="font-bold text-xl">CaminaCan</span>
            </div>
            <p className="text-gray-400 text-sm">
              Conectando a las mejores mascotas con los paseadores más confiables de Colombia.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Paseos Grupales</li>
              <li>Paseos Individuales</li>
              <li>Guardería</li>
              <li>Entrenamiento</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Empresa</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Sobre Nosotros</li>
              <li>Trabaja con Nosotros</li>
              <li>Términos y Condiciones</li>
              <li>Política de Privacidad</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Síguenos</h4>
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              <div className="w-8 h-8 bg-gray-700 rounded-full hover:bg-primary cursor-pointer transition-colors"></div>
              <div className="w-8 h-8 bg-gray-700 rounded-full hover:bg-primary cursor-pointer transition-colors"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
