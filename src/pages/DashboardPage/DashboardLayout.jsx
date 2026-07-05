// DashboardLayout.js

import React, { Component } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Dashboard/Sidebar";
import Beranda from "../../components/Dashboard/Beranda/Beranda";
import IkutLomba from "../../components/Dashboard/IkutLomba/IkutLomba";
import IkutEvent from "../../components/Dashboard/IkutEvent/IkutEvent";
import SubmitLomba from "../../components/Dashboard/SubmitLomba/SubmitLomba";
import Pengumuman from "../../components/Dashboard/Pengumuman/Pengumuman";
import DashboardNeoHeader from "../../components/Dashboard/DashboardNeoHeader";
import Footer from "../../components/Footer";


class DashboardLayout extends Component {
  constructor(props) {
    super(props);
    const validTabs = ["beranda", "ikut-lomba", "ikut-event", "submit-lomba", "submit-gametoday", "submit-uxtoday", "submit-minetoday", "pengumuman"];
    const initialTab = validTabs.includes(props.activeTab) ? props.activeTab : "beranda";

    this.state = {
      active: initialTab,
    };
  }

  componentDidMount() {
    sessionStorage.setItem("activeTab", this.state.active);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleTouchEnd);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.activeTab !== this.props.activeTab) {
      this.setState({ active: this.props.activeTab });
    }
    if (prevState.active !== this.state.active) {
      sessionStorage.setItem("activeTab", this.state.active);
    }
  }

  setActive = (tab) => {
    this.setState({ active: tab });
  };

  renderContent = () => {
    switch (this.state.active) {
      case "ikut-lomba":
        return <IkutLomba />;
      case "ikut-event":
        return <IkutEvent />;
      case "submit-lomba":
        return <SubmitLomba />;
      case "pengumuman":
        return <Pengumuman />;
      default:
        return <Beranda />;
    }
  };

  render() {
    const usesNeobrutalDashboard = ["ikut-event", "ikut-lomba", "beranda", "pengumuman", "submit-lomba"].includes(
      this.state.active
    );

    if (usesNeobrutalDashboard) {
      return (
        <div className="min-h-screen bg-[#f4f4f2] font-dm-sans text-[#191b1a]">
          <DashboardNeoHeader />

          <div className="mx-auto flex w-full max-w-[1600px] flex-col lg:min-h-[760px] lg:flex-row">
            <aside className="shrink-0 border-b-4 border-black bg-white lg:w-[310px] lg:border-b-0 lg:border-r-4">
              <Sidebar
                active={this.state.active}
                setActive={this.setActive}
                variant="neobrutal"
              />
            </aside>

            <main className="min-w-0 flex-1 px-3 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
              {this.state.active === "ikut-event" ? (
                <IkutEvent variant="neobrutal" />
              ) : this.state.active === "ikut-lomba" ? (
                <IkutLomba variant="neobrutal" />
              ) : this.state.active === "pengumuman" ? (
                <Pengumuman variant="neobrutal" />
              ) : this.state.active === "submit-lomba" ? (
                <SubmitLomba variant="neobrutal" />
              ) : (
                <Beranda variant="neobrutal" />
              )}
            </main>
          </div>

          <Footer variant="neobrutal" />
        </div>
      );
    }

    return (
      <div className="flex min-h-screen text-white font-dm-sans">
        <Navbar />
        <div className="flex flex-col lg:flex-row w-full">
          <aside className="mt-20 mr-5 ml-6">
            <Sidebar active={this.state.active} setActive={this.setActive} />
          </aside>
          <main className="flex-1 px-6 py-4">
            {this.renderContent()}
          </main>
        </div>
      </div>
    );
  }
}

export default DashboardLayout;
