import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdEmail, MdKey } from "react-icons/md";
import Button from "./Button";
import Input from "./Input";
import Alert from "./Alert";
// Import API functions from user.js
import { loginUser, initiateGoogleLogin, resendVerificationEmail } from "../../api/user";

const FormLoginWithRouter = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Cek apakah user baru saja diverifikasi
    const verified = location.state?.verified;
    const verificationMessage = location.state?.message;
    
    return <FormLogin 
        {...props} 
        navigate={navigate} 
        verified={verified}
        verificationMessage={verificationMessage}
    />;
};

class FormLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            showPassword: false,
            errorMessage: "",
            successMessage: "",
            loading: false,
            showAlert: props.verified || false,
            alertType: props.verified ? "success" : "error",
            alertMessage: props.verificationMessage || "",
            needsVerification: false,
            resendLoading: false
        };

        this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
        this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
        this.handleRegisterClick = this.handleRegisterClick.bind(this);
        this.showPasswordHandler = this.showPasswordHandler.bind(this);
        this.forgetPasswordHandler = this.forgetPasswordHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
        this.handleResendVerification = this.handleResendVerification.bind(this);
    }

    onEmailChangeHandler(event) {
        this.setState({
            email: event.target.value,
        });
    }

    onPasswordChangeHandler(event) {
        this.setState({
            password: event.target.value,
        });
    }

    showPasswordHandler() {
        this.setState((prevState) => ({
            showPassword: !prevState.showPassword,
        }));
    }

    handleRegisterClick() {
        this.props.navigate("/register");
    }

    forgetPasswordHandler() {
        this.props.navigate("/forget-password");
    }

    handleGoogleLogin() {
        // Use the imported function for Google login
        initiateGoogleLogin();
    }

    async handleSubmit(e) {
        e.preventDefault();
        const { email, password } = this.state;

        // Clear previous timeout if exists
        if (this.errorTimeout) clearTimeout(this.errorTimeout);

        // Basic validation
        if (!email || !password) {
            this.setState({ errorMessage: "Email dan password harus diisi!" });
            return;
        }

        try {
            this.setState({ loading: true, errorMessage: "", successMessage: "", needsVerification: false });

            // Use the API function for login
            const result = await loginUser({ email, password });

            if (result.success) {
                // Login successful
                this.setState({
                    successMessage: "Login berhasil! Sedang mengalihkan...",
                    loading: false
                });

                // Redirect to dashboard
                setTimeout(() => {
                    this.props.navigate("/dashboard/beranda");
                }, 1000);
            } else {
                // Check if verification is needed
                const isVerificationError = result.error?.toLowerCase().includes('verify') || 
                                          result.error?.toLowerCase().includes('verifikasi') ||
                                          result.error?.toLowerCase().includes('email belum');
                
                // Login failed
                this.setState({
                    errorMessage: result.error,
                    loading: false,
                    needsVerification: isVerificationError
                });
            }
        } catch (error) {
            // Handle unexpected errors
            console.error("Login error:", error);
            this.setState({
                errorMessage: "An unexpected error occurred. Please try again.",
                loading: false
            });
        }

        // Reset messages after some time
        this.errorTimeout = setTimeout(() => {
            this.setState({ errorMessage: "", successMessage: "" });
        }, 3000);
    }

    async handleResendVerification() {
        const { email } = this.state;
        
        if (!email) {
            this.setState({ errorMessage: "Masukkan email untuk verifikasi ulang" });
            return;
        }
        
        try {
            this.setState({ resendLoading: true, errorMessage: "", successMessage: "" });
            
            const result = await resendVerificationEmail(email);
            
            if (result.success) {
                this.setState({ 
                    successMessage: result.message,
                    errorMessage: "",
                    resendLoading: false 
                });
            } else {
                this.setState({ 
                    errorMessage: result.error,
                    successMessage: "",
                    resendLoading: false 
                });
            }
        } catch (error) {
            console.error("Resend verification error:", error);
            this.setState({
                errorMessage: "Gagal mengirim email verifikasi.",
                resendLoading: false
            });
        }
    }

    componentWillUnmount() {
        if (this.errorTimeout) clearTimeout(this.errorTimeout);
        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
        }
    }

    componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        const verified = params.get('verified');
        const error = params.get('error');
        
        if (verified === 'true') {
          this.setState({
            successMessage: '',  // Don't set this to avoid duplicate alerts
            showAlert: true,
            alertType: 'success',
            alertMessage: 'Email berhasil diverifikasi! Silakan login.'
          });
        } else if (error) {
          // Handle error from verification redirect
          const errorMessage = decodeURIComponent(error);
          this.setState({
            errorMessage: '',  // Don't set this to avoid duplicate alerts
            showAlert: true,
            alertType: 'error',
            alertMessage: errorMessage
          });
        }
        
        // Set timeout to clear alert messages after some time
        this.alertTimeout = setTimeout(() => {
          this.setState({ showAlert: false });
        }, 5000);
      }

    render() {
        const { 
            email, password, showPassword, loading, errorMessage, successMessage, 
            showAlert, alertType, alertMessage, needsVerification, resendLoading 
        } = this.state;

        return (
            <form
                onSubmit={this.handleSubmit}
                className="w-80 lg:w-96 text-sm font-dm-sans flex flex-col justify-center bg-[#3D2357] p-10 gap-3 rounded-md backdrop-blur-md [box-shadow:0_0_10px_5px_#AC6871,_0_0_20px_5px_#AC6871_inset]"
            >
                {errorMessage && <Alert message={errorMessage} type="error" />}
                {successMessage && <Alert message={successMessage} type="success" />}
                {showAlert && <Alert message={alertMessage} type={alertType} />}
                
                {/* Add resend verification section */}
                {needsVerification && (
                    <div className="backdrop-blur-md  text-white px-4 py-3 rounded-lg relative mb-3 shadow-lg transition-all duration-300 ease-in-out">
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-b bg-white/30 border z-0"></div>
                        <p className="text-xs font-medium relative z-10">Email belum diverifikasi.</p>
                        <button
                            type="button"
                            className="mt-2 text-xs bg-gradient-to-r custom-button-bg button-hover text-white py-1.5 px-3 rounded-md relative z-10 shadow-md transition-all duration-300"
                            onClick={this.handleResendVerification}
                            disabled={resendLoading}
                        >
                            {resendLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Mengirim...
                                </span>
                            ) : "Kirim Ulang Email Verifikasi"}
                        </button>
                    </div>
                )}

                <div className="relative">
                    <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                    <Input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={this.onEmailChangeHandler}
                        disabled={loading || resendLoading}
                    />
                </div>

                <div className="relative flex items-center">
                    <MdKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
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

                <div className="flex justify-start w-full">
                    <span
                        className="text-xs underline font-bold text-[#F97283] cursor-pointer hover:text-[#FB8A9A]"
                        onClick={this.forgetPasswordHandler}
                    >
                        Lupa Password?
                    </span>
                </div>

                <div className="w-full flex flex-col gap-4">
                    <Button
                        className={`w-full custom-button-bg p-2 text-white rounded-md transition-all duration-300 ${loading ? 'opacity-70' : 'button-hover'} cursor-pointer`}
                        type="submit"
                        text={loading ? "Loading..." : "Login"}
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
                        Belum punya akun?{" "}
                        <span
                            className="text-xs text-[#F97283] hover:underline font-bold cursor-pointer"
                            onClick={this.handleRegisterClick}
                        >
                            Registrasi
                        </span>
                    </p>
                </div>
            </form>
        );
    }
}

export default FormLoginWithRouter;
