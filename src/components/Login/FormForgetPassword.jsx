import React from "react";
import Button from "./Button";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";


const FormForgetPasswordWithRouter = (props) => {
    const navigate = useNavigate();
    return <FormLogin {...props} navigate={navigate} />;
}


class FormLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
        };

        this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
        this.onBackButtonClickHandler = this.onBackButtonClickHandler.bind(this);
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

    render() {
        return (
            <form className="w-96 text-sm font-dm-sans flex flex-col justify-center bg-[#3D2357] p-10 gap-3 rounded-md backdrop-blur-md [box-shadow:0_0_10px_5px_#AC6871,_0_0_20px_5px_#AC6871_inset]">
                <div className="flex flex-row items-center gap-[75px]">
                    <p className="text-[#E4CCCF] text-xl font-bold font-playfair leading-normal input-text-glow cursor-pointer" onClick={this.onBackButtonClickHandler}>←</p>
                    <h2 className="text-[#E4CCCF] text-xl font-semibold text-center font-playfair input-text-glow " >
                        Lupa Password
                    </h2>
                </div>
                <div className="relative">
                    <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                    <Input
                        type="email"
                        placeholder="email"
                        value={this.state.email}
                        onChange={this.onEmailChangeHandler}
                    />
                </div>
                <Button
                    classname=" w-full custom-button-bg p-2 text-white rounded-md transition-all duration-300 hover:shadow-[0_0_10px_5px_rgba(209,107,165,0.2)] hover:brightness-110 cursor-pointer"
                    type="submit"
                    text="Reset Passowrd" />

            </form>
        );
    }
}

export default FormForgetPasswordWithRouter;