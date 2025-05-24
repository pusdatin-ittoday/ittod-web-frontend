import React from "react";
import Button from "./Button";
import Input from "./Input";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdEmail, MdKey, MdPerson } from "react-icons/md";
// Import API functions from user.js
import { registerUser, initiateGoogleLogin } from "../../api/user";

const FormRegisterWithRouter = (props) => {
  const navigate = useNavigate();
  return <FormRegister {...props} navigate={navigate} />;
};

class FormRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      namaLengkap: "",
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      errorMessage: "",
      successMessage: "",
      loading: false,
      showAlert: false,
      alertType: "",
      alertMessage: "",
    };

    this.onNamaLengkapChangeHandler = this.onNamaLengkapChangeHandler.bind(this);
    this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
    this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
    this.onConfirmPasswordChangeHandler =
      this.onConfirmPasswordChangeHandler.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.showPasswordHandler = this.showPasswordHandler.bind(this);
    this.showConfirmPasswordHandler = this.showConfirmPasswordHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
  }

  onNamaLengkapChangeHandler(e) {
    this.setState({ namaLengkap: e.target.value });
  }

  onEmailChangeHandler(e) {
    this.setState({ email: e.target.value });
  }

  onPasswordChangeHandler(e) {
    this.setState({ password: e.target.value });
  }

  onConfirmPasswordChangeHandler(e) {
    this.setState({ confirmPassword: e.target.value });
  }

  showPasswordHandler() {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  }

  showConfirmPasswordHandler() {
    this.setState((prevState) => ({
      showConfirmPassword: !prevState.showConfirmPassword,
    }));
  }

  handleLoginClick() {
    this.props.navigate("/login");
  }

  handleGoogleLogin() {
    // Use the API function for Google login
    initiateGoogleLogin();
  }

  resetForm() {
    this.setState({
      namaLengkap: "",
      email: "",
      password: "",
      confirmPassword: "",
      loading: false
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { namaLengkap, email, password, confirmPassword } = this.state;

    // Clear previous timeout if exists
    if (this.errorTimeout) clearTimeout(this.errorTimeout);

    // Reset all alert states at the beginning
    this.setState({ 
      errorMessage: "", 
      successMessage: "",
      showAlert: false,
      alertType: "",
      alertMessage: ""
    });

    // Client-side validation
    if (!namaLengkap || !email || !password || !confirmPassword) {
      this.setState({ errorMessage: "Semua kolom harus diisi!" });
    } else if (namaLengkap.length < 8) {
      this.setState({ errorMessage: "Nama lengkap minimal 8 karakter!" });
    } else if (password.length < 8) {
      this.setState({ errorMessage: "Password minimal 8 karakter!" });
    } else if (password !== confirmPassword) {
      this.setState({ errorMessage: "Password tidak cocok!" });
    } else {
      // Set loading state
      this.setState({ loading: true });
      
      try {
        // Call the API function for registration
        const result = await registerUser({
          full_name: namaLengkap,
          email: email,
          password: password
        });
        
        if (result.success) {
          // Show success alert with clear instructions about verification
          this.setState({
            showAlert: true,
            alertType: 'success',
            alertMessage: 'Registrasi berhasil! Silakan periksa email Anda untuk verifikasi. Setelah verifikasi, Anda dapat login dengan akun yang telah terdaftar.',
            loading: false
          });
          
          // Reset the form
          this.resetForm();
        } else {
          // Show error message
          this.setState({
            showAlert: true,
            alertType: 'error',
            alertMessage: result.error || "Registrasi gagal. Silakan coba lagi.",
            loading: false
          });
        }
      } catch (error) {
        // Handle unexpected errors
        console.error("Registration error:", error);
        this.setState({
          showAlert: true,
          alertType: 'error',
          alertMessage: "An unexpected error occurred. Please try again.",
          loading: false
        });
      }
    }

    // Reset messages after some time
    this.errorTimeout = setTimeout(() => {
      this.setState({ 
        errorMessage: "", 
        successMessage: "",
        showAlert: false 
      });
    }, 10000); // Increased to 10 seconds so users have more time to read the message
  }

  componentWillUnmount() {
    if (this.errorTimeout) clearTimeout(this.errorTimeout);
  }

  render() {
    const {
      namaLengkap,
      email,
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      errorMessage,
      successMessage,
      loading,
      showAlert,
      alertType,
      alertMessage,
    } = this.state;

    return (
      <form
        onSubmit={this.handleSubmit}
        className="w-80 lg:w-96 text-sm font-dm-sans flex flex-col justify-center bg-[#3D2357] p-10 gap-3 rounded-md backdrop-blur-md [box-shadow:0_0_10px_5px_#AC6871,_0_0_20px_5px_#AC6871_inset]"
      >
        {errorMessage && <Alert message={errorMessage} type="error" />}
        {successMessage && <Alert message={successMessage} type="success" />}
        {showAlert && <Alert message={alertMessage} type={alertType} />}

        <div className="relative">
          <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D2357] text-xl" />
          <Input
            type="text"
            placeholder="nama lengkap"
            value={namaLengkap}
            onChange={this.onNamaLengkapChangeHandler}
            disabled={loading}
          />
        </div>

        <div className="relative">
          <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D2357] text-xl" />
          <Input
            type="email"
            placeholder="email"
            value={email}
            onChange={this.onEmailChangeHandler}
            disabled={loading}
          />
        </div>

        <div className="relative flex items-center">
          <MdKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D2357] text-xl" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="minimal 8 karakter"
            value={password}
            onChange={this.onPasswordChangeHandler}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#3D2357]"
            onClick={this.showPasswordHandler}
            disabled={loading}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <div className="relative flex items-center">
          <MdKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D2357] text-xl" />
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="confirm password"
            value={confirmPassword}
            onChange={this.onConfirmPasswordChangeHandler}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#3D2357]"
            onClick={this.showConfirmPasswordHandler}
            disabled={loading}
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <div className="w-full flex flex-col gap-4">
          <Button
            className={`w-full custom-button-bg p-2 text-white rounded-md transition-all duration-300 ${loading ? 'opacity-70' : 'button-hover'} cursor-pointer`}
            type="submit"
            text={loading ? "Loading..." : "Registrasi"}
            disabled={loading}
          />

          <p className="text-center">or</p>

          <button
            type="button"
            className="w-full p-[2px] rounded-md bg-[length:200%_200%] custom-button-bg cursor-pointer transition-all duration-300 ease-in-out hover:bg-[position:100%_0] button-hover"
            onClick={this.handleGoogleLogin}
            disabled={loading}
          >
            <div className="flex items-center justify-center gap-2 w-full h-full bg-[#3D2357] text-white rounded-md p-2">
              <img src="/google.svg" alt="Google Logo" className="w-5 h-5" />
              Login dengan Google
            </div>
          </button>

          <p className="text-center text-xs">
            Sudah punya akun?{" "}
            <span
              className="text-xs text-[#F97283] hover:underline font-bold cursor-pointer"
              onClick={this.handleLoginClick}
            >
              Login
            </span>
          </p>
        </div>
      </form>
    );
  }
}

export default FormRegisterWithRouter;