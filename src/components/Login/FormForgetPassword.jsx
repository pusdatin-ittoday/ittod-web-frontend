import React from "react";
import Button from "./Button";
import Input from "./Input";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { requestPasswordReset } from "../../api/user"; // Add this import

const FormForgetPasswordWithRouter = (props) => {
    const navigate = useNavigate();
    return <FormForgetPassword {...props} navigate={navigate} />;
}

class FormForgetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            errorMessage: "",
            successMessage: "",
            loading: false
        };

        this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
        this.onBackButtonClickHandler = this.onBackButtonClickHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    onEmailChangeHandler(event) {
        this.setState(() => {
            return {
                email: event.target.value
            }
        })
    }

    onBackButtonClickHandler() {
        this.props.navigate('/login');
    }
      
    async handleSubmit(event) {
        event.preventDefault(); 
        const { email } = this.state;

        if (!email) {
            this.setState({ errorMessage: "Email harus diisi!" });
            setTimeout(() => {
                this.setState({ errorMessage: "" });
            }, 3000);
        } else {
            // Set loading state
            this.setState({ loading: true, errorMessage: "" });
            
            try {
                // Call API to request password reset
                const result = await requestPasswordReset({ email });
                
                if (result.success) {
                    // Immediately redirect to verify password page without showing success message
                    this.props.navigate('/verify-password', { 
                        state: { email: this.state.email } 
                    });
                } else {
                    // Show error message
                    this.setState({ 
                        errorMessage: result.error || "Gagal mengirim reset password. Silakan coba lagi.", 
                        loading: false 
                    });
                }
            } catch (error) {
                console.error("Password reset error:", error);
                this.setState({ 
                    errorMessage: "Terjadi kesalahan. Silakan coba lagi.",
                    loading: false 
                });
            }
        }
    }

    render() {
        const { email, errorMessage, loading } = this.state;
        
        return (
            <form onSubmit={this.handleSubmit} className="w-80 lg:w-96 text-sm font-dm-sans flex flex-col justify-center bg-[#3D2357] p-10 gap-3 rounded-md backdrop-blur-md [box-shadow:0_0_10px_5px_#AC6871,_0_0_20px_5px_#AC6871_inset]">
                {errorMessage && <Alert message={errorMessage} type="error" />}
                
                <div className="flex flex-row items-center gap-[50px] lg:gap-[75px]">
                    <p className="text-[#E4CCCF] text-xl font-bold font-playfair leading-normal input-text-glow cursor-pointer transition-all duration-300 back-button-glow hover:brightness-110" onClick={this.onBackButtonClickHandler}>←</p>
                    <h2 className="text-[#E4CCCF] text-xl font-semibold text-center font-playfair input-text-glow transition-all duration-300 back-button-glow hover:brightness-110">
                        Lupa Password
                    </h2>
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
                <Button
                    className="w-full custom-button-bg p-2 text-white rounded-md transition-all duration-300 button-hover cursor-pointer"
                    type="submit"
                    disabled={loading}
                    text={loading ? "Mengirim..." : "Reset Password"}
                />
            </form>
        );
    }
}

export default FormForgetPasswordWithRouter;