// DashboardLayout.js

import React, { Component } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Dashboard/Sidebar";
import Beranda from "../../components/Dashboard/Beranda/Beranda";
import IkutLomba from "../../components/Dashboard/IkutLomba/IkutLomba";
import IkutEvent from "../../components/Dashboard/IkutEvent/IkutEvent";
import SubmitLomba from "../../components/Dashboard/SubmitLomba/SubmitLomba";


class DashboardLayout extends Component {
  constructor(props) {
    super(props);
    const validTabs = ["beranda", "ikut-lomba", "ikut-event", "submit-lomba", "submit-gametoday", "submit-uxtoday", "submit-minetoday"];
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
      default:
        return <Beranda />;
    }
  };

  render() {
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
