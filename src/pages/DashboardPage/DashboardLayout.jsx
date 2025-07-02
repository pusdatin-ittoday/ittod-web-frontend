// DashboardLayout.js

import React, { Component } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Dashboard/Sidebar";
import Beranda from "../../components/Dashboard/Beranda/Beranda";
import IkutLomba from "../../components/Dashboard/IkutLomba/IkutLomba";
import IkutEvent from "../../components/Dashboard/IkutEvent/IkutEvent";
import SubmitLomba from "../../components/Dashboard/SubmitLomba/SubmitLomba";
import { getCurrentUser } from "../../api/user";
import instance from "../../api/axios";

import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md"; // Added MdCheckCircleOutline

class DashboardLayout extends Component {
  constructor(props) {
    super(props);
    const validTabs = ["beranda", "ikut-lomba", "ikut-event", "submit-lomba", "submit-gametoday", "submit-uxtoday", "submit-minetoday"];
    const initialTab = validTabs.includes(props.activeTab) ? props.activeTab : "beranda";

    this.state = {
      active: initialTab,
      showAlert: false,
      incompleteFields: [],
      alertPosition: {
        x: 20,
        // Adjust Y position to potentially avoid overlap if both alerts show,
        // or ensure only one shows at a time.
        y: window.innerHeight - 300,
      },
      isDragging: false,
      dragOffset: { x: 0, y: 0 }, 
      showSuccessAlert: false, // <-- NEW: For success alert
      successAlertMessage: "", // <-- NEW: Message for success alert
      successAlertPosition: { // <-- NEW: Position for success alert (can be different)
        x: 20, // Bottom left
        y: window.innerHeight - 120, // Above the bottom, adjust as needed
      },
      alertType: null, // 'incomplete', 'pending', 'complete'
      pendingAlertPosition: {
        x: 20,
        y: window.innerHeight - 220, // Stacked above incomplete alert
      },
    };
  }

  componentDidMount() {
    sessionStorage.setItem("activeTab", this.state.active);
    this.checkUserDataCompleteness();
    this.checkProfileUpdateStatus(); // <-- NEW: Check for profile update status

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
    // If you navigate within the dashboard and want the success message to persist
    // across these internal navigations until closed, this check might be useful.
    // However, for a one-time notification after redirect, componentDidMount is key.
  }

  setActive = (tab) => {
    this.setState({ active: tab });
  };

  // Modifikasi checkUserDataCompleteness
  checkUserDataCompleteness = async () => {
    try {
      const response = await getCurrentUser();
      const userData = response.data;

      // Required fields as in EditProfil
      const requiredFields = [
        { key: "full_name", label: "Nama Lengkap" },
        { key: "email", label: "Email" },
        { key: "phone_number", label: "Nomor Telepon" },
        { key: "birth_date", label: "Tanggal Lahir" },
        { key: "jenis_kelamin", label: "Jenis Kelamin" },
        { key: "pendidikan", label: "Status Pendidikan" },
        { key: "nama_sekolah", label: "Nama Sekolah/Institusi" },
        { key: "ktm_key", label: "Kartu Institusi" },
        { key: "twibbon_key", label: "Twibbon" },
      ];

      const incompleteFields = requiredFields.filter(field =>
        !userData[field.key] || String(userData[field.key]).trim() === ""
      );

      let alertType = null;
      let showAlert = false;
      let showSuccessAlert = false;
      let successAlertMessage = "";

      if (incompleteFields.length > 0) {
        // Case 1: Data belum lengkap
        alertType = 'incomplete';
        showAlert = true;
        showSuccessAlert = false;
      } else if (userData.is_registration_complete === 0 || userData.is_registration_complete === false) {
        // Case 2: Data sedang diperiksa
        alertType = 'pending';
        showAlert = true;
        showSuccessAlert = false;
      } else if (userData.is_registration_complete === 1 || userData.is_registration_complete === true) {
        // Case 3: Data lengkap
        alertType = 'complete';
        showAlert = false;
        showSuccessAlert = true;
        successAlertMessage = "Data sudah lengkap!";
      }

      this.setState({
        showAlert,
        incompleteFields,
        alertType,
        showSuccessAlert,
        successAlertMessage,
        alertPosition: {
          x: 20,
          y: window.innerHeight - (150 + incompleteFields.length * 20),
        },
      });
    } catch (error) {
      console.error("Error checking user data completeness:", error);
      this.setState({
        showAlert: true,
        incompleteFields: [{ label: "Error loading user data" }],
        alertType: 'incomplete',
        alertPosition: {
          x: 20,
          y: window.innerHeight - 150,
        },
        showSuccessAlert: false
      });
    }
  };

  // Modifikasi checkProfileUpdateStatus
  checkProfileUpdateStatus = () => {
    const status = sessionStorage.getItem("profileUpdateStatus");

    if (status === "success") {
      // Keep existing functionality
      this.setState({
        showSuccessAlert: true,
        successAlertMessage: "Data berhasil disimpan!",
        successAlertPosition: {
          x: Math.max(20, window.innerWidth - 370),
          y: 80,
        },
        showAlert: false // Hide error alert if it was showing
      });

      // Clear the success status flag but keep the complete status
      sessionStorage.removeItem("profileUpdateStatus");

      // After 3 seconds, change the message to "Data sudah lengkap!"
      setTimeout(() => {
        if (this.state.showSuccessAlert) {
          this.setState({
            successAlertMessage: "Data sudah lengkap!"
          });
        }
      }, 3000);
    }
  };

  closeAlert = () => {
    this.setState({ showAlert: false });
  };

  // <-- NEW: Method to close success alert -->
  closeSuccessAlert = () => {
    this.setState({ showSuccessAlert: false, successAlertMessage: "" });
  };

  handleMouseDown = (e, alertType = "incomplete") => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    let currentPosition;
    if (alertType === "success") {
      currentPosition = this.state.successAlertPosition;
    } else if (alertType === "pending") {
      currentPosition = this.state.pendingAlertPosition;
    } else {
      currentPosition = this.state.alertPosition;
    }
    this.setState({
      isDragging: alertType,
      dragOffset: {
        x: e.clientX - currentPosition.x,
        y: e.clientY - currentPosition.y
      }
    });
  };

  handleTouchStart = (e, alertType = "incomplete") => {
    e.preventDefault();
    const touch = e.touches[0];
    let currentPosition;
    if (alertType === "success") {
      currentPosition = this.state.successAlertPosition;
    } else if (alertType === "pending") {
      currentPosition = this.state.pendingAlertPosition;
    } else {
      currentPosition = this.state.alertPosition;
    }
    this.setState({
      isDragging: alertType,
      dragOffset: {
        x: touch.clientX - currentPosition.x,
        y: touch.clientY - currentPosition.y
      }
    });
  };

  handleMouseMove = (e) => {
    if (!this.state.isDragging) return;
    const newX = e.clientX - this.state.dragOffset.x;
    const newY = e.clientY - this.state.dragOffset.y;
    if (this.state.isDragging === "success") {
      this.setState({ successAlertPosition: { x: newX, y: newY } });
    } else if (this.state.isDragging === "pending") {
      this.setState({ pendingAlertPosition: { x: newX, y: newY } });
    } else if (this.state.isDragging === "incomplete") {
      this.setState({ alertPosition: { x: newX, y: newY } });
    }
  };

  handleTouchMove = (e) => {
    if (!this.state.isDragging) return;
    const touch = e.touches[0];
    const newX = touch.clientX - this.state.dragOffset.x;
    const newY = touch.clientY - this.state.dragOffset.y;
    if (this.state.isDragging === "success") {
      this.setState({ successAlertPosition: { x: newX, y: newY } });
    } else if (this.state.isDragging === "pending") {
      this.setState({ pendingAlertPosition: { x: newX, y: newY } });
    } else if (this.state.isDragging === "incomplete") {
      this.setState({ alertPosition: { x: newX, y: newY } });
    }
  };

  handleMouseUp = () => {
    if (this.state.isDragging) {
      this.setState({ isDragging: false });
    }
  };

  handleTouchEnd = () => {
    if (this.state.isDragging) {
      this.setState({ isDragging: false });
    }
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


  // Tambahkan kode berikut untuk mengubah tampilan success alert di DashboardLayout.js

  render() {
    const { active, showAlert, incompleteFields, alertPosition, isDragging, showSuccessAlert, successAlertMessage, successAlertPosition, alertType, pendingAlertPosition } = this.state;

    const incompleteAlertStyle = {
      position: 'fixed',
      left: `${alertPosition.x}px`,
      top: `${alertPosition.y}px`,
      zIndex: 1000,
      cursor: isDragging === 'incomplete' ? 'grabbing' : 'grab',
    };

    const successAlertStyle = {
      position: 'fixed',
      left: `${successAlertPosition.x}px`,
      top: `${successAlertPosition.y}px`,
      zIndex: 1001,
      cursor: isDragging === 'success' ? 'grabbing' : 'grab',
    };

    const pendingAlertStyle = {
      position: 'fixed',
      left: `${pendingAlertPosition.x}px`,
      top: `${pendingAlertPosition.y}px`,
      zIndex: 1000,
      cursor: isDragging === 'pending' ? 'grabbing' : 'grab',
    };

    // Determine alert color and message
    let alertBg = 'bg-red-600/80';
    let alertTitle = 'Data belum lengkap!';
    let alertIcon = <MdErrorOutline className="text-sm sm:text-xl mr-2" />;
    let alertDesc = 'Mohon untuk lengkapi data diri Anda :';
    if (alertType === 'pending') {
      alertBg = 'bg-yellow-400/90 text-yellow-900';
      alertTitle = 'Data sedang diperiksa';
      alertIcon = <MdErrorOutline className="text-sm sm:text-xl mr-2" />;
      alertDesc = 'Mohon untuk menunggu';
    }

    return (
      <div className="flex min-h-screen text-white font-dm-sans">
        <Navbar />
        <div className="flex flex-col lg:flex-row w-full">
          <aside className="mt-20 mr-5 ml-6">
            <Sidebar active={active} setActive={this.setActive} />
          </aside>
          <main className="flex-1 px-6 py-4">
            {this.renderContent()}
          </main>
        </div>

        {/* Alert for incomplete or pending data */}
        {showAlert && alertType === 'incomplete' && (
          <div
            className={`${alertBg} text-white px-6 py-4 rounded-lg shadow-xl max-w-md`}
            style={incompleteAlertStyle}
            onMouseDown={(e) => this.handleMouseDown(e, "incomplete")}
            onTouchStart={(e) => this.handleTouchStart(e, "incomplete")}
          >
            <div className="flex justify-between items-start mb-2 gap-5">
              <h3 className="font-bold text-sm sm:text-lg">
                <div className="flex items-center">
                  {alertIcon}
                  {alertTitle}
                </div>
              </h3>
              <button
                onClick={this.closeAlert}
                className="bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-xs sm:text-sm mb-2">{alertDesc}</p>
            {alertType === 'incomplete' && (
              <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1">
                {incompleteFields.map((field, index) => (
                  <li key={index}>{field.label}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {showAlert && alertType === 'pending' && (
          <div
            className={`bg-yellow-400/90 text-yellow-900 px-6 py-4 rounded-lg shadow-xl max-w-md`}
            style={pendingAlertStyle}
            onMouseDown={(e) => this.handleMouseDown(e, "pending")}
            onTouchStart={(e) => this.handleTouchStart(e, "pending")}
          >
            <div className="flex justify-between items-start mb-2 gap-5">
              <h3 className="font-bold text-sm sm:text-lg">
                <div className="flex items-center">
                  <span className="spin-with-pause mr-1">⌛</span>
                  Data sedang diperiksa
                </div>
              </h3>
              <button
                onClick={this.closeAlert}
                className="bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Alert for successful data save or complete data */}
        {showSuccessAlert && (
          <div
            className="bg-green-600/90 text-white text-sm sm:text-xl px-4 py-2 sm:px-6 sm:py-4 rounded-lg shadow-xl max-w-sm"
            style={successAlertStyle}
            onMouseDown={(e) => this.handleMouseDown(e, "success")}
            onTouchStart={(e) => this.handleTouchStart(e, "success")}
          >
            <div className="flex justify-between items-center mb-1 gap-4">
              <h3 className="font-semibold text-md">
                <div className="flex items-center">
                  <MdCheckCircleOutline className="text-sm sm:text-xl mr-2" />
                  {successAlertMessage}
                </div>
              </h3>
              <button
                onClick={this.closeSuccessAlert}
                className="bg-green-700/85 hover:bg-green-800/85 rounded-full p-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default DashboardLayout;
