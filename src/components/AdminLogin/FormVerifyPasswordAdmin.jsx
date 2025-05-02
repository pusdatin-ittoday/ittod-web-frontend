import React from "react";
import Button from "../Login/Button";
import { useNavigate, useLocation } from "react-router-dom";

const FormVerifyPasswordAdminWithRouter = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    return <FormVerifyPasswordAdmin {...props} navigate={navigate} location={location} />;
};

class FormVerifyPasswordAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countdown: 60,
            errorMessage: "",
            successMessage: ""
        };

        this.handleResendClick = this.handleResendClick.bind(this);
    }

    componentDidMount() {
        this.startCountdown();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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

    async handleResendClick() {
        clearInterval(this.interval);
        const email = this.props.location?.state?.email;

        if (!email) {
            this.setState({ errorMessage: "Email tidak ditemukan dalam data." });
            return;
        }

        try {
            const response = await fetch("/api/admin/auth/resend-verification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result?.message || "Gagal mengirim ulang email verifikasi");
            }

            this.setState({
                countdown: 60,
                successMessage: "Email verifikasi berhasil dikirim ulang.",
                errorMessage: ""
            }, () => {
                this.startCountdown();
            });

        } catch (error) {
            this.setState({
                errorMessage: error.message,
                successMessage: ""
            });
        }
    }

    render() {
        const { countdown, errorMessage, successMessage } = this.state;
        const isDisabled = countdown > 0;

        return (
            <form className="w-96 text-sm font-dm-sans flex flex-col justify-center bg-[#3D2357] p-10 gap-3 rounded-md backdrop-blur-md [box-shadow:0_0_10px_5px_#AC6871,_0_0_20px_5px_#AC6871_inset]">

                <h2 className="text-[#E4CCCF] text-xl font-semibold text-center font-playfair input-text-glow">
                    Verifikasi Email Admin
                </h2>

                {errorMessage && <p className="text-red-400 text-center">{errorMessage}</p>}
                {successMessage && <p className="text-green-400 text-center">{successMessage}</p>}

                <div className="flex flex-col justify-center items-center">
                    <img src="/gmail.svg" className="max-w-40 max-h-40" />
                    <p className="text-white text-sm text-center font-playfair">
                        Mohon <span className="font-bold input-text-glow">periksa email</span> untuk melanjutkan. Jika tidak ada email, <span className="font-bold input-text-glow">periksa folder spam</span>.
                    </p>
                </div>

                <Button
                    classname="w-full custom-button-bg p-2 text-white font-bold rounded-md transition-all duration-300 hover:shadow-[0_0_10px_5px_rgba(209,107,165,0.2)] hover:brightness-110 cursor-pointer"
                    type="button"
                    text={countdown === 0 ? "Kirim ulang email" : `Kirim ulang email dalam ${countdown} detik`}
                    onClick={this.handleResendClick}
                    disabled={isDisabled}
                />
            </form>
        );
    }
}

export default FormVerifyPasswordAdminWithRouter;
