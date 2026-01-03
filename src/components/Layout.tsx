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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-white py-4 shadow-sm'
          }`}
      >
        <div className="container flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group min-w-fit">
            <div className={`p-2 rounded-full text-white shadow-glow transition-transform group-hover:scale-110 ${isScrolled ? 'bg-primary scale-90' : 'bg-primary'}`} style={{ backgroundColor: 'var(--color-primary)' }}>
              <Dog size={isScrolled ? 20 : 24} color="#333" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-800">CaminaCan</span>
          </Link>

          {/* Desktop Menu - Main Links */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-8">
            <Link to="/" className="font-medium text-sm lg:text-base text-gray-600 hover:text-primary transition-colors">{t('home')}</Link>
            <Link to="/paseadores" className="font-medium text-sm lg:text-base text-gray-600 hover:text-primary transition-colors">{t('find_walker')}</Link>
            <Link to="/live-demo" className="font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 bg-red-50 px-2 lg:px-3 py-1 rounded-full whitespace-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs lg:text-sm font-bold">Live Demo</span>
            </Link>
            <Link to="/planes" className="font-medium text-sm lg:text-base text-gray-600 hover:text-primary transition-colors">{t('plans')}</Link>
            <Link to="/tienda" className="font-medium text-sm lg:text-base text-gray-600 hover:text-primary transition-colors">{t('store')}</Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4 text-sm font-medium text-gray-500 border-r border-gray-200 pr-4 mr-2">
              <Link to="/registro-paseador" className="hover:text-gray-900 transition-colors whitespace-nowrap">
                {t('work_with_us')}
              </Link>
              <Link to="/mensajes" className="hover:text-primary transition-colors">Mensajes</Link>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={changeLanguage} className="bg-gray-100 px-2 py-1 rounded text-xs font-bold uppercase hover:bg-gray-200 text-gray-600">
                {i18n.language}
              </button>
              <Notifications />
              <Link to="/login" className="btn btn-primary text-sm px-5 py-2.5 shadow-md">
                <User size={18} />
                <span>{t('my_account')}</span>
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-gray-800"
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
