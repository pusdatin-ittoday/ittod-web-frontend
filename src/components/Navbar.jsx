import React, { Component } from 'react';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      scroll: false,
      isHomePage: true
    };
  }

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
    } else {
      sessionStorage.setItem('scrollToSectionId', targetId);
      window.location.href = '/';
    }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('mousedown', this.handleClickOutside);
    window.addEventListener('popstate', this.checkIfHomePage);
    this.checkIfHomePage();
  }

  checkIfHomePage = () => {
    const isHome = window.location.pathname === "/" || window.location.pathname === "";
    if (isHome !== this.state.isHomePage) {
      this.setState({ isHomePage: isHome });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('mousedown', this.handleClickOutside);
    window.removeEventListener('popstate', this.checkIfHomePage);
  }

  navigateToHome = () => {
    window.location.href = '/';
  };

  handleLogout = () => {
    console.log("Logout clicked");
  }

  navigateToLogin = () => {
    window.location.href = '/login';
  }

  render() {
    const { active, scroll, isHomePage } = this.state;
    const { isDashboard } = this.props;

    const scrollActive = scroll ? 'backdrop-blur-md py-3 bg-black/20 shadow-md' : 'bg-transparent py-2';
    const navLinkBase = 'font-dm-sans font-medium opacity-100 text-white nav-text-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer';

    return (
      <div className={`navbar fixed w-full transition-all duration-300 z-[999] ${scrollActive}`}>
        <div className="container mx-auto px-4">
          <div className="navbar-box relative flex items-center justify-between font-dm-sans">
            <div className="logo">
              <img
                src="/LOGO_ITTODAY_2025.webp"
                alt="IT Today Logo"
                className="w-[130px] h-auto md:w-[150px] cursor-pointer"
                onClick={this.navigateToHome}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x50/cccccc/ffffff?text=Logo'; }}
              />
            </div>

            <ul
              className={`flex lg:gap-12 flex-col gap-3 absolute top-full right-0 mt-1 z-[9999] w-48 px-4 py-4 rounded-lg shadow-lg bg-[#6a316c] font-bold text-white text-[17px] transition-all duration-300 ease-in-out
              ${active ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'} pointer-events-none
              md:opacity-100 md:visible md:pointer-events-auto md:static md:flex-row md:gap-12 md:shadow-none md:bg-transparent md:w-auto md:h-full md:p-0 md:text-white md:transition-none md:items-center md:mt-0 md:translate-y-0`}
              style={active ? { pointerEvents: 'auto' } : {}}
            >
              <li className="flex items-center">
                <a
                  href="/#hero"
                  onClick={(e) => this.handleSectionLinkClick(e, 'hero')}
                  className={navLinkBase}
                >
                  Home
                </a>
              </li>

              <li className="flex items-center">
                <a
                  href="/#event"
                  onClick={(e) => this.handleSectionLinkClick(e, 'event')}
                  className={navLinkBase}
                >
                  Event
                </a>
              </li>

              <li className="flex items-center">
                <a
                  href="/#competition"
                  onClick={(e) => this.handleSectionLinkClick(e, 'competition')}
                  className={navLinkBase}
                >
                  Competition
                </a>
              </li>

              <li className="flex items-center">
                <a
                  href="#contact"
                  onClick={(e) => this.handleSectionLinkClick(e, 'contact')}
                  className={navLinkBase}
                >
                  Contact Us
                </a>
              </li>

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

            <div className="login hidden md:block">
              {isDashboard ? (
                <button
                  onClick={this.handleLogout}
                  className="font-dm-sans font-bold custom-button-bg button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={this.navigateToLogin}
                  className="font-dm-sans font-bold custom-button-bg button-hover text-white py-2 px-7 rounded-lg shadow-md hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>

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
