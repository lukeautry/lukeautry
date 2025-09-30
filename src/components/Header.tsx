import React from 'react';

interface HeaderProps {
  currentPath?: string;
}

const navItems = [
    { href: '/about', label: 'About' },
    { href: '/work', label: 'Work' },
    { href: '/writing', label: 'Writing' },
  ];

const Header: React.FC<HeaderProps> = ({ currentPath = '/' }) => {
  return (
    <header className="w-full py-6 px-6 lg:px-12">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <a
          href="/"
          className="text-xl text-white hover:text-primary-500 transition-colors"
        >
          LUKE AUTRY
        </a>

        <div className="flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                currentPath === item.href
                  ? 'text-primary-500'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}

          <div className="flex items-center space-x-4 ml-4">
            <a
              href="https://www.linkedin.com/in/luke-autry-8b140b96/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-primary-500 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>

            <a
              href="mailto:lukeautry@gmail.com"
              className="text-gray-300 hover:text-primary-500 transition-colors"
              aria-label="Email"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.717L12 10.09l9.647-6.269h.717c.904 0 1.636.732 1.636 1.636z"/>
              </svg>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;