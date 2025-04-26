import React from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";


const FormVerifyPasswordWithRouter = (props) => {
    const navigate = useNavigate();
    return <FormVerifyPassword {...props} navigate={navigate} />;
}


class FormVerifyPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countdown: 60
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
    
    handleResendClick () {
        clearInterval(this.interval); // matiin interval lama
        this.setState({ countdown: 10 }, () => {
            this.startCountdown();    // abis set countdown ke 10, mulai lagi
        });
    }
    render() {
        const { countdown } = this.state;
        const isDisabled = countdown > 0;

        return (
            <form className="w-96 text-sm font-dm-sans flex flex-col justify-center bg-[#3D2357] p-10 gap-3 rounded-md backdrop-blur-md [box-shadow:0_0_10px_5px_#AC6871,_0_0_20px_5px_#AC6871_inset]">
                
                <h2 className="text-[#E4CCCF] text-xl font-semibold text-center font-playfair input-text-glow transition-all duration-300 hover:back-button-glow hover:brightness-110" >
                    Verifikasi Email
                </h2>
                
                <div className="flex flex-col justify-center items-center ">
                    <img
                        src="gmail.svg"
                        className="max-w-40 max-h-40 "
                    />
                    <p className="text-white text-sm text-center font-playfair transition-all duration-300 hover:back-button-glow hover:brightness-110" >
                        Mohon <span className="font-bold input-text-glow">periksa email</span> untuk melanjutkan. Jika tidak ada email, <span className="font-bold input-text-glow">mohon memeriksa folder spam</span>
                    </p>
                </div>
                <Button
                    classname= "w-full custom-button-bg p-2 text-white font-bold rounded-md transition-all duration-300 hover:shadow-[0_0_10px_5px_rgba(209,107,165,0.2)] hover:brightness-110 cursor-pointer"
                    type="button"
                    text= {countdown == 0? "Kirim ulang email" : `Kirim ulang email dalam ${this.state.countdown} detik`}
                    onClick={this.handleResendClick}
                    disabled = {isDisabled}
                    />
                    

            </form>
        );
    }
}

export default FormVerifyPasswordWithRouter;