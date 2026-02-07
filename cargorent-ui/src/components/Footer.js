import React from 'react';
import { Car, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="w-full bg-slate-950 border-t border-white/10 py-12 text-slate-300">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 font-bold text-xl text-white">
                            <Car className="h-6 w-6 text-primary" />
                            <span>CarGoRent</span>
                        </div>
                        <p className="text-sm text-slate-400 max-w-xs">
                            Premium car rental service for your business and personal needs. Reliable, fast, and luxurious.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/companies" className="hover:text-primary transition-colors">Browse Companies</Link></li>
                            <li><Link to="/order" className="hover:text-primary transition-colors">Start Booking</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 text-center text-xs text-slate-500">
                    &copy; {new Date().getFullYear()} CarGoRent Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
