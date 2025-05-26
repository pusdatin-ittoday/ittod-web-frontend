import React, { Component } from 'react';
import { isAuthenticated, logoutUser } from '../api/user';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      scroll: false,
      isHomePage: true,
      dropdownOpen: false,
      isLoggedIn: false,
      loading: true, // Add loading state
    };
  }

  async componentDidMount() {
    window.addEventListener('auth-changed', this.updateAuthStatus);
    window.addEventListener('focus', this.updateAuthStatus);
    await this.updateAuthStatus();
  }

  componentWillUnmount() {
    window.removeEventListener('auth-changed', this.updateAuthStatus);
    window.removeEventListener('focus', this.updateAuthStatus);
  }

  updateAuthStatus = async () => {
    const isLoggedIn = await isAuthenticated();
    this.setState({ isLoggedIn, loading: false }); // Set loading to false after check
  }

  renderMobileMenu = () => {
    const { isLoggedIn } = this.state;
    const navLinkBase = "hover:text-pink-400 transition-all duration-300";
    if (isLoggedIn) {
      return (
        <>
          <li className="block lg:hidden">
            <a href="/dashboard/beranda" className={navLinkBase}>Dashboard</a>
          </li>
          <li className="block lg:hidden">
            <span onClick={this.handleLogout} className={`${navLinkBase} cursor-pointer`}>Logout</span>
          </li>
        </>
      );
    } else {
      return (
        <li className="block lg:hidden mt-2">
          <button
            onClick={this.navigateToLogin}
            className="w-full text-center font-dm-sans font-bold custom-button-bg text-white py-2 px-7 rounded-lg shadow-md button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
          >
            Login
          </button>
        </li>
      );
    }
  }

  handleLogout = async () => {
    await logoutUser();
    window.location.replace('/login'); // Use replace to avoid back navigation
  };

  handleClick = () => {
    this.setState((prevState) => ({ active: !prevState.active }));
  };

  handleScroll = () => {
    const isScrolled = window.scrollY > 10;
    if (isScrolled !== this.state.scroll) {
      this.setState({
        scroll: isScrolled,
        active: isScrolled ? false : this.state.active,
      });
    }
    this.checkIfHomePage();
  };

  handleResize = () => {
    if (window.innerWidth >= 768) {
      this.setState({ active: false });
    }
  };

  handleSectionLinkClick = (e, targetId) => {
    e.preventDefault();
    this.setState({ active: false });
    const targetElement = document.getElementById(targetId);
    if (this.state.isHomePage && targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Do NOT update window.location.hash
    } else {
      sessionStorage.setItem('scrollToSectionId', targetId);
      window.location.href = '/';
      // Do NOT add #${targetId} to the URL
    }
  };

  checkIfHomePage = () => {
    const isHome = window.location.pathname === '/' || window.location.pathname === '';
    if (isHome !== this.state.isHomePage) {
      this.setState({ isHomePage: isHome });
    }
  };

  navigateToHome = () => {
    window.location.href = '/';
  };

  navigateToLogin = () => {
    window.location.href = '/login';
  };

  toggleDropdown = () => {
    this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }));
  };

  render() {
    const { active, scroll, dropdownOpen, isLoggedIn, loading } = this.state;
    const scrollActive = scroll ? 'backdrop-blur-md py-3 bg-black/20 shadow-md' : 'bg-transparent py-2';
    const navLinkBase = 'font-dm-sans font-medium opacity-100 text-white nav-text-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer';

    // Prevent UI flicker: don't render login/logout until loading is false
    if (loading) return null;

    return (
      <div className={`navbar fixed w-full transition-all duration-300 z-[999] ${scrollActive}`}>
        <div className="w-full px-4 md:px-6 lg:container lg:mx-auto">
          <div className="navbar-box relative flex items-center justify-between font-dm-sans">
            <div className="logo flex items-center">
              <img
                src="/LOGO_ITTODAY_2025.webp"
                alt="IT Today Logo"
                className="w-[80px] h-auto lg:w-[100px] cursor-pointer"
                onClick={this.navigateToHome}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/150x50/cccccc/ffffff?text=Logo';
                }}
              />
            </div>

            {/* Menu List */}
            <ul
              className={`flex lg:gap-12 flex-col gap-3 absolute top-full right-0 mt-1 z-[9999] w-48 px-4 py-4 rounded-lg shadow-lg bg-[#6a316c] font-bold text-white text-[17px] transition-all duration-300 ease-in-out
              ${active ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
              lg:opacity-100 lg:visible lg:pointer-events-auto lg:static lg:flex-row lg:gap-12 lg:shadow-none lg:bg-transparent lg:w-auto lg:h-full lg:p-0 lg:text-white lg:transition-none lg:items-center lg:mt-0 lg:translate-y-0`}
            >
              <li>
                <a
                  href="/#"
                  onClick={(e) => this.handleSectionLinkClick(e, 'hero')}
                  className={navLinkBase}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/#event"
                  onClick={(e) => this.handleSectionLinkClick(e, 'event')}
                  className={navLinkBase}
                >
                  Event
                </a>
              </li>
              <li>
                <a
                  href="/#competition"
                  onClick={(e) => this.handleSectionLinkClick(e, 'competition')}
                  className={navLinkBase}
                >
                  Competition
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => this.handleSectionLinkClick(e, 'contact')}
                  className={navLinkBase}
                >
                  Contact Us
                </a>
              </li>

              {/* Menu Login/Profile untuk mobile */}
              {this.renderMobileMenu()}
            </ul>

            {/* Dropdown Profil untuk Desktop */}
            <div className="hidden lg:block relative ">
              {isLoggedIn ? (   
                <div className="relative ">
                  <button
                    onClick={this.toggleDropdown}
                    className="flex items-center gap-2 text-white focus:outline-none"
                  >
                    <img
                      src="/profile.svg"
                      alt="Profile"
                      className="w-8 h-8 input-rounded-full cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="font-dm-sans absolute right-0 mt-2 w-40 bg-[#302044] text-white rounded-lg shadow-lg py-2 z-50">
                      <a
                        href="/dashboard/beranda"
                        className="block px-4 py-2 font-dm-sans hover:text-pink-400 cursor-pointer transition duration-300 ease-in-out hover:scale-105"
                      >
                        Dashboard
                      </a>
                      <button
                        onClick={this.handleLogout}
                        className="block w-full text-left px-4 py-2 font-dm-sans hover:text-pink-400 transition duration-300 ease-in-out cursor-pointer hover:scale-105"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={this.navigateToLogin}
                  className="font-dm-sans font-bold custom-button-bg button-hover text-white py-2 px-7 rounded-lg shadow-md hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>

            {/* Tombol Toggle Menu untuk Mobile */}
            <button
              aria-label="Toggle Menu"
              className="w-[40px] h-[40px] lg:hidden block cursor-pointer text-white focus:outline-none"
              onClick={this.handleClick}
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
