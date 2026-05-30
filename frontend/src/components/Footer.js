import React from 'react';
import { Link } from 'react-router-dom';
import { Dna } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-neutral-800" data-testid="footer">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center">
                <Dna className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                <span className="text-white">Drug</span>
                <span className="text-violet-400">KG Text</span>
                <span className="text-white"> AI</span>
              </span>
            </div>
            <p className="text-neutral-400 max-w-sm leading-relaxed">
              Advanced AI platform for transforming pharmaceutical knowledge graphs 
              into actionable clinical insights.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/demo" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Generate Text
                </Link>
              </li>
              <li>
                <a href="https://go.drugbank.com/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  DrugBank
                </a>
              </li>
              <li>
                <Link to="/login" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold text-white mb-4">About</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8">
          <p className="text-neutral-500 text-sm text-center">
            © {new Date().getFullYear()} DrugKG Text AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
