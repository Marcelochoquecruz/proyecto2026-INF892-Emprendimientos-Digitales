import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { Mail, Lock, LogIn, Eye, EyeOff, Shield } from 'lucide-react';
import logoMuseo from '../../assets/logo.png';
import { useTheme } from '../../components/useTheme';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const redirectTo = location.state?.from?.pathname || '/admin/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // Corrección aquí: Se tipa adecuadamente el error utilizando la interfaz AuthError de Firebase
      const firebaseError = err as AuthError;
      const code = firebaseError?.code;
      let message = 'Error al iniciar sesión.';

      if (code === 'auth/invalid-email') {
        message = 'El correo electrónico no tiene un formato válido.';
      } else if (code === 'auth/user-disabled') {
        message = 'La cuenta ha sido deshabilitada.';
      } else if (code === 'auth/user-not-found') {
        message = 'No existe un usuario con ese correo electrónico.';
      } else if (code === 'auth/wrong-password') {
        message = 'Contraseña incorrecta.';
      } else if (code === 'auth/invalid-credential') {
        message = 'Credenciales inválidas. Verifica tus datos.';
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center min-h-screen overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-[#0f0f1a]' : 'bg-[#ece9ff]'
      }`}
    >
      {/* ═══ FONDO ANIMADO — degradado índigo del sistema ═══ */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradiente base */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            isDark
              ? 'bg-gradient-to-r from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a]'
              : 'bg-gradient-to-r from-[#ece9ff] via-[#f8f7ff] to-[#ece9ff]'
          }`}
        />

        {/* Halo radial central, estándar del sistema */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse 60% 120% at 50% 0%, rgba(79,70,229,0.08) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 60% 120% at 50% 0%, rgba(129,140,248,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Orbes de luz animados */}
        <div
          className={`absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl animate-pulse transition-colors duration-500 ${
            isDark ? 'bg-[#4f46e5]/20' : 'bg-[#818cf8]/20'
          }`}
        />
        <div
          className={`absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl animate-pulse transition-colors duration-500 ${
            isDark ? 'bg-[#818cf8]/15' : 'bg-[#a5b4fc]/25'
          }`}
          style={{ animationDelay: '2s' }}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse transition-colors duration-500 ${
            isDark ? 'bg-[#4338ca]/10' : 'bg-[#c7d2fe]/30'
          }`}
          style={{ animationDelay: '4s' }}
        />

        {/* Patrón de puntos */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'opacity-[0.04]' : 'opacity-[0.07]'}`}
          style={{
            backgroundImage: `radial-gradient(circle, ${isDark ? '#818cf8' : '#4f46e5'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Líneas decorativas diagonales */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div
            className={`absolute top-20 left-10 w-32 h-px bg-gradient-to-r from-transparent to-transparent rotate-45 transition-colors duration-500 ${
              isDark ? 'via-[#818cf8]/30' : 'via-[#4f46e5]/30'
            }`}
          />
          <div
            className={`absolute bottom-20 right-10 w-40 h-px bg-gradient-to-r from-transparent to-transparent -rotate-45 transition-colors duration-500 ${
              isDark ? 'via-[#4f46e5]/40' : 'via-[#818cf8]/30'
            }`}
          />
        </div>
      </div>

      {/* ═══ TARJETA DE LOGIN ═══ */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Glow exterior de la tarjeta */}
        <div
          className="absolute -inset-1 bg-gradient-to-r from-[#a5b4fc] via-[#818cf8] to-[#4f46e5] rounded-2xl blur-lg opacity-20 animate-pulse transition-all duration-500"
        />

        {/* Tarjeta principal */}
        <div
          className={`relative backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 ${
            isDark
              ? 'bg-[#0f0f1a]/90 border-[#4f46e5]/35 shadow-[0_8px_48px_rgba(79,70,229,0.25)]'
              : 'bg-white/95 border-[#818cf8]/30 shadow-[0_8px_48px_rgba(79,70,229,0.15)]'
          }`}
        >
          {/* Línea superior decorativa con punto brillante */}
          <div className="relative h-[1.5px] bg-gradient-to-r from-transparent via-[#818cf8] to-transparent opacity-50">
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2
              w-1.5 h-1.5 rounded-full bg-[#a5b4fc]
              shadow-[0_0_6px_2px_rgba(165,180,252,0.5)]" />
          </div>

          {/* ═══ HEADER CON LOGO ═══ */}
          <div className="relative pt-8 pb-6 px-8 text-center">
            {/* Logo con efecto glow — anillo índigo del sistema */}
            <div className="relative inline-block mb-4">
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse bg-gradient-to-br from-[#a5b4fc] via-[#818cf8] to-[#4f46e5]"
              />
              <div
                className="relative w-20 h-20 rounded-full p-[2.5px]
                  bg-gradient-to-br from-[#a5b4fc] via-[#818cf8] to-[#4f46e5]
                  shadow-[0_0_16px_rgba(129,140,248,0.3)]
                  transition-shadow duration-500"
              >
                <div
                  className={`w-full h-full rounded-full p-1.5 flex items-center justify-center transition-colors duration-500 ${
                    isDark ? 'bg-[#0f0f1a]' : 'bg-white'
                  }`}
                >
                  <img
                    src={logoMuseo}
                    alt="Logo"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              {/* Badge de seguridad */}
              <div
                className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-[0_4px_14px_rgba(79,70,229,0.4)] transition-all duration-500 ${
                  isDark
                    ? 'bg-gradient-to-br from-[#4f46e5] to-[#4338ca] border-[#0f0f1a]'
                    : 'bg-gradient-to-br from-[#4f46e5] to-[#6366f1] border-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-white" strokeWidth={1.8} />
              </div>
            </div>

            <h2
              className={`text-2xl font-bold mb-1 tracking-wide transition-colors duration-500 ${
                isDark ? 'text-[#e0e7ff]' : 'text-[#1e1b4b]'
              }`}
              style={{ fontFamily: 'Cinzel, Georgia, serif' }}
            >
              Panel Administrativo
            </h2>
            <p
              className={`text-xs uppercase tracking-[0.3em] font-medium transition-colors duration-500 ${
                isDark ? 'text-[#a5b4fc]/90' : 'text-[#4f46e5]'
              }`}
            >
              Casa Museo Potosí Mineral
            </p>
          </div>

          {/* Separador decorativo */}
          <div className="relative mx-8 h-px bg-gradient-to-r from-transparent via-[#4f46e5]/25 to-transparent" />

          {/* ═══ FORMULARIO ═══ */}
          <form onSubmit={handleSubmit} className="relative p-8 space-y-5">

            {/* Mensaje de error */}
            {error && (
              <div className="relative overflow-hidden rounded-lg border border-red-500/30 bg-red-500/10 backdrop-blur-sm p-3 animate-shake">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                <p className="text-sm text-red-500 dark:text-red-400 text-center font-medium">{error}</p>
              </div>
            )}

            {/* Campo Email */}
            <div className="group relative">
              <label
                htmlFor="email"
                className={`block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 transition-colors duration-500 ${isDark ? 'text-[#a5b4fc]' : 'text-[#4f46e5]'}`}
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-[#818cf8]/60 group-focus-within:text-[#a5b4fc]' : 'text-[#818cf8]/70 group-focus-within:text-[#4f46e5]'}`}>
                  <Mail className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@museopotosi.com"
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm transition-all duration-300 focus:outline-none ${
                    isDark
                      ? 'bg-[#1a1a2e]/80 border-[#4f46e5]/40 text-[#e0e7ff] placeholder:text-[#4f46e5]/70 focus:border-[#818cf8] focus:bg-[#0f0f1a] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.2)]'
                      : 'bg-[#ece9ff]/70 border-[#818cf8]/30 text-[#1e1b4b] placeholder:text-[#818cf8]/60 focus:border-[#818cf8] focus:bg-white focus:shadow-[0_0_0_3px_rgba(129,140,248,0.15)]'
                  }`}
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="group relative">
              <label
                htmlFor="password"
                className={`block text-[10px] uppercase tracking-[0.2em] font-bold mb-2 transition-colors duration-500 ${isDark ? 'text-[#a5b4fc]' : 'text-[#4f46e5]'}`}
              >
                Contraseña
              </label>
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-[#818cf8]/60 group-focus-within:text-[#a5b4fc]' : 'text-[#818cf8]/70 group-focus-within:text-[#4f46e5]'}`}>
                  <Lock className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 border rounded-lg text-sm transition-all duration-300 focus:outline-none ${
                    isDark
                      ? 'bg-[#1a1a2e]/80 border-[#4f46e5]/40 text-[#e0e7ff] placeholder:text-[#4f46e5]/70 focus:border-[#818cf8] focus:bg-[#0f0f1a] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.2)]'
                      : 'bg-[#ece9ff]/70 border-[#818cf8]/30 text-[#1e1b4b] placeholder:text-[#818cf8]/60 focus:border-[#818cf8] focus:bg-white focus:shadow-[0_0_0_3px_rgba(129,140,248,0.15)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50 rounded ${
                    isDark ? 'text-[#818cf8]/60 hover:text-[#a5b4fc]' : 'text-[#818cf8]/70 hover:text-[#4f46e5]'
                  }`}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full mt-6 py-3.5 rounded-lg font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-[#818cf8]/50"
              style={{
                boxShadow: isDark
                  ? '0 4px 14px rgba(79,70,229,0.35)'
                  : '0 4px 14px rgba(79,70,229,0.25)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4f46e5] to-[#6366f1] group-hover:from-[#4338ca] group-hover:to-[#4f46e5] transition-all duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              <div className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.8} />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer de la tarjeta */}
          <div className="relative px-8 pb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#4f46e5]/35" />
              <Shield className={`w-3 h-3 transition-colors duration-500 ${isDark ? 'text-[#818cf8]/60' : 'text-[#818cf8]/70'}`} />
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#4f46e5]/35" />
            </div>
            <p
              className={`text-[10px] uppercase tracking-[0.25em] font-medium transition-colors duration-500 ${
                isDark ? 'text-[#94a3b8]' : 'text-[#3730a3]'
              }`}
            >
              Acceso Restringido · Solo Administradores
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
};

export default Login;
