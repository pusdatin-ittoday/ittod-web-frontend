import React, { Component } from 'react';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      scroll: false,
    };
  }

  handleClick = () => {
    this.setState((prevState) => ({ active: !prevState.active }));
  };

  handleScroll = () => {
    if (window.scrollY > 10) {
      this.setState({ scroll: true, active: false });
    } else {
      this.setState({ scroll: false });
    }
  };

  handleResize = () => {
    if (window.innerWidth >= 768) {
      this.setState({ active: false });
    }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { active, scroll } = this.state;
    const { isDashboard } = this.props;

    const scrollActive = scroll ? 'backdrop-blur-md py-3 bg-black/20 shadow-md' : 'bg-transparent py-2';

    const navLinkBase = 'font-dm-sans font-medium opacity-100 text-white nav-text-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer';

    return (
      <div className={`navbar fixed w-full transition-all z-[999] ${scrollActive}`}>
        <div className="container mx-auto px-4">
          <div className="navbar-box relative flex items-center justify-between font-dm-sans">
            <div className="logo">
              <h1 className="font-playfair sm:text-2xl text-xl font-bold cursor-pointer">IT-TODAY</h1>
            </div>
            <ul
              className={`flex lg:gap-12 flex-col gap-3 absolute top-full right-0 mt-1 z-[9999] w-36 px-4 py-4 rounded-lg shadow-lg bg-[#6a316c] font-bold text-white text-[17px] transition duration-300
              ${active ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}
              md:opacity-100 md:visible md:pointer-events-auto md:static md:flex-row md:gap-12 md:shadow-none md:bg-transparent md:w-auto md:h-full md:p-0 md:text-black md:transition-none md:items-center md:mt-0`}
            >
              <li className="flex items-center">
                <a
                  href="/#hero"
                  className={navLinkBase}
                >
                  Home
                </a>
              </li>
              <li className="flex items-center">
                <a
                  href="/#event"
                  className={navLinkBase}
                >
                  Event
                </a>
              </li>
              <li className="flex items-center">
                <a
                  href="/#competition"
                  className={navLinkBase}
                >
                  Competition
                </a>
              </li>
              <li className="flex items-center">
                <a
                  href="/#contact"
                  className={navLinkBase}
                >
                  Contact Us
                </a>
              </li>
              <li className="block lg:hidden">
                {isDashboard ? (
                  <button
                    onClick={this.handleClick}
                    className="font-dm-sans font-bold bg-gradient-to-r custom-button-bg text-white py-2 px-7 rounded-lg custom-button-shadow button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                  >
                    Logout
                  </button>
                ) : (
                  <a
                    href="/login"
                    className="font-dm-sans font-bold bg-gradient-to-r custom-button-bg text-white py-2 px-7 rounded-lg custom-button-shadow button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                  >
                    Login
                  </a>
                )}
              </li>
            </ul>
            <div className="login hidden lg:block">
              {isDashboard ? (
                <button
                  onClick={this.handleClick}
                  className="font-dm-sans font-bold bg-gradient-to-r custom-button-bg text-white py-2 px-7 rounded-lg custom-button-shadow button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <a
                  href="/login"
                  className="font-dm-sans font-bold bg-gradient-to-r custom-button-bg text-white py-2 px-7 rounded-lg custom-button-shadow button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                >
                  Login
                </a>
              )}
            </div>
            <img
              src="/menu.svg"
              alt="Menu"
              className="w-[40px] h-[40px] md:hidden block cursor-pointer bg-transparent"
              onClick={this.handleClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
