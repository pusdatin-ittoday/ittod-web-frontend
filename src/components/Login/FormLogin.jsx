import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdEmail, MdKey } from "react-icons/md";
import Button from "./Button";
import Input from "./Input";
import Alert from "./Alert";
// Import API functions from user.js
import { loginUser, initiateGoogleLogin } from "../../api/user";

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
            alertMessage: props.verificationMessage || ""
        };

        this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
        this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
        this.handleRegisterClick = this.handleRegisterClick.bind(this);
        this.showPasswordHandler = this.showPasswordHandler.bind(this);
        this.forgetPasswordHandler = this.forgetPasswordHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
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
            this.setState({ loading: true, errorMessage: "", successMessage: "" });

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
                // Login failed
                this.setState({
                    errorMessage: result.error,
                    loading: false
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

    componentWillUnmount() {
        if (this.errorTimeout) clearTimeout(this.errorTimeout);
        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
        }
    }

    render() {
        const { email, password, showPassword, loading, errorMessage, successMessage, showAlert, alertType, alertMessage } = this.state;

        return (
            <form
                onSubmit={this.handleSubmit}
                className="w-80 lg:w-96 text-sm font-dm-sans flex flex-col justify-center bg-[#3D2357] p-10 gap-3 rounded-md backdrop-blur-md [box-shadow:0_0_10px_5px_#AC6871,_0_0_20px_5px_#AC6871_inset]"
            >
                {errorMessage && <Alert message={errorMessage} type="error" />}
                {successMessage && <Alert message={successMessage} type="success" />}
                {showAlert && <Alert message={alertMessage} type={alertType} />}

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
