import React from "react";
import Button from "./Button";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
import { resendVerificationEmail } from "../../api/user";

const FormVerifyPasswordWithRouter = (props) => {
    const navigate = useNavigate();
    return <FormVerifyPassword {...props} navigate={navigate} />;
}

class FormVerifyPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countdown: 15,
            resendStatus: null,
            alertMessage: "",
            showAlert: false,
            alertType: "error"
        };
        this.handleResendClick = this.handleResendClick.bind(this);
    }

    componentDidMount() {
        this.startCountdown();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
        }
    }

    startCountdown() {
        this.interval = setInterval(() => {
            this.setState(prevState => {
                if (prevState.countdown <= 1) {
                    clearInterval(this.interval);
                    return { countdown: 0 };
                }
                return { countdown: prevState.countdown - 1 };
            });
        }, 1000);
    }

    showAlert(message, type = "error") {
        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
        }

        this.setState({
            alertMessage: message,
            showAlert: true,
            alertType: type
        });

        this.alertTimeout = setTimeout(() => {
            this.setState({ showAlert: false });
        }, 3000);
    }

    handleResendClick = async () => {
        if (this.state.countdown > 0) return;

        this.setState({ resendStatus: 'sending' });

        try {
            const email = this.props.email;
            const result = await resendVerificationEmail(email);

            if (result.success) {
                clearInterval(this.interval);
                this.setState({
                    countdown: 60,
                    resendStatus: 'success'
                }, () => {
                    this.startCountdown();
                });

                this.showAlert("Email verifikasi berhasil dikirim!", "success");
            } else {
                this.setState({ resendStatus: 'error' });
                this.showAlert(result.error || "Gagal mengirim email verifikasi.");
            }
        } catch (error) {
            console.error("Error resending verification email:", error);
            this.setState({ resendStatus: 'error' });
            this.showAlert("Terjadi kesalahan saat mengirim email.");
        }
    }

    render() {
        const { countdown, resendStatus, showAlert, alertMessage, alertType } = this.state;
        const isDisabled = countdown > 0;

        return (
            <form className="w-96 text-sm font-dm-sans flex flex-col justify-center bg-[#3D2357] p-10 gap-3 rounded-md backdrop-blur-md [box-shadow:0_0_10px_5px_#AC6871,_0_0_20px_5px_#AC6871_inset]">
                {showAlert && <Alert message={alertMessage} type={alertType} />}

                <h2 className="text-[#E4CCCF] text-xl font-semibold text-center font-playfair input-text-glow transition-all duration-300 hover:back-button-glow hover:brightness-110">
                    Verifikasi Email
                </h2>

                <div className="flex flex-col justify-center items-center">
                    <img
                        src="gmail.svg"
                        className="max-w-40 max-h-40"
                        alt="Email verification"
                    />
                    <p className="text-white text-sm text-center font-playfair transition-all duration-300 hover:back-button-glow hover:brightness-110">
                        Mohon <span className="font-bold input-text-glow">periksa email</span> untuk melanjutkan. Jika tidak ada email, <span className="font-bold input-text-glow">mohon memeriksa folder spam</span>
                    </p>
                </div>

                <Button
                    className="w-full custom-button-bg p-2 text-white font-bold rounded-md transition-all duration-300 button-hover cursor-pointer"
                    type="button"
                    text={
                        resendStatus === 'sending'
                            ? "Mengirim..."
                            : (countdown === 0
                                ? "Kirim ulang email"
                                : `Kirim ulang email dalam ${countdown} detik`)
                    }
                    onClick={this.handleResendClick}
                    disabled={isDisabled || resendStatus === 'sending'}
                />
            </form>
        );
    }
}

export default FormVerifyPasswordWithRouter;