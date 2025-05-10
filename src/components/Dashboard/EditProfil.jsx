import React, { Component } from "react";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { CiCalendarDate, CiPhone } from "react-icons/ci";
import { PiGenderIntersex } from "react-icons/pi";
import { IoIosMale, IoIosFemale } from "react-icons/io";
import { BsLine } from "react-icons/bs";
import { FaDiscord, FaInstagram } from "react-icons/fa";
import { IoMdSchool } from "react-icons/io";
import { FaSchool } from "react-icons/fa6";
import { Link } from "react-router-dom";

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            full_name: "",
            birth_date: "",
            phone_number: "",
            jenis_kelamin: "",
            id_line: "",
            id_discord: "",
            id_instagram: "",
            pendidikan: "",
            nama_sekolah: "",
            KTM: null,
            showUploadModal: false,
        };
    }

    handleChange = (e) => {
        const { name, type, value, files } = e.target;
        this.setState({ [name]: type === "file" ? files[0] : value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Data:", this.state);
    };

    toggleUploadModal = () => {
        this.setState((prevState) => ({
            showUploadModal: !prevState.showUploadModal,
        }));
    };

    render() {
        const {
            full_name,
            birth_date,
            phone_number,
            jenis_kelamin,
            id_line,
            id_discord,
            id_instagram,
            pendidikan,
            nama_sekolah,
            KTM
        } = this.state;

        let genderIcon;
        if (jenis_kelamin === "L") {
            genderIcon = <IoIosMale className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />;
        } else if (jenis_kelamin === "P") {
            genderIcon = <IoIosFemale className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />;
        } else {
            genderIcon = <PiGenderIntersex className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />;
        }

        return (
            <div className="flex bg-[#302044] items-center justify-center">
                <div className="bg-[#7b446c] mx-auto my-20 p-6 rounded-md shadow-md text-white w-full max-w-4xl">
                    <h1 className="text-2xl font-bold mb-6 text-center">Edit Profil</h1>
                    <form
                        onSubmit={this.handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 font-dm-sans"
                    >
                        {/* Data Pribadi */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Data Diri</h2>

                            <div className="mb-3 relative">
                                <label className="block text-sm font-bold mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    placeholder="Nama Lengkap"
                                    value={full_name}
                                    onChange={this.handleChange}
                                    className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
                                />
                            </div>

                            <div className="mb-3 relative">
                                <label className="block text-sm font-bold mb-2">Tanggal Lahir</label>
                                <CiCalendarDate className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={birth_date}
                                    onChange={this.handleChange}
                                    className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
                                />
                            </div>

                            <div className="mb-3 relative">
                                <label className="block text-sm font-bold mb-2">Nomor HP</label>
                                <CiPhone className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                                <input
                                    type="text"
                                    name="phone_number"
                                    placeholder="Nomor HP"
                                    value={phone_number}
                                    onChange={this.handleChange}
                                    className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
                                />
                            </div>

                            <div className="mb-3 relative">
                                <label className="block text-sm font-bold mb-2">Jenis Kelamin</label>
                                {genderIcon}
                                <select
                                    name="jenis_kelamin"
                                    value={jenis_kelamin}
                                    onChange={this.handleChange}
                                    className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
                                >
                                    <option value="">Pilih</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>

                            <div className="mb-3 relative">
                                <label className="block text-sm font-bold mb-2">ID Line</label>
                                <BsLine className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                                <input
                                    type="text"
                                    name="id_line"
                                    placeholder="ID Line"
                                    value={id_line}
                                    onChange={this.handleChange}
                                    className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
                                />
                            </div>
                            <div className="mb-3 relative">
                                <label className="block text-sm font-bold mb-2">ID Discord</label>
                                <FaDiscord className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                                <input
                                    type="text"
                                    name="id_discord"
                                    placeholder="ID Discord"
                                    value={id_discord}
                                    onChange={this.handleChange}
                                    className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
                                />
                            </div>
                            <div className="mb-3 relative">
                                <label className="block text-sm font-bold mb-2">ID Instagram</label>
                                <FaInstagram className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                                <input
                                    type="text"
                                    name="id_instagram"
                                    placeholder="ID Instagram"
                                    value={id_instagram}
                                    onChange={this.handleChange}
                                    className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
                                />
                            </div>
                        </div>

                        {/* Data Institusi */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Data Institusi</h2>

                            <div className="mb-3 relative">
                                <label className="block text-sm font-bold mb-2">Status Pendidikan</label>
                                <IoMdSchool className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                                <select
                                    name="pendidikan"
                                    value={pendidikan}
                                    onChange={this.handleChange}
                                    className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
                                >
                                    <option value="">Pilih</option>
                                    <option value="sma">SMA/SMK</option>
                                    <option value="mahasiswa">Mahasiswa</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                            </div>

                            <div className="mb-3 relative">
                                <label className="block text-sm font-bold mb-2">Nama Sekolah/Institusi</label>
                                <FaSchool className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                                <input
                                    type="text"
                                    name="nama_sekolah"
                                    placeholder="Nama Sekolah/Institusi"
                                    value={nama_sekolah}
                                    onChange={this.handleChange}
                                    className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-bold mb-2">Kartu Institusi (jpg/png, max 2MB)</label>
                                <div
                                    className="border-2 border-dashed border-pink-400 rounded-md p-6 text-center bg-gray-100 text-gray-800 cursor-pointer w-full min-h-24 flex items-center justify-center"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const file = e.dataTransfer.files[0];
                                        if (file && file.size <= 2 * 1024 * 1024) {
                                            this.setState({ KTM: file });
                                        } else {
                                            alert("Ukuran file maksimal 2MB.");
                                        }
                                    }}
                                    onClick={() => this.fileInput.click()}
                                >
                                    <div className="w-full overflow-hidden text-ellipsis">
                                        {KTM ? <p className="truncate">{KTM.name}</p> : <p>Drop file di sini atau klik untuk pilih file</p>}
                                    </div>
                                    <input
                                        type="file"
                                        name="KTM"
                                        accept=".jpg,.jpeg,.png"
                                        ref={(ref) => (this.fileInput = ref)}
                                        onChange={this.handleChange}
                                        style={{ display: "none" }}
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="col-span-2 flex justify-between mt-6">
                            <a href="/change-password" className="text-blue-500">
                                Ganti password? <u>klik disini</u>
                            </a>
                            <div>
                                <Link
                                    to="/dashboard"
                                    type="button" 
                                    className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                                    
                                    >
                                    Batal
                                </Link>
                                <button type="submit" className="custom-button-bg text-white button-hover transition duration-300 ease-in-out hover:scale-105 px-4 py-2 rounded">
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default EditProfile;