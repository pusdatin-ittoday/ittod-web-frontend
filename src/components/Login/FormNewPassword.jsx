import React from "react";
import Button from "./Button";
import Input from "./Input";
import Alert from "./Alert";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdKey } from "react-icons/md";
import { resetPassword } from "../../api/user";

const FormNewPasswordWithRouter = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    
    return <FormNewPassword 
        {...props} 
        navigate={navigate} 
        token={token}
    />;
}

class FormNewPassword extends React.Component {
constructor(props) {
    super(props);
    this.state = {
        password: "",
        confirmPassword: "",
        showPassword: false,
        showConfirmPassword: false,
        errorMessage: "",
        successMessage: "",
        loading: false
    };

    this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
    this.onConfirmPasswordChangeHandler = this.onConfirmPasswordChangeHandler.bind(this);
    this.showPasswordHandler = this.showPasswordHandler.bind(this);
    this.showConfirmPasswordHandler = this.showConfirmPasswordHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}

    componentDidMount() {
        // Check if we have a token
        if (!this.props.token) {
            this.setState({ 
                errorMessage: "Token reset password tidak ditemukan. Silakan coba lagi dengan mengklik link di email." 
            });
        }
    }

    onPasswordChangeHandler(event) {
        this.setState(() => {
            return {
                password: event.target.value
            }
        })
    }

    onConfirmPasswordChangeHandler(event) {
        this.setState(() => {
            return {
                confirmPassword: event.target.value
            }
        })
    }

    showPasswordHandler() {
        this.setState((prevState) => {
            return {
                showPassword: !prevState.showPassword
            }
        })
    }

    showConfirmPasswordHandler() {
        this.setState((prevState) => {
            return {
                showConfirmPassword: !prevState.showConfirmPassword
            }
        })
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { password, confirmPassword } = this.state; // Fixed: added confirmPassword
        const { token } = this.props;

        // Clear previous timeout if exists
        if (this.msgTimeout) {
            clearTimeout(this.msgTimeout);
        }

        // Reset messages
        this.setState({ 
            errorMessage: "",
            successMessage: ""
        });

        // Validate inputs
        if (!password || !confirmPassword) {
            this.setState({ errorMessage: "Password harus diisi!" });
        } else if (password !== confirmPassword) {
            this.setState({ errorMessage: "Password tidak cocok!" });
        } else if (password.length < 8) {
            this.setState({ errorMessage: "Password minimal 8 karakter!" });
        } else if (!token) {
            this.setState({ errorMessage: "Token reset password tidak valid!" });
        } else {
            // Set loading state
            this.setState({ loading: true });
            
            try {
                // Call API to reset password - Fixed: using password variable
                const result = await resetPassword({
                    token,
                    newPassword: password // Fixed: was undefined before
                });
                
                if (result.success) {
                    this.setState({
                        successMessage: "Password berhasil diubah! Anda akan dialihkan ke halaman login.",
                        loading: false,
                        newPassword: "",
                    });
                    
                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        this.props.navigate('/login', { 
                            state: { 
                                passwordReset: true,
                                message: "Password berhasil diubah. Silakan login dengan password baru Anda." 
                            } 
                        });
                    }, 3000);
                } else {
                    this.setState({ 
                        errorMessage: result.error,
                        loading: false 
                    });
                }
            } catch (error) {
                console.error("Password reset error:", error);
                this.setState({ 
                    errorMessage: "Terjadi kesalahan saat mengubah password.",
                    loading: false 
                });
            }
        }

        // Set timeout to clear messages
        this.msgTimeout = setTimeout(() => {
            this.setState({ 
                errorMessage: "",
                successMessage: ""
            });
        }, 5000);
    }

    componentWillUnmount() {
        if (this.msgTimeout) {
            clearTimeout(this.msgTimeout);
        }
    }

    render() {
        const { 
            password, 
            confirmPassword, 
            showPassword, 
            showConfirmPassword, 
            errorMessage,
            successMessage,
            loading
        } = this.state;

        return (
            <form onSubmit={this.handleSubmit} className="w-full max-w-[420px] font-sans flex flex-col justify-center bg-white p-6 md:p-10 gap-6 border-2 md:border-[3px] border-black shadow-[10px_10px_0px_0px_#000000] md:shadow-[14px_14px_0px_0px_#000000] rounded-none">
                {errorMessage && <Alert message={errorMessage} type="error" />}
                {successMessage && <Alert message={successMessage} type="success" />}

                <h2 className="text-[#1E3A8A] text-xl md:text-2xl font-black italic tracking-wide uppercase text-center font-sans mt-2 mb-2">
                    Buat password baru
                </h2>
                <div className="relative flex items-center">
                    <MdKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl z-10" />
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="minimal 8 karakter"
                        value={password}
                        onChange={this.onPasswordChangeHandler}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black z-10"
                        onClick={this.showPasswordHandler}
                        disabled={loading}
                    >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                </div>

                <div className="relative flex items-center">
                    <MdKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-xl z-10" />
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="confirm password"
                        value={confirmPassword}
                        onChange={this.onConfirmPasswordChangeHandler}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black z-10"
                        onClick={this.showConfirmPasswordHandler}
                        disabled={loading}
                    >
                        {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                </div>
                <div className="w-full flex flex-col gap-4">
                    <Button
                        className="w-full bg-[#FBBF24] hover:bg-[#F59E0B] active:bg-[#D97706] text-black border-2 border-black text-xs md:text-sm font-extrabold italic tracking-widest py-3.5 px-4 rounded-none transition-all uppercase duration-200 select-none cursor-pointer flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        text={loading ? "Memproses..." : "Buat password baru"}
                        disabled={loading}
                    />
                </div>
            </form>
        );
    }
}

export default FormNewPasswordWithRouter;