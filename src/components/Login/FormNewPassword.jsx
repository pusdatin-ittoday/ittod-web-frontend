import React from "react";
import Button from "./Button";
import Input from "./Input";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdKey } from "react-icons/md";

const FormNewPasswordWithRouter = (props) => {
    const navigate = useNavigate();
    return <FormNewPassword {...props} navigate={navigate} />;
}

class FormNewPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            confirmPassword: "",
            showPassword: false,
            showConfirmPassword: false,
            errorMessage: ""
        };

constructor(props) {
    super(props);
    this.state = {
        password: "",
        confirmPassword: "",
        showPassword: false,
        showConfirmPassword: false,
        errorMessage: ""
    };

    this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
    this.onConfirmPasswordChangeHandler = this.onConfirmPasswordChangeHandler.bind(this);
    this.showPasswordHandler = this.showPasswordHandler.bind(this);
    this.showConfirmPasswordHandler = this.showConfirmPasswordHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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



    handleSubmit(event) {
        event.preventDefault();
        const { password, confirmPassword } = this.state;

        if (!password || !confirmPassword) {
            this.setState({ errorMessage: "Password harus diisi!" });
        } else if (password !== confirmPassword) {
            this.setState({ errorMessage: "Password tidak cocok!" });
            this.errorTimeout = setTimeout(() => {
                this.setState({ errorMessage: "" });
            }, 3000);
        } else if (password.length < 8) {
            this.setState({ errorMessage: "Password minimal 8 karakter!" });
            this.errorTimeout = setTimeout(() => {
                this.setState({ errorMessage: "" });
            }, 3000);
        } else {
            this.setState({ errorMessage: "" });
            // Navigate to login page or show success message
            this.props.navigate('/login');
        }
    }

    componentWillUnmount() {
        if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className="w-80 lg:w-96 lg:h-auto font-dm-sans flex flex-col justify-center bg-[#3D2357] p-10 gap-3 rounded-md backdrop-blur-md [box-shadow:0_0_10px_5px_#AC6871,_0_0_20px_5px_#AC6871_inset]">
                <Alert message={this.state.errorMessage} />
                <h2 className="text-[#E4CCCF] text-xl  font-semibold text-center font-playfair input-text-glow transition-all duration-300 hover:back-button-glow hover:brightness-110" >
                    Buat password baru
                </h2>
                <div className="relative flex items-center">
                    <MdKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                    <Input
                        type={this.state.showPassword ? "text" : "password"}
                        placeholder="minimal 8 karakter"
                        value={this.state.password}
                        onChange={this.onPasswordChangeHandler}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#3D2357]"
                        onClick={this.showPasswordHandler}
                    >
                        {this.state.showPassword ? <FiEyeOff /> : <FiEye />}
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
                        text="Buat password baru" />
                </div>
            </form>
        );
    }
}

export default FormNewPasswordWithRouter;