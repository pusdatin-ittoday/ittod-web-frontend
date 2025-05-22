import React from "react";
import Button from "../Login/Button";
import Input from "../Login/Input";
import Alert from "../Login/Alert";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdEmail, MdKey } from "react-icons/md";
import { loginAdmin } from "../../api/admin"; 

const FormLoginAdminWithRouter = (props) => {
  const navigate = useNavigate();
  return <FormLoginAdmin {...props} navigate={navigate} />;
};

class FormLoginAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showPassword: false,
      errorMessage: "",
    };

    this.onEmailChangeHandler = this.onEmailChangeHandler.bind(this);
    this.onPasswordChangeHandler = this.onPasswordChangeHandler.bind(this);
    this.showPasswordHandler = this.showPasswordHandler.bind(this);
    this.handleRegisterClick = this.handleRegisterClick.bind(this);
    this.forgetPasswordHandler = this.forgetPasswordHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onEmailChangeHandler(e) {
    this.setState({ email: e.target.value });
  }

  onPasswordChangeHandler(e) {
    this.setState({ password: e.target.value });
  }

  showPasswordHandler() {
    this.setState((prev) => ({ showPassword: !prev.showPassword }));
  }

  handleRegisterClick() {
    this.props.navigate("/AdminRegister");
  }

  forgetPasswordHandler(e) {
    e.preventDefault();
    this.props.navigate("/AdminForgetPassword");
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({ errorMessage: "Email dan Password harus diisi!" });
      this.errorTimeout = setTimeout(() => {
        this.setState({ errorMessage: "" });
      }, 3000);
      return;
    }

    try {
      const response = await loginAdmin(email, password);
      const data = response.data;

      if (data.user?.role === "admin") {
        localStorage.setItem("adminToken", data.token || "");
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        this.props.navigate("/AdminVerifyTeamView");
      } else {
        this.setState({ errorMessage: "Akses ditolak. Bukan admin." });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login gagal";
      this.setState({ errorMessage: msg });
      this.errorTimeout = setTimeout(() => {
        this.setState({ errorMessage: "" });
      }, 3000);
    }
  }

  componentWillUnmount() {
    if (this.errorTimeout) clearTimeout(this.errorTimeout);
  }

  render() {
    const { email, password, showPassword, errorMessage } = this.state;

    return (
      <form
        onSubmit={this.handleSubmit}
        className="w-80 lg:w-96 font-dm-sans flex flex-col justify-center bg-[#3D2357] p-10 gap-3 rounded-md backdrop-blur-md [box-shadow:0_0_10px_5px_#AC6871,_0_0_20px_5px_#AC6871_inset]"
      >
        <Alert message={errorMessage} />

        <div className="relative">
          <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D2357] text-xl" />
          <Input
            type="email"
            placeholder="email"
            value={email}
            onChange={this.onEmailChangeHandler}
          />
        </div>

        <div className="relative flex items-center">
          <MdKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D2357] text-xl" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            value={password}
            onChange={this.onPasswordChangeHandler}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#3D2357]"
            onClick={this.showPasswordHandler}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <Button
          classname="text-xs text-left cursor-pointer hover:underline"
          type="button"
          text="Lupa Password Admin?"
          onClick={this.forgetPasswordHandler}
        />

        <div className="w-full flex flex-col gap-4">
          <Button
            classname="w-full custom-button-bg p-2 text-white rounded-md transition-all duration-300 hover:shadow-[0_0_10px_5px_rgba(209,107,165,0.2)] hover:brightness-110 cursor-pointer"
            type="submit"
            text="Login"
          />

          <p className="text-center text-xs">
            Belum punya akun Admin?{" "}
            <span
              className="text-xs text-[#F97283] hover:underline font-bold cursor-pointer"
              onClick={this.handleRegisterClick}
            >
              Registrasi
            </span>
          </p>
        </div>
      </form>
    );
  }
}

export default FormLoginAdminWithRouter;
