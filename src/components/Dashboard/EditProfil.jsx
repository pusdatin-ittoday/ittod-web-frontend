import React, { Component } from "react";
import { MdDriveFileRenameOutline, MdErrorOutline, MdClose } from "react-icons/md"; // Added MdErrorOutline, MdClose
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
            pendidikan_lainnya: "", // Tambahan untuk 'lainnya'
            nama_sekolah: "",
            KTM: null,
            // NEW state variables for error handling
            showErrorBox: false,
            errorFields: [],
        };
        // Mapping state keys to user-friendly labels
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

    handleChange = (e) => {
        const { name, type, value, files } = e.target;
        // If the field being changed is one of the error fields,
        // optionally remove it from the error list or hide the box immediately.
        // For simplicity, we'll just let the next submit re-validate.
        this.setState({ [name]: type === "file" ? files[0] : value });

        // Optionally hide error box on any change
        // if (this.state.showErrorBox) {
        //   this.setState({ showErrorBox: false, errorFields: [] });
        // }
    };

    handleFileChange = (file) => {
         if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
             this.setState({ KTM: file });
         } else if (file) { // Check if a file was actually selected/dropped
             alert("Ukuran file maksimal 2MB.");
             // Clear the invalid file selection if possible (depends on how you handle the file input)
             if (this.fileInput) {
                 this.fileInput.value = ""; // Attempt to clear the native input
             }
             this.setState({ KTM: null }); // Ensure state reflects no valid file
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
            KTM
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
            KTM, // Check if null
        };

        for (const key in fieldsToValidate) {
            // Check for empty strings or null (for KTM file)
            if (fieldsToValidate[key] === "" || fieldsToValidate[key] === null) {
                 // Use the mapping to get user-friendly name
                emptyFieldsList.push(this.fieldLabels[key]);
            }
        }

        // Special validation for 'pendidikan_lainnya'
        if (pendidikan === "lainnya" && (!pendidikan_lainnya || pendidikan_lainnya.trim() === "")) {
             if (!emptyFieldsList.includes(this.fieldLabels.pendidikan_lainnya)) { // Avoid duplicates if 'pendidikan' was already empty
                 emptyFieldsList.push(this.fieldLabels.pendidikan_lainnya);
             }
             // Also ensure the main 'pendidikan' field itself isn't marked empty if 'lainnya' was selected
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
            // TODO: Add your actual form submission logic here (e.g., API call)
        }
    };

    // Function to close the error box
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
            // Get error state
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

        return (
            <div className="flex items-center justify-center relative"> {/* Added relative positioning for the error box context */}
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
                                type="text" // Consider type="tel" for better mobile UX
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
                                {/* No icon needed here, maybe? */}
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
                        {/* Adjust grid span if 'lainnya' is not selected and causing layout shift */}
                        <div className={`mb-3 relative ${pendidikan !== 'lainnya' ? 'lg:col-start-2' : ''}`}> {/* Simple adjustment */}
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
                            <label className="block text-sm font-bold mb-2">Kartu Institusi (jpg/png, max 2MB)</label>
                            <div
                                className={`border-2 border-dashed ${errorFields.includes(this.fieldLabels.KTM) ? 'border-red-500' : 'border-pink-400'} rounded-md p-6 text-center ${errorFields.includes(this.fieldLabels.KTM) ? 'bg-red-100' : 'bg-gray-100'} text-gray-800 cursor-pointer w-full min-h-24 flex items-center justify-center`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={this.handleFileDrop} // Use consolidated handler
                                onClick={() => this.fileInput && this.fileInput.click()} // Check if ref exists
                            >
                                <div className="w-full overflow-hidden text-ellipsis">
                                    {KTM ? <p className="truncate">{KTM.name}</p> : <p>Drop file di sini atau klik untuk pilih file</p>}
                                </div>
                                <input
                                    type="file"
                                    name="KTM" // Name is less relevant here as we handle file in state
                                    accept=".jpg,.jpeg,.png"
                                    ref={(ref) => (this.fileInput = ref)}
                                    onChange={this.handleFileInputChange} // Use consolidated handler
                                    style={{ display: "none" }}
                                />
                            </div>
                            {errorFields.includes(this.fieldLabels.KTM) && <p className="text-red-300 text-xs mt-1">File Kartu Institusi wajib diunggah.</p>}
                        </div>

                        {/* Tombol */}
                        <div className="col-span-full flex justify-end mt-6">
                            <Link
                                to="/dashboard" // Ensure this route exists in your routing setup
                                className="bg-gray-300 hover:bg-gray-400 transition duration-300 ease-in-out hover:scale-105 text-black px-4 py-2 rounded mr-2"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                className="custom-button-bg text-white button-hover transition duration-300 ease-in-out hover:scale-105 px-4 py-2 rounded cursor-pointer" // Make sure custom-button-bg and button-hover classes are defined in your CSS
                                
                            >
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>

                {/* Error Notification Box */}
                {showErrorBox && (
                    <div
                        className="fixed bottom-5 right-5 bg-red-600 text-white p-4 rounded-lg shadow-lg max-w-xs w-full z-50" // Added z-index
                        role="alert"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <MdErrorOutline className="text-xl mr-2" />
                                <span className="font-bold">Harap isi kolom berikut:</span>
                            </div>
                            <button onClick={this.closeErrorBox} className="text-xl font-bold hover:text-red-200">&times;</button>
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