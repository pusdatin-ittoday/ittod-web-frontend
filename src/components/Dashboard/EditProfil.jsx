import React, { Component } from "react";
import { MdDriveFileRenameOutline, MdErrorOutline } from "react-icons/md";
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
            pendidikan_lainnya: "",
            nama_sekolah: "",
            KTM: null,
            showErrorBox: false,
            errorFields: [],
            ktmFileName: "", // To store filename of previously uploaded KTM
        };

        this.fieldLabels = {
            full_name: "Nama Lengkap",
            birth_date: "Tanggal Lahir",
            phone_number: "Nomor HP",
            jenis_kelamin: "Jenis Kelamin",
            id_line: "ID Line",
            id_discord: "ID Discord",
            id_instagram: "ID Instagram",
            pendidikan: "Status Pendidikan",
            pendidikan_lainnya: "Status Pendidikan Lainnya",
            nama_sekolah: "Nama Sekolah/Institusi",
            KTM: "Kartu Institusi",
        };
    }

    componentDidMount() {
        // Load user data from sessionStorage when component mounts
        this.loadUserData();
    }

    loadUserData = () => {
        try {
            const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
            
            // Extract pendidikan data and determine if it's "lainnya"
            let pendidikan = userData.pendidikan || "";
            let pendidikan_lainnya = "";
            
            // Check if pendidikan is one of the standard options
            if (pendidikan && !["sma", "mahasiswa", "lainnya"].includes(pendidikan)) {
                pendidikan_lainnya = pendidikan;
                pendidikan = "lainnya";
            }
            
            // Update state with retrieved data
            this.setState({
                full_name: userData.name || "",
                birth_date: userData.birth_date || "",
                phone_number: userData.phone_number || "",
                jenis_kelamin: userData.jenis_kelamin || "",
                id_line: userData.id_line || "",
                id_discord: userData.id_discord || "",
                id_instagram: userData.id_instagram || "",
                pendidikan: pendidikan,
                pendidikan_lainnya: pendidikan_lainnya,
                nama_sekolah: userData.nama_sekolah || "",
                ktmFileName: userData.ktmFileName || "", // Filename of the previously uploaded KTM
            });
            
            console.log("User data loaded from sessionStorage:", userData);
        } catch (error) {
            console.error("Error loading user data from sessionStorage:", error);
        }
    };

    handleChange = (e) => {
        const { name, type, value, files } = e.target;
        this.setState({ [name]: type === "file" ? files[0] : value });
    };

    handleFileChange = (file) => {
        if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
            this.setState({ 
                KTM: file,
                ktmFileName: file.name // Update filename in state
            });
        } else if (file) {
            alert("Ukuran file maksimal 2MB.");
            if (this.fileInput) {
                this.fileInput.value = "";
            }
            // Don't clear KTM state if there was a previous valid file
        }
    }

    handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        this.handleFileChange(file);
    }

    handleFileInputChange = (e) => {
        const file = e.target.files[0];
        this.handleFileChange(file);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {
            full_name,
            birth_date,
            phone_number,
            jenis_kelamin,
            id_line,
            id_discord,
            id_instagram,
            pendidikan,
            pendidikan_lainnya,
            nama_sekolah,
            KTM,
            ktmFileName
        } = this.state;

        const emptyFieldsList = [];

        // --- Validation ---
        const fieldsToValidate = {
            full_name,
            birth_date,
            phone_number,
            jenis_kelamin,
            id_line,
            id_discord,
            id_instagram,
            pendidikan,
            nama_sekolah,
        };

        // Only validate KTM as required if it's a new user without existing KTM
        if (!ktmFileName && !KTM) {
            fieldsToValidate.KTM = null;
        }

        for (const key in fieldsToValidate) {
            if (fieldsToValidate[key] === "" || fieldsToValidate[key] === null) {
                emptyFieldsList.push(this.fieldLabels[key]);
            }
        }

        // Special validation for 'pendidikan_lainnya'
        if (pendidikan === "lainnya" && (!pendidikan_lainnya || pendidikan_lainnya.trim() === "")) {
            if (!emptyFieldsList.includes(this.fieldLabels.pendidikan_lainnya)) {
                emptyFieldsList.push(this.fieldLabels.pendidikan_lainnya);
            }
            const pendidikanIndex = emptyFieldsList.indexOf(this.fieldLabels.pendidikan);
            if (pendidikanIndex > -1 && pendidikan !== "") {
                emptyFieldsList.splice(pendidikanIndex, 1);
            }
        }

        // --- Update State Based on Validation ---
        if (emptyFieldsList.length > 0) {
            this.setState({
                showErrorBox: true,
                errorFields: emptyFieldsList,
            });
        } else {
            // All fields are filled, proceed with submission logic
            this.setState({
                showErrorBox: false,
                errorFields: [],
            });

            console.log("Form Submitted Successfully!");
            console.log("Submitted Data:", this.state);

            // Save user data to sessionStorage
            const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
            
            // Update userData with form data
            const updatedUserData = {
                ...userData,
                name: full_name,
                birth_date,
                phone_number,
                jenis_kelamin,
                id_line,
                id_discord,
                id_instagram,
                pendidikan: pendidikan === "lainnya" ? pendidikan_lainnya : pendidikan,
                nama_sekolah,
                ktmFileName: KTM ? KTM.name : ktmFileName, // Save the filename of the KTM
            };
            
            sessionStorage.setItem("userData", JSON.stringify(updatedUserData));

            // If there's a new KTM file, you might want to handle it differently
            // For example, you might want to upload it to a server
            // But for now, we'll just store its filename in sessionStorage
            
            // Set flag for profile completion
            sessionStorage.setItem("profileUpdateStatus", "success");
            sessionStorage.setItem("profileComplete", "true");

            window.location.href = "/beranda"; // Redirect to dashboard after submission
        }
    };

    closeErrorBox = () => {
        this.setState({ showErrorBox: false, errorFields: [] });
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
            pendidikan_lainnya,
            nama_sekolah,
            KTM,
            ktmFileName,
            showErrorBox,
            errorFields
        } = this.state;

        let genderIcon;
        if (jenis_kelamin === "L") {
            genderIcon = <IoIosMale className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />;
        } else if (jenis_kelamin === "P") {
            genderIcon = <IoIosFemale className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />;
        } else {
            genderIcon = <PiGenderIntersex className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />;
        }

        // Determine what to display in the KTM upload area
        const ktmDisplayText = KTM ? KTM.name : (ktmFileName || "Drop file di sini atau klik untuk pilih file");

        return (
            <div className="flex items-center justify-center relative">
                <div className="min-h-screen bg-[#7b446c] mx-10 lg:mx-auto lg:my-20 p-6 rounded-md shadow-md text-white w-full max-w-4xl">
                    <h1 className="text-2xl font-bold mb-6 text-center">Edit Profil</h1>
                    <form
                        onSubmit={this.handleSubmit}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-dm-sans"
                    >
                        <h2 className="text-lg font-semibold mb-4 col-span-full">Data Diri</h2>

                        {/* Nama Lengkap */}
                        <div className="mb-3 relative">
                            <label className="block text-sm font-bold mb-2">Nama Lengkap</label>
                            <MdDriveFileRenameOutline className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                            <input
                                type="text"
                                name="full_name"
                                placeholder="Nama Lengkap"
                                value={full_name}
                                onChange={this.handleChange}
                                className={`pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.full_name) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                            />
                        </div>

                        {/* Tanggal Lahir */}
                        <div className="mb-3 relative">
                            <label className="block text-sm font-bold mb-2">Tanggal Lahir</label>
                            <CiCalendarDate className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                            <input
                                type="date"
                                name="birth_date"
                                value={birth_date}
                                onChange={this.handleChange}
                                className={`pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.birth_date) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                            />
                        </div>

                        {/* Nomor HP */}
                        <div className="mb-3 relative">
                            <label className="block text-sm font-bold mb-2">Nomor HP</label>
                            <CiPhone className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                            <input
                                type="text"
                                name="phone_number"
                                placeholder="Nomor HP"
                                value={phone_number}
                                onChange={this.handleChange}
                                className={`pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.phone_number) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                            />
                        </div>

                        {/* Jenis Kelamin */}
                        <div className="mb-3 relative">
                            <label className="block text-sm font-bold mb-2">Jenis Kelamin</label>
                            {genderIcon}
                            <select
                                name="jenis_kelamin"
                                value={jenis_kelamin}
                                onChange={this.handleChange}
                                className={`pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.jenis_kelamin) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                            >
                                <option value="">Pilih</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>

                        {/* ID Line */}
                        <div className="mb-3 relative">
                            <label className="block text-sm font-bold mb-2">ID Line</label>
                            <BsLine className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                            <input
                                type="text"
                                name="id_line"
                                placeholder="ID Line"
                                value={id_line}
                                onChange={this.handleChange}
                                className={`pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.id_line) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                            />
                        </div>

                        {/* ID Discord */}
                        <div className="mb-3 relative">
                            <label className="block text-sm font-bold mb-2">ID Discord</label>
                            <FaDiscord className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                            <input
                                type="text"
                                name="id_discord"
                                placeholder="ID Discord"
                                value={id_discord}
                                onChange={this.handleChange}
                                className={`pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.id_discord) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                            />
                        </div>

                        {/* ID Instagram */}
                        <div className="mb-3 relative">
                            <label className="block text-sm font-bold mb-2">ID Instagram</label>
                            <FaInstagram className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                            <input
                                type="text"
                                name="id_instagram"
                                placeholder="ID Instagram"
                                value={id_instagram}
                                onChange={this.handleChange}
                                className={`pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.id_instagram) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                            />
                        </div>

                        {/* Data Institusi Section */}
                        <h2 className="text-lg font-semibold mt-4 mb-4 col-span-full">Data Institusi</h2>

                        {/* Pendidikan */}
                        <div className="mb-3 relative">
                            <label className="block text-sm font-bold mb-2">Status Pendidikan</label>
                            <IoMdSchool className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                            <select
                                name="pendidikan"
                                value={pendidikan}
                                onChange={this.handleChange}
                                className={`pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.pendidikan) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                            >
                                <option value="">Pilih</option>
                                <option value="sma">SMA/SMK</option>
                                <option value="mahasiswa">Mahasiswa</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                        </div>

                        {/* Conditional field for 'lainnya' */}
                        {pendidikan === "lainnya" && (
                            <div className="mb-3 relative">
                                <label className="block text-sm font-bold mb-2">Tulis Status Pendidikan Anda</label>
                                <input
                                    type="text"
                                    name="pendidikan_lainnya"
                                    placeholder="Contoh: Fresh graduate, sedang kerja, dll"
                                    value={pendidikan_lainnya}
                                    onChange={this.handleChange}
                                    className={`py-2 px-4 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.pendidikan_lainnya) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                                />
                            </div>
                        )}

                        {/* Nama Sekolah */}
                        <div className={`mb-3 relative ${pendidikan !== 'lainnya' ? 'lg:col-start-2' : ''}`}>
                            <label className="block text-sm font-bold mb-2">Nama Sekolah/Institusi</label>
                            <FaSchool className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                            <input
                                type="text"
                                name="nama_sekolah"
                                placeholder="Nama Sekolah/Institusi"
                                value={nama_sekolah}
                                onChange={this.handleChange}
                                className={`pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.nama_sekolah) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                            />
                        </div>

                        {/* Upload KTM */}
                        <div className="mb-3 col-span-full">
                            <label className="block text-sm font-bold mb-2">
                                Kartu Institusi (jpg/png, max 2MB)
                                {ktmFileName && !KTM && (
                                    <span className="text-sm font-normal ml-2 text-gray-300">
                                        (File yang telah diunggah: {ktmFileName})
                                    </span>
                                )}
                            </label>
                            <div
                                className={`border-2 border-dashed ${errorFields.includes(this.fieldLabels.KTM) ? 'border-red-500' : 'border-pink-400'} rounded-md p-6 text-center ${errorFields.includes(this.fieldLabels.KTM) ? 'bg-red-100' : 'bg-gray-100'} text-gray-800 cursor-pointer w-full min-h-24 flex items-center justify-center`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={this.handleFileDrop}
                                onClick={() => this.fileInput && this.fileInput.click()}
                            >
                                <div className="w-full overflow-hidden text-ellipsis">
                                    <p className="truncate">{ktmDisplayText}</p>
                                </div>
                                <input
                                    type="file"
                                    name="KTM"
                                    accept=".jpg,.jpeg,.png"
                                    ref={(ref) => (this.fileInput = ref)}
                                    onChange={this.handleFileInputChange}
                                    style={{ display: "none" }}
                                />
                            </div>
                            {errorFields.includes(this.fieldLabels.KTM) && (
                                <p className="text-red-300 text-xs mt-1">File Kartu Institusi wajib diunggah.</p>
                            )}
                        </div>

                        {/* Tombol */}
                        <div className="col-span-full flex justify-end mt-6">
                            <Link
                                to="/dashboard"
                                className="bg-gray-300 hover:bg-gray-400 transition duration-300 ease-in-out hover:scale-105 text-black px-4 py-2 rounded mr-2"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                className="custom-button-bg text-white button-hover transition duration-300 ease-in-out hover:scale-105 px-4 py-2 rounded cursor-pointer"
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>

                {/* Error Notification Box */}
                {showErrorBox && (
                    <div
                        className="fixed bottom-5 right-5 bg-red-600/90 text-white p-4 rounded-lg shadow-lg max-w-xs w-full z-50"
                        role="alert"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <MdErrorOutline className="text-xl mr-2" />
                                <span className="font-bold">Harap isi kolom berikut:</span>
                            </div>
                            <button onClick={this.closeErrorBox} className="bg-red-700/85 hover:bg-red-800/85 rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <ul className="list-disc list-inside text-sm">
                            {errorFields.map((field, index) => (
                                <li key={index}>{field}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
}

export default EditProfile;