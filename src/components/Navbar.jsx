import React, { Component } from 'react';
// Import hooks/router components would be needed for SPA navigation (React Router)

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false, // Mobile menu toggle
      scroll: false, // Navbar background change on scroll
      isHomePage: true // Track if we're on homepage (used for link behavior)
      // Removed eventDropdown and competitionDropdown states
    };

    // Removed refs for dropdowns as they are no longer needed
  }

  // Toggle mobile menu visibility
  handleClick = () => {
    this.setState((prevState) => ({ active: !prevState.active }));
  };

  // Handle page scroll events
  handleScroll = () => {
    const isScrolled = window.scrollY > 10;
    if (isScrolled !== this.state.scroll) {
      this.setState({
        scroll: isScrolled,
        // Close mobile menu when scrolling starts significantly
        active: isScrolled ? false : this.state.active,
        // Dropdown states removed, no need to close them here
      });
    }
    this.checkIfHomePage(); // Check homepage status on scroll
  };

  // Handle window resize events
  handleResize = () => {
    if (window.innerWidth >= 768) {
      this.setState({ active: false }); // Close mobile menu on larger screens
    }
  };


  // Handle clicks on navigation links (especially those pointing to sections)
  handleSectionLinkClick = (e, targetId) => {
    e.preventDefault(); // Prevent default link behavior

    // Close mobile menu if open
    this.setState({ active: false });

    const targetElement = document.getElementById(targetId);

    if (this.state.isHomePage && targetElement) {
        // Jika SUDAH di homepage dan elemen ada, scroll halus
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // Jika TIDAK di homepage (atau elemen tidak ditemukan di homepage)
        // 1. Simpan target ID ke sessionStorage
        sessionStorage.setItem('scrollToSectionId', targetId);

        // 2. Navigasi ke halaman utama (root path)
        //    Kita tidak perlu menyertakan hash di sini karena Halaman Utama
        //    akan membaca sessionStorage dan melakukan scroll manual.
        window.location.href = '/';
    }
  };

  // Add event listeners when the component mounts
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('mousedown', this.handleClickOutside);
    window.addEventListener('popstate', this.checkIfHomePage); // Handle browser back/forward
    this.checkIfHomePage(); // Initial check
  }

  // Determine if the current page is the homepage
  // (Pastikan checkIfHomePage sudah benar mendeteksi halaman utama)
  checkIfHomePage = () => {
    // Cek hanya berdasarkan path, tanpa hash
    const isHome = window.location.pathname === "/" || window.location.pathname === "";
    if (isHome !== this.state.isHomePage) {
      this.setState({ isHomePage: isHome });
    }
  }

  // Remove event listeners when the component unmounts
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('mousedown', this.handleClickOutside);
    window.removeEventListener('popstate', this.checkIfHomePage);
  }

  // Navigate to the landing page (root path)
  navigateToHome = () => {
    window.location.href = '/';
  };

  // Handle logout (placeholder function)
  handleLogout = () => {
    console.log("Logout clicked");
    // window.location.href = '/login'; // Example redirect
  }

  // Handle login navigation
  navigateToLogin = () => {
    window.location.href = '/login';
  }

  render() {
    // Destructure state and props
    const { active, scroll, isHomePage } = this.state;
    const { isDashboard } = this.props; // Assumed prop for login status

    // Dynamic navbar styles
    const scrollActive = scroll ? 'backdrop-blur-md py-3 bg-black/20 shadow-md' : 'bg-transparent py-2';
    const navLinkBase = 'font-dm-sans font-medium opacity-100 text-white nav-text-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer';

    // --- REMOVED dropdownMenuClass and dropdownItemClass ---

    return (
      <div className={`navbar fixed w-full transition-all duration-300 z-[999] ${scrollActive}`}>
        <div className="container mx-auto px-4">
          <div className="navbar-box relative flex items-center justify-between font-dm-sans">
            {/* Logo */}
            <div className="logo">
              <img
                src="/LOGO_ITTODAY_2025.webp"
                alt="IT Today Logo"
                className="w-[130px] h-auto md:w-[150px] cursor-pointer"
                onClick={this.navigateToHome}
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/150x50/cccccc/ffffff?text=Logo'; }}
              />
            </div>

            {/* Navigation Links */}
            <ul
              className={`flex lg:gap-12 flex-col gap-3 absolute top-full right-0 mt-1 z-[9999] w-48 px-4 py-4 rounded-lg shadow-lg bg-[#6a316c] font-bold text-white text-[17px] transition-all duration-300 ease-in-out
              ${active ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'} pointer-events-none
              md:opacity-100 md:visible md:pointer-events-auto md:static md:flex-row md:gap-12 md:shadow-none md:bg-transparent md:w-auto md:h-full md:p-0 md:text-white md:transition-none md:items-center md:mt-0 md:translate-y-0`}
              style={active ? { pointerEvents: 'auto' } : {}}
            >
              {/* Home Link */}
              <li className="flex items-center">
                <a
                  href="/#hero" // Always link to homepage hero section
                  onClick={(e) => {
                    // If already on homepage, handleSectionLinkClick scrolls smoothly
                    // If not on homepage, handleSectionLinkClick navigates to /#hero
                    this.handleSectionLinkClick(e, 'hero');
                  }}
                  className={navLinkBase}
                >
                  Home
                </a>
              </li>

              {/* Event Link (No Dropdown) */}
              {/* --- MODIFIED: Removed conditional rendering and dropdown --- */}
              <li className="flex items-center">
                 <a
                    href="/#event" // Link to navigate to the event section on the homepage
                    onClick={(e) => this.handleSectionLinkClick(e, 'event')} // Use handler for scroll/navigation
                    className={navLinkBase}
                  >
                    Event
                    {/* Removed dropdown arrow SVG */}
                  </a>
                  {/* Removed dropdown menu div */}
              </li>

              {/* Competition Link (No Dropdown) */}
              {/* --- MODIFIED: Removed conditional rendering and dropdown --- */}
              <li className="flex items-center">
                 <a
                    href="/#competition" // Link to navigate to the competition section on the homepage
                    onClick={(e) => this.handleSectionLinkClick(e, 'competition')} // Use handler for scroll/navigation
                    className={navLinkBase}
                  >
                    Competition
                    {/* Removed dropdown arrow SVG */}
                  </a>
                  {/* Removed dropdown menu div */}
              </li>

              {/* Contact Us Link */}
              <li className="flex items-center">
                <a
                  href="#contact"
                  onClick={(e) => this.handleSectionLinkClick(e, 'contact')} // Use handler for scroll/navigation
                  className={navLinkBase}
                >
                  Contact Us
                </a>
              </li>

              {/* Login/Logout Button (Mobile) */}
              <li className="block md:hidden mt-2">
                {isDashboard ? (
                  <button
                    onClick={this.handleLogout}
                    className="w-full text-center font-dm-sans font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-7 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={this.navigateToLogin}
                    className="w-full text-center font-dm-sans font-bold custom-button-bg text-white py-2 px-7 rounded-lg shadow-md button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                  >
                    Login
                  </button>
                )}
              </li>
            </ul>

            {/* Login/Logout Button (Desktop) */}
            <div className="login hidden md:block">
              {isDashboard ? (
                <button
                  onClick={this.handleLogout}
                  className="font-dm-sans font-bold custom-button-bg button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer" // Assuming custom-button-bg provides styles
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={this.navigateToLogin}
                  className="font-dm-sans font-bold custom-button-bg button-hover text-white py-2 px-7 rounded-lg shadow-md hover:scale-105 transition duration-300 ease-in-out cursor-pointer" // Assuming custom-button-bg provides styles
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              aria-label="Toggle Menu"
              className="w-[40px] h-[40px] md:hidden block cursor-pointer text-white focus:outline-none"
              onClick={this.handleClick}
            >
              <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
            </button>

          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;