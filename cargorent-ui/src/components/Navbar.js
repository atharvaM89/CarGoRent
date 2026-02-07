import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";
import { Car, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";

function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth() || {};
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.companies"), path: "/companies" },
    { name: t("nav.myOrders"), path: "/orders" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-md text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <Car className="h-6 w-6 text-primary" />
            <span className="tracking-tight">CarGoRent</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={cn("text-sm font-medium transition-colors hover:text-primary", isActive("/") ? "text-primary" : "text-slate-300")}
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/companies"
              className={cn("text-sm font-medium transition-colors hover:text-primary", isActive("/companies") ? "text-primary" : "text-slate-300")}
            >
              {t("nav.companies")}
            </Link>
            {user?.role === 'CUSTOMER' && (
              <>
                <Link
                  to="/orders"
                  className={cn("text-sm font-medium transition-colors hover:text-primary", isActive("/orders") ? "text-primary" : "text-slate-300")}
                >
                  {t("nav.myOrders")}
                </Link>
                <Link to="/cart" className="text-sm font-medium transition-colors hover:text-primary text-slate-300 flex items-center gap-1">
                  {t("nav.cart")}
                </Link>
              </>
            )}
            {user?.role === 'COMPANY' && (
              <Link
                to="/company-dashboard"
                className={cn("text-sm font-medium transition-colors hover:text-primary", isActive("/company-dashboard") ? "text-primary" : "text-slate-300")}
              >
                {t("nav.companyDashboard")}
              </Link>
            )}
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin-dashboard"
                className={cn("text-sm font-medium transition-colors hover:text-primary", isActive("/admin-dashboard") ? "text-primary" : "text-slate-300")}
              >
                {t("nav.adminDashboard")}
              </Link>
            )}
            {user?.role === 'MEMBER' && (
              <Link
                to="/member-dashboard"
                className={cn("text-sm font-medium transition-colors hover:text-primary", isActive("/member-dashboard") ? "text-primary" : "text-slate-300")}
              >
                {t("nav.memberDashboard")}
              </Link>
            )}
          </div>

          {/* Auth + Language */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center gap-1 border border-slate-600 rounded-md p-0.5">
              <button
                type="button"
                onClick={() => i18n.changeLanguage("en")}
                className={cn("px-2 py-1 text-xs font-medium rounded", i18n.language === "en" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white")}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => i18n.changeLanguage("hi")}
                className={cn("px-2 py-1 text-xs font-medium rounded", i18n.language === "hi" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white")}
              >
                हि
              </button>
            </div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4" /> {user.email || "User"}
                </span>
                <Button variant="outline" size="sm" onClick={logout} className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white">
                  {t("nav.logout")}
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">{t("nav.register")}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-900 p-4 space-y-4 animate-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-sm font-medium text-slate-300 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <div className="flex gap-2">
              <button type="button" onClick={() => i18n.changeLanguage("en")} className={cn("px-3 py-1.5 text-sm rounded border", i18n.language === "en" ? "border-primary text-primary" : "border-slate-600 text-slate-400")}>EN</button>
              <button type="button" onClick={() => i18n.changeLanguage("hi")} className={cn("px-3 py-1.5 text-sm rounded border", i18n.language === "hi" ? "border-primary text-primary" : "border-slate-600 text-slate-400")}>हि</button>
            </div>
            {user ? (
              <Button onClick={logout} variant="outline" className="w-full justify-start border-slate-600">
                {t("nav.logout")}
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-slate-300">{t("nav.login")}</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">{t("nav.register")}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
