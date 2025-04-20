import React from "react";
import Button from "./Button";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const FormLoginWithRouter = (props) => {
    const navigate = useNavigate();
    return <FormLogin {...props} navigate={navigate} />;
  }


class FormLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",   
            showPassowrd: false
        };

        this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
        this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
        this.handleRegisterClick = this.handleRegisterClick.bind(this);
        this.showPasswordHandler = this.showPasswordHandler.bind(this);
    }
    onEmailChangeHandler(event) {
        this.setState(() => {
            return {
                email: event.target.value
            }
        })
    }

    onPasswordChangeHandler(event) {
        this.setState(() => {
            return {
                password: event.target.value
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

    handleRegisterClick() {
        this.props.navigate('/register');
    }

    render() {
        return (
            <form className="w-96 text-sm font-dm-sans flex flex-col justify-center bg-[#3D2357] p-10 gap-3 rounded-md backdrop-blur-md [box-shadow:0_0_10px_5px_#AC6871,_0_0_20px_5px_#AC6871_inset]">
                <Input
                    type="email"
                    placeholder="email"
                    value={this.state.email}
                    onChange={this.onEmailChangeHandler}
                />
                <div className="relative flex items-center">
                    <Input
                        type= {this.state.showPassword ? "text" : "password"}
                        placeholder="password"
                        value={this.state.password}
                        onChange={this.onPasswordChangeHandler}
                        className = "pr-10"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#3D2357]"
                        onClick={this.showPasswordHandler}
                    >
                        {this.state.showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>

                </div>
                <Button classname="text-xs text-left cursor-pointer hover:underline" type="button" text="Lupa Password?" />
                <div className="w-full flex flex-col gap-4">
                    <Button
                        classname=" w-full custom-button-bg p-2 text-white rounded-md transition-all duration-300 hover:shadow-[0_0_10px_5px_rgba(209,107,165,0.2)] hover:brightness-110 cursor-pointer"
                        type="submit"
                        text="Login" />
                    <p className="text-center">or</p>

                    <button
                        type="button"
                        className="w-full p-[2px] rounded-md bg-[length:200%_200%] bg-gradient-to-r from-[#F97283] via-[#B247B4] to-[#9323C2] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[position:100%_0] hover:shadow-[0_0_10px_5px_rgba(209,107,165,0.2)] hover:brightness-110"
                    >
                        <div className="flex items-center justify-center gap-2 w-full h-full bg-[#3D2357] text-white rounded-md p-2">
                            <img src="/google.svg" alt="Google Logo" className="w-5 h-5" />
                            Login dengan Google
                        </div>
                    </button>

                    <p className="text-center text-xs">Belum punya akun? <span className="text-xs text-[#F97283] hover:underline font-bold cursor-pointer" onClick={this.handleRegisterClick}>Registrasi</span></p>
                </div>
            </form>
        );
    }
}

export default FormLoginWithRouter  ;