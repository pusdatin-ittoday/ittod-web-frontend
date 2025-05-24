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
        const { password, confirmPassword } = this.state;
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
                // Call API to reset password
                const result = await resetPassword({
                    token,
                    password,
                    confirmPassword
                });
                
                if (result.success) {
                    this.setState({
                        successMessage: "Password berhasil diubah! Anda akan dialihkan ke halaman login.",
                        loading: false,
                        password: "",
                        confirmPassword: ""
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
            <form onSubmit={this.handleSubmit} className="w-80 lg:w-96 lg:h-auto font-dm-sans flex flex-col justify-center bg-[#3D2357] p-10 gap-3 rounded-md backdrop-blur-md [box-shadow:0_0_10px_5px_#AC6871,_0_0_20px_5px_#AC6871_inset]">
                {errorMessage && <Alert message={errorMessage} type="error" />}
                {successMessage && <Alert message={successMessage} type="success" />}

                <h2 className="text-[#E4CCCF] text-xl font-semibold text-center font-playfair input-text-glow transition-all duration-300 hover:back-button-glow hover:brightness-110" >
                    Buat password baru
                </h2>
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
                        className="w-full custom-button-bg p-2 text-white rounded-md transition-all duration-300 button-hover cursor-pointer"
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