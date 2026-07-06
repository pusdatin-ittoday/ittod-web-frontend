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
            <form className="w-full max-w-[420px] font-sans flex flex-col justify-center bg-white p-6 md:p-10 gap-6 border-2 md:border-[3px] border-black shadow-[10px_10px_0px_0px_#000000] md:shadow-[14px_14px_0px_0px_#000000] rounded-none">
                {showAlert && <Alert message={alertMessage} type={alertType} />}

                <h2 className="text-[#1E3A8A] text-xl md:text-2xl font-black italic tracking-wide uppercase text-center font-sans mt-2 mb-2">
                    Verifikasi Email
                </h2>

                <div className="flex flex-col justify-center items-center gap-4">
                    <img
                        src="gmail.svg"
                        className="max-w-28 max-h-28"
                        alt="Email verification"
                    />
                    <p className="text-gray-700 text-sm md:text-base text-center font-sans leading-relaxed">
                        Mohon <span className="font-black text-[#1E3A8A]">periksa email</span> untuk melanjutkan. Jika tidak ada email, <span className="font-black text-[#1E3A8A]">mohon memeriksa folder spam</span>.
                    </p>
                </div>

                <Button
                    className="w-full bg-[#FBBF24] hover:bg-[#F59E0B] active:bg-[#D97706] text-black border-2 border-black text-xs md:text-sm font-extrabold italic tracking-widest py-3.5 px-4 rounded-none transition-all uppercase duration-200 select-none cursor-pointer flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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