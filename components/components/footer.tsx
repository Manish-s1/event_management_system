import Link from "next/link"
import { Calendar, Mail, MapPin, Phone, Github, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold">Eventify</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Discover, book, and manage events easily. Your one-stop platform for conferences, concerts & workshops.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-300 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                <span>Pokhara, Nepal</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                <a href="mailto:support@info.com" className="hover:text-blue-400 transition-colors">
                  support@info.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                <a href="tel:+977-98XXXXXXXX" className="hover:text-blue-400 transition-colors">
                  +977-98XXXXXXXX
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-slate-800 pt-6 text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Eventify. All rights reserved. Built with ❤️ in Nepal
          </p>
        </div>
      </div>
    </footer>
  )
}
