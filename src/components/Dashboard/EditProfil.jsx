import React, { Component } from "react";
import { MdDriveFileRenameOutline, MdErrorOutline } from "react-icons/md";
import { CiCalendarDate, CiPhone } from "react-icons/ci";
import { PiGenderIntersex } from "react-icons/pi";
import { IoIosMale, IoIosFemale } from "react-icons/io";
import { BsLine } from "react-icons/bs";
import { FaDiscord, FaInstagram } from "react-icons/fa";
import { IoMdSchool } from "react-icons/io";
import { FaSchool } from "react-icons/fa6";
import { FaAddressCard } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaImage } from "react-icons/fa";
import instance from "../../api/axios";
import { getImageUrlFromR2 } from "../../api/user";

// Helper to get original filename from R2 key
const getOriginalFileName = (key) => {
    if (!key) return "";
    const parts = key.split("_");
    // Remove the UUID part, join the rest (handles underscores in filenames)
    return parts.slice(1).join("_");
};

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
            showErrorBox: false,
            twibbon: null,
            errorFields: [],
            twibbonFileName: "",
            ktmFileName: "",
            showProgressRestoredMessage: false,
            ktmChanged: false,
            twibbonChanged: false
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
            nama_sekolah: "Nama Sekolah/Institusi",
            KTM: "Kartu Institusi",
            twibbon: "Twibbon"
        };
        this.twibbonInputRef = React.createRef();
    }

    componentDidMount() {
        this.loadUserData();
    }

    loadUserData = async () => {
        try {
            const response = await instance.get('/api/user');
            const userData = response.data;

            // Simply use pendidikan as-is
            let pendidikan = userData.pendidikan || "";

            // Format birth_date if it exists
            let formattedBirthDate = "";
            if (userData.birth_date) {
                if (/^\d{4}-\d{2}-\d{2}$/.test(userData.birth_date)) {
                    formattedBirthDate = userData.birth_date;
                } else {
                    try {
                        const date = new Date(userData.birth_date);
                        if (!isNaN(date.getTime())) {
                            formattedBirthDate = date.toISOString().split('T')[0];
                        }
                    } catch (e) {
                        console.error("Error formatting birth date:", e);
                    }
                }
            }

            this.setState({
                full_name: userData.full_name || "",
                birth_date: formattedBirthDate,
                phone_number: userData.phone_number || "",
                jenis_kelamin: userData.jenis_kelamin || "",
                id_line: userData.id_line || "",
                id_discord: userData.id_discord || "",
                id_instagram: userData.id_instagram || "",
                pendidikan: pendidikan,
                nama_sekolah: userData.nama_sekolah || "",
                ktmFileName: userData.ktm_key || "",
                twibbonFileName: userData.twibbon_key || "",
                KTM: null,         // reset file state
                twibbon: null,     // reset file state
                isLoading: false
            });

            console.log("User data loaded from API:", userData);
        } catch (error) {
            console.error("Error loading data:", error);
            this.setState({
                error: "Failed to load user data",
                isLoading: false
            });
        }
    };

    clearFormProgress = () => {
        localStorage.removeItem('formProgress');
    };

    handleTwibbonFileChange = (file) => {
        if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
            this.setState({
                twibbon: file,
                twibbonChanged: true
            }, () => {
                this.saveFormProgress();
            });
        } else if (file) {
            alert("Ukuran file maksimal 2MB.");
            if (this.twibbonInputRef.current) {
                this.twibbonInputRef.current.value = "";
            }
        }
    }

    handleTwibbonFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        this.handleTwibbonFileChange(file);
    }

    handleTwibbonFileInputChange = (e) => {
        const file = e.target.files[0];
        this.handleTwibbonFileChange(file);
    }

    saveFormProgress = () => {
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
            ktmFileName,
            twibbonFileName
        } = this.state;

        // Save all non-file data
        const formProgress = {
            full_name,
            birth_date,
            phone_number,
            jenis_kelamin,
            id_line,
            id_discord,
            id_instagram,
            pendidikan,
            nama_sekolah,
            twibbonFileName,
            ktmFileName,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('formProgress', JSON.stringify(formProgress));
    };

    handleChange = (e) => {
        const { name, type, value, files } = e.target;

        // Use type to determine the value to set
        const newValue = type === "file" ? files[0] : value;

        this.setState({
            [name]: newValue
        }, () => {
            // Save current state to localStorage after each change
            this.saveFormProgress();
        });
    };
    handleFileChange = (file) => {
        if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
            this.setState({
                KTM: file,
                ktmChanged: true
            }, () => {
                this.saveFormProgress();
            });
        } else if (file) {
            alert("Ukuran file maksimal 2MB.");
            if (this.fileInput) {
                this.fileInput.value = "";
            }
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

    // Add a helper function to check upload status
    checkUploadStatus = () => {
        const { KTM, ktmFileName, twibbon, twibbonFileName } = this.state;

        return {
            ktmMissing: !KTM && !ktmFileName,
            twibbonMissing: !twibbon && !twibbonFileName
        };
    }

    handleSubmit = async (e) => {
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
            nama_sekolah,
            KTM,
            ktmFileName,
            twibbon,
            twibbonFileName,
            ktmChanged,
            twibbonChanged
        } = this.state;

        // Check upload status
        const uploadStatus = this.checkUploadStatus();

        const emptyFieldsList = [];

        // Validation
        const fieldsToValidate = {
            full_name,
            birth_date,
            phone_number,
            id_line,
            id_discord,
            id_instagram,
            pendidikan,
            nama_sekolah,
        };

        // Validate jenis_kelamin: must be "laki2" or "perempuan"
        if (jenis_kelamin !== "laki2" && jenis_kelamin !== "perempuan") {
            emptyFieldsList.push(this.fieldLabels.jenis_kelamin);
        }

        // Validate KTM if no file is selected AND no existing file
        if (uploadStatus.ktmMissing) {
            fieldsToValidate.KTM = "";
        }

        // Validate Twibbon if no file is selected AND no existing file
        if (uploadStatus.twibbonMissing) {
            fieldsToValidate.twibbon = "";
        }

        // Check other required fields
        for (const key in fieldsToValidate) {
            if (fieldsToValidate[key] === "" || fieldsToValidate[key] === null) {
                emptyFieldsList.push(this.fieldLabels[key]);
            }
        }

        if (emptyFieldsList.length > 0) {
            this.setState({
                showErrorBox: true,
                errorFields: emptyFieldsList,
            });
            return;
        }

        try {
            // 1. Submit profile data and KTM (if changed)
            const formData = new FormData();
            if (full_name) formData.append('full_name', full_name);
            if (birth_date) formData.append('birth_date', birth_date);
            if (phone_number) formData.append('phone_number', phone_number);
            if (jenis_kelamin) formData.append('jenis_kelamin', jenis_kelamin);
            if (id_line) formData.append('id_line', id_line);
            if (id_discord) formData.append('id_discord', id_discord);
            if (id_instagram) formData.append('id_instagram', id_instagram);
            if (pendidikan) {
                formData.append('pendidikan', pendidikan);
            }
            if (nama_sekolah) formData.append('nama_sekolah', nama_sekolah);

            // Only append KTM if it's changed
            if (KTM && ktmChanged) {
                formData.append('profileImage', KTM);
            }

            const response = await instance.patch('/api/user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // 2. If Twibbon changed, upload it separately to the twibbon API
            if (twibbon && twibbonChanged) {
                const twibbonForm = new FormData();
                twibbonForm.append('userTwibbon', twibbon);

                try {
                    const twibbonResponse = await instance.put('/api/user/twibbon', twibbonForm, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } catch (twibbonError) {
                    console.error("❌ Twibbon upload failed:", twibbonError);
                    console.error("Twibbon error response:", twibbonError.response?.data);
                    // Continue with the rest of the process even if twibbon fails
                }
            }

            // Save user data to sessionStorage
            if (response.data.success || response.data.message?.includes('success')) {
                const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
                const updatedUserData = {
                    ...userData,
                    full_name: full_name,
                    birth_date,
                    phone_number,
                    jenis_kelamin,
                    id_line,
                    id_discord,
                    id_instagram,
                    pendidikan: pendidikan,
                    nama_sekolah
                };
                sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
                sessionStorage.setItem("profileUpdateStatus", "success");
                sessionStorage.setItem("profileComplete", "true");
                this.clearFormProgress();
                window.location.href = "/dashboard/beranda";
            } else {
                throw new Error(response.data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("❌ Error updating profile:", error);
            console.error("Error response:", error.response?.data);
            this.setState({
                showErrorBox: true,
                errorFields: [error.response?.data?.message || "Failed to update profile. Please try again."]
            });
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
            nama_sekolah,
            KTM,
            twibbon,
            twibbonFileName,
            ktmFileName,
            showErrorBox,
            errorFields,
            isLoading,
            error
        } = this.state;

        if (isLoading) {
            return (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                </div>
            );
        }

        let genderIcon;
        if (jenis_kelamin === "laki2") {
            genderIcon = <IoIosMale className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />;
        } else if (jenis_kelamin === "perempuan") {
            genderIcon = <IoIosFemale className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />;
        } else {
            genderIcon = <PiGenderIntersex className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />;
        }

        const ktmImageUrl = getImageUrlFromR2(ktmFileName);
        const twibbonImageUrl = getImageUrlFromR2(twibbonFileName);

        return (
            <div className="flex items-center justify-center relative">
                <div className="min-h-screen bg-[#7b446c] mx-10 lg:mx-auto lg:my-20 p-6 rounded-md shadow-md text-white w-full max-w-4xl">
                    <h1 className="text-2xl input-text-glow text-white drop-shadow-[0_1px_1px_#FFE6FC] font-bold mb-6 text-center">Edit Profil</h1>
                    <form
                        onSubmit={this.handleSubmit}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-dm-sans"
                    >
                        <h2 className="text-lg font-semibold mb-4 col-span-full input-text-glow text-white drop-shadow-[0_1px_1px_#FFE6FC]">Data Diri</h2>

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
                                className={`cursor-pointer pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.birth_date) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
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
                                className={`cursor-pointer pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.jenis_kelamin) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                            >
                                <option value="">Pilih</option>
                                <option value="laki2">Laki-laki</option>
                                <option value="perempuan">Perempuan</option>
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
                        <h2 className="text-lg font-semibold mt-4 mb-4 col-span-full input-text-glow text-white drop-shadow-[0_1px_1px_#FFE6FC]">Data Institusi</h2>

                        {/* Pendidikan */}
                        <div className="mb-3 relative">
                            <label className="block text-sm font-bold mb-2">Status Pendidikan</label>
                            <IoMdSchool className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                            <select
                                name="pendidikan"
                                value={pendidikan}
                                onChange={this.handleChange}
                                className={`cursor-pointer pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.pendidikan) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                            >
                                <option value="">Pilih</option>
                                <option value="sma">SMA/SMK</option>
                                <option value="mahasiswa">Mahasiswa</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                        </div>

                        {/* Nama Sekolah */}
                        <div className="mb-3 relative lg:col-start-2">
                            <label className="block text-sm font-bold mb-2">Nama Sekolah/Institusi</label>
                            <FaSchool className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                            <input
                                type="text"
                                name="nama_sekolah"
                                placeholder="Nama Sekolah/Institusi"
                                value={nama_sekolah}
                                onChange={this.handleChange}
                                className={`cursor-pointer pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871] ${errorFields.includes(this.fieldLabels.nama_sekolah) ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                            />
                        </div>

                        {/* Upload KTM */}
                        <div className="mb-3 col-span-full">
                            <label className="block text-sm font-bold mb-2">
                                Kartu Institusi (jpg/png, max 2MB)
                            </label>
                            <div
                                className={`border-2 border-dashed ${errorFields.includes(this.fieldLabels.KTM) ? 'border-red-500' : 'border-pink-400'} rounded-md p-6 text-center ${errorFields.includes(this.fieldLabels.KTM) ? 'bg-red-100' : 'bg-gray-100'} text-white bg-white/10 hover:bg-white/20 transition duration-300 hover:scale-102 cursor-pointer w-full min-h-24 flex items-center justify-center`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={this.handleFileDrop}
                                onClick={() => this.fileInput && this.fileInput.click()}
                            >
                                <FaAddressCard className="mr-2 text-xl text-pink-300 group-hover:text-pink-200'" />
                                <div className="w-full overflow-hidden text-ellipsis">
                                    <p className="truncate">
                                        {KTM
                                            ? KTM.name
                                            : (ktmFileName
                                                ? getOriginalFileName(ktmFileName)
                                                : "Drop file di sini atau klik untuk pilih file")}
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    name="profileImage"
                                    accept=".jpg,.jpeg,.png"
                                    ref={(ref) => (this.fileInput = ref)}
                                    onChange={this.handleFileInputChange}
                                    style={{ display: "none" }}
                                />
                            </div>
                            {ktmFileName && !KTM && (
                                <div className="text-xs text-gray-200 mt-1">
                                    Foto yang diupload sebelumnya: <span className="font-semibold">{getOriginalFileName(ktmFileName)}</span>
                                </div>
                            )}
                            {errorFields.includes(this.fieldLabels.KTM) && (
                                <p className="text-red-300 text-xs mt-1">File Kartu Institusi wajib diunggah.</p>
                            )}
                            {ktmImageUrl && (
                                <div className="mt-2 flex justify-center">
                                    <img src={ktmImageUrl} alt="KTM" className="max-h-64 rounded shadow" />
                                </div>
                            )}
                        </div>

                        {/* Upload Twibbon */}
                        <div className="mb-3 col-span-full">
                            <div className="flex flex-col mb-3">
                                <label className="block text-sm font-bold mb-2">
                                    Twibbon (jpg/png, max 2MB)
                                </label>
                                <button 
                                    type="button"
                                    className="font-dm-sans text-white font-bold custom-button-bg button-hover transition duration-300 ease-in-out hover:scale-102 cursor-pointer px-4 py-2 rounded-md "
                                    onClick={() => window.open("https://www.twibbonize.com/twibbon-ittoday-2025", "_blank")}
                                    >
                                        Link Twibbon
                                </button>
                            </div>
                            <div
                                className={`border-2 border-dashed ${errorFields.includes(this.fieldLabels.twibbon) ? 'border-red-500' : 'border-pink-400'} rounded-md p-6 text-center ${errorFields.includes(this.fieldLabels.twibbon) ? 'bg-red-100' : 'bg-gray-100'} text-white bg-white/10 hover:bg-white/20 transition duration-300 hover:scale-102 cursor-pointer w-full min-h-24 flex items-center justify-center`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={this.handleTwibbonFileDrop}
                                onClick={() => this.twibbonInputRef.current && this.twibbonInputRef.current.click()}
                            >
                                <FaImage className="mr-2 text-xl text-pink-300 group-hover:text-pink-200'" />
                                <div className="w-full overflow-hidden text-ellipsis">
                                    <p className="truncate">
                                        {twibbon
                                            ? twibbon.name
                                            : (twibbonFileName
                                                ? getOriginalFileName(twibbonFileName)
                                                : "Drop file di sini atau klik untuk pilih file")}
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    name="userTwibbon"
                                    accept=".jpg,.jpeg,.png"
                                    ref={this.twibbonInputRef}
                                    onChange={this.handleTwibbonFileInputChange}
                                    style={{ display: "none" }}
                                />
                            </div>
                            {twibbonFileName && !twibbon && (
                                <div className="text-xs text-gray-200 mt-1">
                                    Foto yang diupload sebelumnya: <span className="font-semibold">{getOriginalFileName(twibbonFileName)}</span>
                                </div>
                            )}
                            {errorFields.includes(this.fieldLabels.twibbon) && (
                                <p className="text-red-300 text-xs mt-1">File Twibbon wajib diunggah.</p>
                            )}
                            {twibbonImageUrl && (
                                <div className="mt-2 flex justify-center">
                                    <img src={twibbonImageUrl} alt="Twibbon" className="max-h-64 rounded shadow" />
                                </div>
                            )}
                        </div>

                        {/* Tombol */}
                        <div className="col-span-full flex justify-end mt-6">
                            <Link
                                to="/dashboard/beranda"
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

                {/* Progress Restored Message */}
                {this.state.showProgressRestoredMessage && (
                    <div className="fixed top-5 right-5 bg-green-600/90 text-white p-4 rounded-lg shadow-lg max-w-xs w-full z-50 animate-fade-in-down">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Form progress restored!</span>
                            </div>
                            <button onClick={() => this.setState({ showProgressRestoredMessage: false })} className="bg-green-700/85 hover:bg-green-800/85 rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default EditProfile;
