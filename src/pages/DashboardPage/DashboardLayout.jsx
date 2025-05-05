import React, { Component } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Dashboard/Sidebar";
import Beranda from "../../components/Dashboard/Beranda/Beranda";
import IkutLomba from "../../components/Dashboard/IkutLomba/IkutLomba";
import IkutEvent from "../../components/Dashboard/IkutEvent/IkutEvent";

class DashboardLayout extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      active: localStorage.getItem("activeTab") || "beranda",
      showAlert: false,
      incompleteFields: [],
      alertPosition: {
        x: 20, // Default position from left
        y: window.innerHeight - 300 // Default position from bottom
      },
      isDragging: false,
      dragOffset: { x: 0, y: 0 }
    };
  }

  componentDidMount() {
    // Save active tab to localStorage
    localStorage.setItem("activeTab", this.state.active);

    // Check user data completeness when component mounts
    this.checkUserDataCompleteness();

    // Add mouse move and mouse up event listeners to the window
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchEnd);
  }

  componentWillUnmount() {
    // Remove event listeners when component unmounts
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
  }

  componentDidUpdate(prevProps, prevState) {
    // Update localStorage when active tab changes
    if (prevState.active !== this.state.active) {
      localStorage.setItem("activeTab", this.state.active);
    }
  }

  // Function to set the active tab
  setActive = (tab) => {
    this.setState({ active: tab });
  };

  // Function to check if user data is complete
  checkUserDataCompleteness = () => {
    // Get user data from localStorage, API, or context
    // This is an example - replace with your actual user data source
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    // Define required fields with their display names
    const requiredFields = [
      { key: "name", label: "Nama Lengkap" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Nomor Telepon" },
      { key: "address", label: "Alamat" },
      { key: "birth_date", label: "Tanggal Lahir" },
      { key: "jenis_kelamin", label: "Jenis Kelamin" },
      { key: "pendidikan", label: "Status Pendidikan" },
      { key: "nama_sekolah", label: "Nama Sekolah/Institusi" }
    ];

    // Check which required fields are incomplete
    const incompleteFields = requiredFields.filter(field =>
      !userData[field.key] || userData[field.key].trim() === ""
    );

    // Show alert if there are incomplete fields
    this.setState({
      showAlert: incompleteFields.length > 0,
      incompleteFields: incompleteFields
    });
  };

  // Hide alert
  closeAlert = () => {
    this.setState({ showAlert: false });
  };

  // Mouse down handler for dragging
  handleMouseDown = (e) => {
    // Prevent default behavior and text selection
    e.preventDefault();
    
    const rect = e.currentTarget.getBoundingClientRect();
    
    this.setState({
      isDragging: true,
      dragOffset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    });
  };

  // Touch start handler for touch devices
  handleTouchStart = (e) => {
    // Prevent default behavior
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    
    this.setState({
      isDragging: true,
      dragOffset: {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      }
    });
  };

  // Mouse move handler for dragging
  handleMouseMove = (e) => {
    if (!this.state.isDragging) return;
    
    this.setState({
      alertPosition: {
        x: e.clientX - this.state.dragOffset.x,
        y: e.clientY - this.state.dragOffset.y
      }
    });
  };

  // Touch move handler for touch devices
  handleTouchMove = (e) => {
    if (!this.state.isDragging) return;
    
    const touch = e.touches[0];
    
    this.setState({
      alertPosition: {
        x: touch.clientX - this.state.dragOffset.x,
        y: touch.clientY - this.state.dragOffset.y
      }
    });
  };

  // Mouse up handler to stop dragging
  handleMouseUp = () => {
    this.setState({ isDragging: false });
  };

  // Touch end handler to stop dragging
  handleTouchEnd = () => {
    this.setState({ isDragging: false });
  };

  // Render content based on active tab
  renderContent = () => {
    switch (this.state.active) {
      case "ikut-lomba":
        return <IkutLomba />;
      case "ikut-event":
        return <IkutEvent />;
      default:
        return <Beranda />;
    }
  };

  render() {
    const { active, showAlert, incompleteFields, alertPosition, isDragging } = this.state;

    // Alert style with dynamic positioning
    const alertStyle = {
      position: 'fixed',
      left: `${alertPosition.x}px`,
      top: `${alertPosition.y}px`,
      zIndex: 1000,
      cursor: isDragging ? 'grabbing' : 'grab'
    };

    return (
      <div className="flex min-h-screen text-white font-dm-sans">
        {/* Navbar tetap di atas */}
        <Navbar />

        {/* Wrapper: Sidebar + Main Content sejajar */}
        <div className="flex flex-col lg:flex-row w-full">
          <aside className="mt-20 ml-6">
            {/* Sidebar */}
            <Sidebar active={active} setActive={this.setActive} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 px-6 py-4">
            {this.renderContent()}
          </main>
        </div>

        {/* Alert for incomplete data - now draggable */}
        {showAlert && (
          <div 
            className="bg-red-600/60 text-white px-6 py-3 rounded-lg shadow-lg max-w-md"
            style={alertStyle}
            onMouseDown={this.handleMouseDown}
            onTouchStart={this.handleTouchStart}
          >
            <div className="flex justify-between items-start mb-2 gap-5">
              <h3 className="font-bold text-lg">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Data belum lengkap!
                </div>
              </h3>
              <button
                onClick={this.closeAlert}
                className="bg-red-700/85 hover:bg-red-800/85 rounded-full p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-sm mb-2">Silakan lengkapi data diri Anda:</p>
            <ul className="list-disc pl-5 text-sm">
              {incompleteFields.map((field, index) => (
                <li key={index}>{field.label}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default DashboardLayout;