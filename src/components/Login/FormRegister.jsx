import React from "react";
import Button from "./Button";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { MdKey } from "react-icons/md";

const FormRegisterWithoutRouter = (props) => { 
    const navigate = useNavigate();
    return <FormRegister {...props} navigate={navigate} />;
}

class FormRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            showPassword: false,
            showConfirmPassword: false
        };

        this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
        this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
        this.onConfirmPasswordChangeHandler = this.onConfirmPasswordChangeHandler.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.showPasswordHandler = this.showPasswordHandler.bind(this);
        this.showConfirmPasswordHandler = this.showConfirmPasswordHandler.bind(this);

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
    handleLoginClick() {
        this.props.navigate('/login');  
    }
    render() {
        return (
            <form className="w-96 text-sm font-dm-sans flex flex-col justify-center bg-[#3D2357] p-10 gap-3 rounded-md backdrop-blur-md [box-shadow:0_0_10px_5px_#AC6871,_0_0_20px_5px_#AC6871_inset]">
                <div className="relative">
                    <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                    <Input
                        type="email"
                        placeholder="email"
                        value={this.state.email}
                        onChange={this.onEmailChangeHandler}
                    />
                </div>
                <div className="relative flex items-center">
                    <MdKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D2357] text-xl"/>
                    <Input
                        type={this.state.showPassword ? "text" : "password"}    
                        placeholder="password"
                        value={this.state.password}
                        onChange={this.onPasswordChangeHandler}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#3D2357]"
                        onClick={this.showPasswordHandler}
                    >
                        {this.state.showPassword ?<FiEyeOff/>:<FiEye/> }
                    </button>
                </div>

                <div className="relative flex items-center">
                    <MdKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                    <Input
                        type={this.state.showConfirmPassword ? "text" : "password"}
                        placeholder="confirm password"
                        value={this.state.confirmPassword}
                        onChange={this.onConfirmPasswordChangeHandler}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#3D2357]"
                        onClick={this.showConfirmPasswordHandler}>
                        {this.state.showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>
                <div className="w-full flex flex-col gap-4">
                    <Button
                        classname=" w-full custom-button-bg p-2 text-white rounded-md transition-all duration-300 hover:shadow-[0_0_10px_5px_rgba(209,107,165,0.2)] hover:brightness-110 cursor-pointer"
                        type="submit"
                        text="Registrasi" />

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
                    <p className="text-center text-xs">Sudah punya akun? <span className="text-xs text-[#F97283] hover:underline font-bold cursor-pointer" onClick={this.handleLoginClick}>Login</span></p>
                </div>
            </form>
        );
    }
}

export default FormRegisterWithoutRouter;