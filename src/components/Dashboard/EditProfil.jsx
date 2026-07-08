import React, { Component } from "react";
import { MdErrorOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import instance from "../../api/axios";
import { getImageUrlFromR2 } from "../../api/user";
import DashboardNeoHeader from "./DashboardNeoHeader";
import Footer from "../Footer";
import { normalizeIndonesianPhoneNumber } from "../../utils/phoneNumber";

const getOriginalFileName = (key) => {
    if (!key) return "";
    const parts = key.split("_");
    return parts.slice(1).join("_");
};

const FingerprintIcon = () => (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.4925 3.675C16.1425 3.675 18.6425 4.24375 20.9925 5.38125C23.3425 6.51875 25.305 8.1625 26.88 10.3125C27.055 10.5375 27.1112 10.7375 27.0487 10.9125C26.9862 11.0875 26.88 11.2375 26.73 11.3625C26.58 11.4875 26.405 11.5437 26.205 11.5312C26.005 11.5188 25.83 11.4125 25.68 11.2125C24.305 9.2625 22.5363 7.76875 20.3738 6.73125C18.2113 5.69375 15.9175 5.175 13.4925 5.175C11.0675 5.175 8.7925 5.69375 6.6675 6.73125C4.5425 7.76875 2.78 9.2625 1.38 11.2125C1.23 11.4375 1.055 11.5625 0.855 11.5875C0.655 11.6125 0.48 11.5625 0.33 11.4375C0.155 11.3125 0.04875 11.1562 0.01125 10.9688C-0.02625 10.7812 0.03 10.5875 0.18 10.3875C1.73 8.2625 3.67375 6.6125 6.01125 5.4375C8.34875 4.2625 10.8425 3.675 13.4925 3.675ZM13.4925 7.2C16.8675 7.2 19.7675 8.325 22.1925 10.575C24.6175 12.825 25.83 15.6125 25.83 18.9375C25.83 20.1875 25.3863 21.2313 24.4988 22.0688C23.6112 22.9062 22.53 23.325 21.255 23.325C19.98 23.325 18.8862 22.9062 17.9737 22.0688C17.0612 21.2313 16.605 20.1875 16.605 18.9375C16.605 18.1125 16.2987 17.4188 15.6862 16.8563C15.0737 16.2938 14.3425 16.0125 13.4925 16.0125C12.6425 16.0125 11.9113 16.2938 11.2987 16.8563C10.6862 17.4188 10.38 18.1125 10.38 18.9375C10.38 21.3625 11.0988 23.3875 12.5363 25.0125C13.9738 26.6375 15.83 27.775 18.105 28.425C18.33 28.5 18.48 28.625 18.555 28.8C18.63 28.975 18.6425 29.1625 18.5925 29.3625C18.5425 29.5375 18.4425 29.6875 18.2925 29.8125C18.1425 29.9375 17.955 29.975 17.73 29.925C15.13 29.275 13.005 27.9813 11.355 26.0438C9.705 24.1063 8.88 21.7375 8.88 18.9375C8.88 17.6875 9.33 16.6375 10.23 15.7875C11.13 14.9375 12.2175 14.5125 13.4925 14.5125C14.7675 14.5125 15.855 14.9375 16.755 15.7875C17.655 16.6375 18.105 17.6875 18.105 18.9375C18.105 19.7625 18.4175 20.4562 19.0425 21.0187C19.6675 21.5812 20.405 21.8625 21.255 21.8625C22.105 21.8625 22.83 21.5812 23.43 21.0187C24.03 20.4562 24.33 19.7625 24.33 18.9375C24.33 16.0375 23.2675 13.6 21.1425 11.625C19.0175 9.65 16.48 8.6625 13.53 8.6625C10.58 8.6625 8.0425 9.65 5.9175 11.625C3.7925 13.6 2.73 16.025 2.73 18.9C2.73 19.5 2.78625 20.25 2.89875 21.15C3.01125 22.05 3.28 23.1 3.705 24.3C3.78 24.525 3.77375 24.725 3.68625 24.9C3.59875 25.075 3.455 25.2 3.255 25.275C3.055 25.35 2.86125 25.3438 2.67375 25.2563C2.48625 25.1688 2.355 25.025 2.28 24.825C1.905 23.85 1.63625 22.8813 1.47375 21.9188C1.31125 20.9563 1.23 19.9625 1.23 18.9375C1.23 15.6125 2.43625 12.825 4.84875 10.575C7.26125 8.325 10.1425 7.2 13.4925 7.2ZM13.4925 0C15.0925 0 16.655 0.19375 18.18 0.58125C19.705 0.96875 21.18 1.525 22.605 2.25C22.83 2.375 22.9613 2.525 22.9988 2.7C23.0363 2.875 23.0175 3.05 22.9425 3.225C22.8675 3.4 22.7425 3.5375 22.5675 3.6375C22.3925 3.7375 22.18 3.725 21.93 3.6C20.605 2.925 19.2362 2.40625 17.8237 2.04375C16.4112 1.68125 14.9675 1.5 13.4925 1.5C12.0425 1.5 10.6175 1.66875 9.2175 2.00625C7.8175 2.34375 6.48 2.875 5.205 3.6C5.005 3.725 4.805 3.75625 4.605 3.69375C4.405 3.63125 4.255 3.5 4.155 3.3C4.055 3.1 4.03 2.91875 4.08 2.75625C4.13 2.59375 4.255 2.45 4.455 2.325C5.855 1.575 7.3175 1 8.8425 0.6C10.3675 0.2 11.9175 0 13.4925 0ZM13.4925 10.8375C15.8175 10.8375 17.8175 11.6187 19.4925 13.1812C21.1675 14.7437 22.005 16.6625 22.005 18.9375C22.005 19.1625 21.9363 19.3438 21.7987 19.4813C21.6612 19.6188 21.48 19.6875 21.255 19.6875C21.055 19.6875 20.88 19.6188 20.73 19.4813C20.58 19.3438 20.505 19.1625 20.505 18.9375C20.505 17.0625 19.8113 15.4937 18.4237 14.2312C17.0362 12.9688 15.3925 12.3375 13.4925 12.3375C11.5925 12.3375 9.96125 12.9688 8.59875 14.2312C7.23625 15.4937 6.555 17.0625 6.555 18.9375C6.555 20.9625 6.905 22.6812 7.605 24.0938C8.305 25.5063 9.33 26.925 10.68 28.35C10.83 28.5 10.905 28.675 10.905 28.875C10.905 29.075 10.83 29.25 10.68 29.4C10.53 29.55 10.355 29.625 10.155 29.625C9.955 29.625 9.78 29.55 9.63 29.4C8.155 27.85 7.02375 26.2687 6.23625 24.6562C5.44875 23.0438 5.055 21.1375 5.055 18.9375C5.055 16.6625 5.88 14.7437 7.53 13.1812C9.18 11.6187 11.1675 10.8375 13.4925 10.8375ZM13.455 18.1875C13.68 18.1875 13.8612 18.2625 13.9987 18.4125C14.1362 18.5625 14.205 18.7375 14.205 18.9375C14.205 20.8125 14.88 22.35 16.23 23.55C17.58 24.75 19.155 25.35 20.955 25.35C21.105 25.35 21.3175 25.3375 21.5925 25.3125C21.8675 25.2875 22.155 25.25 22.455 25.2C22.68 25.15 22.8737 25.1813 23.0362 25.2938C23.1987 25.4062 23.305 25.575 23.355 25.8C23.405 26 23.3675 26.175 23.2425 26.325C23.1175 26.475 22.955 26.575 22.755 26.625C22.305 26.75 21.9112 26.8187 21.5737 26.8312C21.2362 26.8438 21.03 26.85 20.955 26.85C18.73 26.85 16.7987 26.1 15.1613 24.6C13.5238 23.1 12.705 21.2125 12.705 18.9375C12.705 18.7375 12.7738 18.5625 12.9113 18.4125C13.0487 18.2625 13.23 18.1875 13.455 18.1875Z" fill="#34399F" />
    </svg>
);

const GraduationIcon = () => (
    <svg className="w-6 h-5 flex-shrink-0" viewBox="0 0 33 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5 27L6 21.3V12.3L0 9L16.5 0L33 9V21H30V10.65L27 12.3V21.3L16.5 27ZM16.5 14.55L26.775 9L16.5 3.45L6.225 9L16.5 14.55ZM16.5 23.5875L24 19.5375V13.875L16.5 18L9 13.875V19.5375L16.5 23.5875Z" fill="#34399F" />
    </svg>
);

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
            twibbonChanged: false,
            isSubmitting: false
        };

        this.fieldLabels = {
            full_name: "Nama Lengkap",
            birth_date: "Tanggal Lahir",
            phone_number: "Nomor HP (gunakan 08..., 628..., atau +628...)",
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
            let pendidikan = userData.pendidikan || "";
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
                KTM: null,
                twibbon: null,
                isLoading: false
            });
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
        if (file && file.size <= 2 * 1024 * 1024) {
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
        const newValue = type === "file" ? files[0] : value;

        this.setState({
            [name]: newValue
        }, () => {
            this.saveFormProgress();
        });
    };

    handleFileChange = (file) => {
        if (file && file.size <= 2 * 1024 * 1024) {
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

    checkUploadStatus = () => {
        const { KTM, ktmFileName, twibbon, twibbonFileName } = this.state;

        return {
            ktmMissing: !KTM && !ktmFileName,
            twibbonMissing: !twibbon && !twibbonFileName
        };
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.setState({ isSubmitting: true });
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
            ktmChanged,
            twibbonChanged
        } = this.state;

        const uploadStatus = this.checkUploadStatus();
        const emptyFieldsList = [];

        const fieldsToValidate = {
            full_name,
            birth_date,
            phone_number,
            id_discord,
            id_instagram,
            pendidikan,
            nama_sekolah,
        };

        if (jenis_kelamin !== "laki2" && jenis_kelamin !== "perempuan") {
            emptyFieldsList.push(this.fieldLabels.jenis_kelamin);
        }

        if (uploadStatus.ktmMissing) {
            fieldsToValidate.KTM = "";
        }

        if (uploadStatus.twibbonMissing) {
            fieldsToValidate.twibbon = "";
        }

        for (const key in fieldsToValidate) {
            if (fieldsToValidate[key] === "" || fieldsToValidate[key] === null) {
                emptyFieldsList.push(this.fieldLabels[key]);
            }
        }

        const normalizedPhoneNumber =
            normalizeIndonesianPhoneNumber(phone_number);
        if (phone_number && !normalizedPhoneNumber) {
            emptyFieldsList.push(this.fieldLabels.phone_number);
        }

        if (emptyFieldsList.length > 0) {
            this.setState({
                showErrorBox: true,
                errorFields: emptyFieldsList,
                isSubmitting: false
            });
            return;
        }

        try {
            const formData = new FormData();
            if (full_name) formData.append('full_name', full_name);
            if (birth_date) formData.append('birth_date', birth_date);
            if (normalizedPhoneNumber) formData.append('phone_number', normalizedPhoneNumber);
            if (jenis_kelamin) formData.append('jenis_kelamin', jenis_kelamin);
            if (id_line) formData.append('id_line', id_line);
            if (id_discord) formData.append('id_discord', id_discord);
            if (id_instagram) formData.append('id_instagram', id_instagram);
            if (pendidikan) {
                formData.append('pendidikan', pendidikan);
            }
            if (nama_sekolah) formData.append('nama_sekolah', nama_sekolah);

            if (KTM && ktmChanged) {
                formData.append('profileImage', KTM);
            }

            const response = await instance.patch('/api/user', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (twibbon && twibbonChanged) {
                const twibbonForm = new FormData();
                twibbonForm.append('userTwibbon', twibbon);

                try {
                    await instance.put('/api/user/twibbon', twibbonForm, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } catch (twibbonError) {
                    console.error("Twibbon upload failed:", twibbonError);
                    this.setState({
                        showErrorBox: true,
                        errorFields: [twibbonError.response?.data?.message || "Gagal mengunggah Twibbon. Silakan coba lagi."],
                        isSubmitting: false
                    });
                    return;
                }
            }

            if (response.data.success || response.data.message?.includes('success')) {
                const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
                const updatedUserData = {
                    ...userData,
                    full_name: full_name,
                    birth_date,
                    phone_number: normalizedPhoneNumber,
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
            console.error("Error updating profile:", error);
            this.setState({
                showErrorBox: true,
                errorFields: [error.response?.data?.message || "Failed to update profile. Please try again."],
                isSubmitting: false
            });
        }
    };

    closeErrorBox = () => {
        this.setState({ showErrorBox: false, errorFields: [] });
    };

    render() {
        const {
            full_name,
            isSubmitting,
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
                <div className="flex justify-center items-center min-h-screen bg-[#F9F9F9]">
                    <p className="border-2 border-[#1A1C1C] bg-[#ffd400] px-5 py-3 text-xs font-black uppercase shadow-[3px_3px_0_#1A1C1C]">
                        Loading...
                    </p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex justify-center items-center min-h-screen bg-[#F9F9F9]">
                    <div className="border-2 border-[#1A1C1C] bg-[#fef2f2] p-4 text-xs font-bold text-red-700 shadow-[3px_3px_0_#1A1C1C] max-w-md">
                        <strong className="font-extrabold uppercase text-red-800 mr-2">Error!</strong>
                        {error}
                    </div>
                </div>
            );
        }

        const ktmImageUrl = getImageUrlFromR2(ktmFileName);
        const twibbonImageUrl = getImageUrlFromR2(twibbonFileName);

        return (
            <div className="min-h-screen bg-[#F9F9F9] font-dm-sans text-[#191b1a] flex flex-col justify-between">
                <DashboardNeoHeader />

                <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-7 lg:px-10 lg:py-10 flex-grow">
                    <div className="relative w-full max-w-[1248px] mx-auto mb-8 pb-4">
                        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-[#1A1C1C] tracking-tight">
                            Edit Profil
                        </h1>
                        <div className="absolute bottom-0 left-0 w-24 h-1.5 bg-[#34399F]"></div>
                    </div>

                    <form onSubmit={this.handleSubmit} className="w-full max-w-[1248px] mx-auto flex flex-col gap-9">
                        
                        {showErrorBox && (
                            <div className="border-2 border-[#1A1C1C] bg-[#fef2f2] p-4 shadow-[3px_3px_0_#1A1C1C] flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-black uppercase text-red-700 text-xs">
                                        <MdErrorOutline className="text-lg" />
                                        Harap lengkapi kolom berikut:
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={this.closeErrorBox} 
                                        className="text-red-700 hover:bg-red-100 rounded-full p-1"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <ul className="list-disc list-inside text-xs text-red-700 font-semibold pl-1">
                                    {errorFields.map((field, index) => (
                                        <li key={index}>{field}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="border-[2.25px] border-[#1A1C1C] bg-white p-6 shadow-[3px_3px_0_#1A1C1C] flex flex-col gap-6">
                            <div className="flex items-center gap-2 text-[#34399F]">
                                <FingerprintIcon />
                                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                                    Data Diri
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#1A1C1C]">
                                            Nama Lengkap
                                        </label>
                                        <span className="text-[10.5px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                                            *Wajib
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-4.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16ZM0 18V13.75L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.9542 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.625 17.425 4.825L4.25 18H0ZM16 3.4L14.6 2L16 3.4ZM12.475 5.525L11.775 4.8L13.2 6.225L12.475 5.525Z" fill="#464652"/>
                                        </svg>
                                        <input
                                            type="text"
                                            inputMode="text"
                                            autoComplete="name"
                                            autoCapitalize="words"
                                            name="full_name"
                                            placeholder="Nama Lengkap"
                                            value={full_name}
                                            onChange={this.handleChange}
                                            className={`w-full border border-[#1A1C1C] bg-[#F3F3F3] pl-10 pr-3 py-2.5 text-xs font-semibold text-[#1A1C1C] placeholder:text-gray-400 focus:outline-none focus:bg-white ${errorFields.includes(this.fieldLabels.full_name) ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#1A1C1C]">
                                            Tanggal Lahir
                                        </label>
                                        <span className="text-[10.5px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                                            *Wajib
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-4.5" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.5 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6ZM2 6V4V6Z" fill="#464652"/>
                                        </svg>
                                        <input
                                            type="date"
                                            name="birth_date"
                                            value={birth_date}
                                            onChange={this.handleChange}
                                            className={`w-full border border-[#1A1C1C] bg-[#F3F3F3] pl-10 pr-3 py-2.5 text-xs font-semibold text-[#1A1C1C] placeholder:text-gray-400 focus:outline-none focus:bg-white ${errorFields.includes(this.fieldLabels.birth_date) ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#1A1C1C]">
                                            Nomor HP
                                        </label>
                                        <span className="text-[10.5px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                                            *Wajib
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-4.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16.95 18C14.8667 18 12.8083 17.5458 10.775 16.6375C8.74167 15.7292 6.89167 14.4417 5.225 12.775C3.55833 11.1083 2.27083 9.25833 1.3625 7.225C0.454167 5.19167 0 3.13333 0 1.05C0 0.75 0.1 0.5 0.3 0.3C0.5 0.1 0.75 0 1.05 0H5.1C5.33333 0 5.54167 0.0791667 5.725 0.2375C5.90833 0.395833 6.01667 0.583333 6.05 0.8L6.7 4.3C6.73333 4.56667 6.725 4.79167 6.675 4.975C6.625 5.15833 6.53333 5.31667 6.4 5.45L3.975 7.9C4.30833 8.51667 4.70417 9.1125 5.1625 9.6875C5.62083 10.2625 6.125 10.8167 6.675 11.35C7.19167 11.8667 7.73333 12.3458 8.3 12.7875C8.86667 13.2292 9.46667 13.6333 10.1 14L12.45 11.65C12.6 11.5 12.7958 11.3875 13.0375 11.3125C13.2792 11.2375 13.5167 11.2167 13.75 11.25L17.2 11.95C17.4333 12.0167 17.625 12.1375 17.775 12.3125C17.925 12.4875 18 12.6833 18 12.9V16.95C18 17.25 17.9 17.5 17.7 17.7C17.5 17.9 17.25 18 16.95 18ZM3.025 6L4.675 4.35L4.25 2H2.025C2.10833 2.68333 2.225 3.35833 2.375 4.025C2.525 4.69167 2.74167 5.35 3.025 6ZM11.975 14.95C12.625 15.2333 13.2875 15.4583 13.9625 15.625C14.6375 15.7917 15.3167 15.9 16 15.95V13.75L13.65 13.275L11.975 14.95Z" fill="#464652"/>
                                        </svg>
                                        <input
                                            type="tel"
                                            inputMode="tel"
                                            autoComplete="tel"
                                            name="phone_number"
                                            placeholder="Nomor HP"
                                            value={phone_number}
                                            onChange={this.handleChange}
                                            className={`w-full border border-[#1A1C1C] bg-[#F3F3F3] pl-10 pr-3 py-2.5 text-xs font-semibold text-[#1A1C1C] placeholder:text-gray-400 focus:outline-none focus:bg-white ${errorFields.includes(this.fieldLabels.phone_number) ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#1A1C1C]">
                                            Jenis Kelamin
                                        </label>
                                        <span className="text-[10.5px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                                            *Wajib
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-4.5" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.5 20V12.5H0V7C0 6.45 0.195833 5.97917 0.5875 5.5875C0.979167 5.19583 1.45 5 2 5H5C5.55 5 6.02083 5.19583 6.4125 5.5875C6.80417 5.97917 7 6.45 7 7V12.5H5.5V20H1.5ZM3.5 4C2.95 4 2.47917 3.80417 2.0875 3.4125C1.69583 3.02083 1.5 2.55 1.5 2C1.5 1.45 1.69583 0.979167 2.0875 0.5875C2.47917 0.195833 2.95 0 3.5 0C4.05 0 4.52083 0.195833 4.9125 0.5875C5.30417 0.979167 5.5 1.45 5.5 2C5.5 2.55 5.30417 3.02083 4.9125 3.4125C4.52083 3.80417 4.05 4 3.5 4ZM12.5 4C11.95 4 11.4792 3.80417 11.0875 3.4125C10.6958 3.02083 10.5 2.55 10.5 2C10.5 1.45 10.6958 0.979167 11.0875 0.5875C11.4792 0.195833 11.95 0 12.5 0C13.05 0 13.5208 0.195833 13.9125 0.5875C14.3042 0.979167 14.5 1.45 14.5 2C14.5 2.55 14.3042 3.02083 13.9125 3.4125C13.5208 3.80417 13.05 4 12.5 4Z" fill="#464652"/>
                                        </svg>
                                        <select
                                            name="jenis_kelamin"
                                            value={jenis_kelamin}
                                            onChange={this.handleChange}
                                            className={`w-full border border-[#1A1C1C] bg-[#F3F3F3] pl-10 pr-8 py-2.5 text-xs font-semibold text-[#1A1C1C] focus:outline-none focus:bg-white ${errorFields.includes(this.fieldLabels.jenis_kelamin) ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`}
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.3999 7.19922L10.1999 11.9992L14.9999 7.19922' stroke='%236B7280' stroke-width='1.35' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "right 10px center",
                                                WebkitAppearance: "none",
                                                MozAppearance: "none",
                                                appearance: "none"
                                            }}
                                        >
                                            <option value="">Pilih</option>
                                            <option value="laki2">Laki-laki</option>
                                            <option value="perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#1A1C1C]">
                                        ID Line
                                    </label>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-4.5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10V11.45C20 12.4333 19.6625 13.2708 18.9875 13.9625C18.3125 14.6542 17.4833 15 16.5 15C15.9167 15 15.3667 14.875 14.85 14.625C14.3333 14.375 13.9 14.0167 13.55 13.55C13.0667 14.0333 12.5208 14.3958 11.9125 14.6375C11.3042 14.8792 10.6667 15 10 15C8.61667 15 7.4375 14.5125 6.4625 13.5375C5.4875 12.5625 5 11.3833 5 10C5 8.61667 5.4875 7.4375 6.4625 6.4625C7.4375 5.4875 8.61667 5 10 5C11.3833 5 12.5625 5.4875 13.5375 6.4625C14.5125 7.4375 15 8.61667 15 10V11.45C15 11.8833 15.1417 12.25 15.425 12.55C15.7083 12.85 16.0667 13 16.5 13C16.9333 13 17.2917 12.85 17.575 12.55C17.8583 12.25 18 11.8833 18 11.45V10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18H15V20H10ZM10 13C10.8333 13 11.5417 12.7083 12.125 12.125C12.7083 11.5417 13 10.8333 13 10C13 9.16667 12.7083 8.45833 12.125 7.875C11.5417 7.29167 10.8333 7 10 7C9.16667 7 8.45833 7.29167 7.875 7.875C7.29167 8.45833 7 9.16667 7 10C7 10.8333 7.29167 11.5417 7.875 12.125C8.45833 12.7083 9.16667 13 10 13Z" fill="#464652"/>
                                        </svg>
                                        <input
                                            type="text"
                                            inputMode="text"
                                            autoComplete="off"
                                            name="id_line"
                                            placeholder="ID Line"
                                            value={id_line}
                                            onChange={this.handleChange}
                                            className={`w-full border border-[#1A1C1C] bg-[#F3F3F3] pl-10 pr-3 py-2.5 text-xs font-semibold text-[#1A1C1C] placeholder:text-gray-400 focus:outline-none focus:bg-white ${errorFields.includes(this.fieldLabels.id_line) ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#1A1C1C]">
                                            ID Discord
                                        </label>
                                        <span className="text-[10.5px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                                            *Wajib
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-4.5" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 16L4 12H0L0.5 10H4.5L5.5 6H1.5L2 4H6L7 0H9L8 4H12L13 0H15L14 4H18L17.5 6H13.5L12.5 10H16.5L16 12H12L11 16H9L10 12H6L5 16H3ZM6.5 10H10.5L11.5 6H7.5L6.5 10Z" fill="#464652"/>
                                        </svg>
                                        <input
                                            type="text"
                                            inputMode="text"
                                            autoComplete="off"
                                            name="id_discord"
                                            placeholder="ID Discord"
                                            value={id_discord}
                                            onChange={this.handleChange}
                                            className={`w-full border border-[#1A1C1C] bg-[#F3F3F3] pl-10 pr-3 py-2.5 text-xs font-semibold text-[#1A1C1C] placeholder:text-gray-400 focus:outline-none focus:bg-white ${errorFields.includes(this.fieldLabels.id_discord) ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#1A1C1C]">
                                            ID Instagram
                                        </label>
                                        <span className="text-[10.5px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                                            *Wajib
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-4.5" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 14.5C11.25 14.5 12.3125 14.0625 13.1875 13.1875C14.0625 12.3125 14.5 11.25 14.5 10C14.5 8.75 14.0625 7.6875 13.1875 6.8125C12.3125 5.9375 11.25 5.5 10 5.5C8.75 5.5 7.6875 5.9375 6.8125 6.8125C5.9375 7.6875 5.5 8.75 5.5 10C5.5 11.25 5.9375 12.3125 6.8125 13.1875C7.6875 14.0625 8.75 14.5 10 14.5ZM10 12.5C9.3 12.5 8.70833 12.2583 8.225 11.775C7.74167 11.2917 7.5 10.7 7.5 10C7.5 9.3 7.74167 8.70833 8.225 8.225C8.70833 7.74167 9.3 7.5 10 7.5C10.7 7.5 11.2917 7.74167 11.775 8.225C12.2583 8.70833 12.5 9.3 12.5 10C12.5 10.7 12.2583 11.2917 11.775 11.775C11.2917 12.2583 10.7 12.5 10 12.5ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H5.15L7 0H13L14.85 2H18C18.55 2 19.0208 2.19583 19.4125 2.5875C19.8042 2.97917 20 3.45 20 4V16C20 16.55 19.8042 17.0208 19.4125 17.4125C19.0208 17.8042 18.55 18 18 18H2ZM2 16H18V4H13.95L12.125 2H7.875L6.05 4H2V16Z" fill="#464652"/>
                                        </svg>
                                        <input
                                            type="text"
                                            inputMode="text"
                                            autoComplete="off"
                                            name="id_instagram"
                                            placeholder="ID Instagram"
                                            value={id_instagram}
                                            onChange={this.handleChange}
                                            className={`w-full border border-[#1A1C1C] bg-[#F3F3F3] pl-10 pr-3 py-2.5 text-xs font-semibold text-[#1A1C1C] placeholder:text-gray-400 focus:outline-none focus:bg-white ${errorFields.includes(this.fieldLabels.id_instagram) ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-[2.25px] border-[#1A1C1C] bg-[rgba(77,82,184,0.05)] p-6 shadow-[3px_3px_0_#1A1C1C] flex flex-col gap-6">
                            <div className="flex items-center gap-2 text-[#34399F]">
                                <GraduationIcon />
                                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight">
                                    Data Institusi
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#1A1C1C]">
                                            Status Pendidikan
                                        </label>
                                        <span className="text-[10.5px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                                            *Wajib
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-4.5" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.5 16C5.95 16 5.47917 15.8042 5.0875 15.4125C4.69583 15.0208 4.5 14.55 4.5 14V11H7.5V8.75C6.91667 8.71667 6.3625 8.5875 5.8375 8.3625C5.3125 8.1375 4.83333 7.8 4.4 7.35V6.25H3.25L0 3C0.6 2.23333 1.34167 1.69167 2.225 1.375C3.10833 1.05833 4 0.9 4.9 0.9C5.35 0.9 5.7875 0.933333 6.2125 1C6.6375 1.06667 7.06667 1.19167 7.5 1.375V0H19.5V13C19.5 13.8333 19.2083 14.5417 18.625 15.125C18.0417 15.7083 17.3333 16 16.5 16H6.5ZM9.5 11H15.5V13C15.5 13.2833 15.5958 13.5208 15.7875 13.7125C15.9792 13.9042 16.2167 14 16.5 14C16.7833 14 17.0208 13.9042 17.2125 13.7125C17.4042 13.5208 17.5 13.2833 17.5 13V2H9.5V2.6L15.5 8.6V10H14.1L11.25 7.15L11.05 7.35C10.8167 7.58333 10.5708 7.79167 10.3125 7.975C10.0542 8.15833 9.78333 8.3 9.5 8.4V11ZM4.1 4.25H6.4V6.4C6.6 6.53333 6.80833 6.625 7.025 6.675C7.24167 6.725 7.46667 6.75 7.7 6.75C8.08333 6.75 8.42917 6.69167 8.7375 6.575C9.04583 6.45833 9.35 6.25 9.65 5.95L9.85 5.75L8.45 4.35C7.96667 3.86667 7.425 3.50417 6.825 3.2625C6.225 3.02083 5.58333 2.9 4.9 2.9C4.56667 2.9 4.25 2.925 3.95 2.975C3.65 3.025 3.35 3.1 3.05 3.2L4.1 4.25ZM13.5 13H6.5V14H13.65C13.6 13.85 13.5625 13.6917 13.5375 13.525C13.5125 13.3583 13.5 13.1833 13.5 13ZM6.5 14C6.5 13.85 6.5 13.6917 6.5 13.525C6.5 13.3583 6.5 13.1833 6.5 13C6.5 13.1667 6.5 13.3333 6.5 13.5C6.5 13.6667 6.5 13.8333 6.5 14Z" fill="#464652"/>
                                        </svg>
                                        <select
                                            name="pendidikan"
                                            value={pendidikan}
                                            onChange={this.handleChange}
                                            className={`w-full border border-[#1A1C1C] bg-[#F3F3F3] pl-10 pr-8 py-2.5 text-xs font-semibold text-[#1A1C1C] focus:outline-none focus:bg-white ${errorFields.includes(this.fieldLabels.pendidikan) ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`}
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.3999 7.19922L10.1999 11.9992L14.9999 7.19922' stroke='%236B7280' stroke-width='1.35' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "right 10px center",
                                                WebkitAppearance: "none",
                                                MozAppearance: "none",
                                                appearance: "none"
                                            }}
                                        >
                                            <option value="">Pilih</option>
                                            <option value="sma">SMA/SMK</option>
                                            <option value="s1">S1</option>
                                            <option value="d3">D3</option>
                                            <option value="d4">D4</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#1A1C1C]">
                                            Nama Sekolah/Institusi
                                        </label>
                                        <span className="text-[10.5px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                                            *Wajib
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-4.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 18V4H4V0H14V8H18V18H10V14H8V18H0ZM2 16H4V14H2V16ZM2 12H4V10H2V12ZM2 8H4V6H2V8ZM6 12H8V10H6V12ZM6 8H8V6H6V8ZM6 4H8V2H6V4ZM10 12H12V10H10V12ZM10 8H12V6H10V8ZM10 4H12V2H10V4ZM14 16H16V14H14V16ZM14 12H16V10H14V12Z" fill="#464652"/>
                                        </svg>
                                        <input
                                            type="text"
                                            inputMode="text"
                                            autoComplete="organization"
                                            name="nama_sekolah"
                                            placeholder="Nama Sekolah/Institusi"
                                            value={nama_sekolah}
                                            onChange={this.handleChange}
                                            className={`w-full border border-[#1A1C1C] bg-[#F3F3F3] pl-10 pr-3 py-2.5 text-xs font-semibold text-[#1A1C1C] placeholder:text-gray-400 focus:outline-none focus:bg-white ${errorFields.includes(this.fieldLabels.nama_sekolah) ? 'border-red-500 ring-1 ring-red-500 bg-red-50' : ''}`}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#1A1C1C]">
                                            Kartu Institusi (JPG/PNG, MAX 2MB)
                                        </label>
                                        <span className="text-[10.5px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                                            *Wajib
                                        </span>
                                    </div>
                                    <div
                                        className={`border border-[#1A1C1C] rounded-none p-9 text-center cursor-pointer hover:bg-gray-50/50 transition duration-200 bg-white flex flex-col items-center justify-center gap-3 relative ${
                                            errorFields.includes(this.fieldLabels.KTM)
                                                ? "border-red-500 bg-red-50/30"
                                                : ""
                                        }`}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={this.handleFileDrop}
                                        onClick={() => this.fileInput && this.fileInput.click()}
                                    >
                                        <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 40C2.9 40 1.95833 39.6083 1.175 38.825C0.391667 38.0417 0 37.1 0 36V14C0 12.9 0.391667 11.9583 1.175 11.175C1.95833 10.3917 2.9 10 4 10H14V4C14 2.9 14.3917 1.95833 15.175 1.175C15.9583 0.391667 16.9 0 18 0H22C23.1 0 24.0417 0.391667 24.825 1.175C25.6083 1.95833 26 2.9 26 4V10H36C37.1 10 38.0417 10.3917 38.825 11.175C39.6083 11.9583 40 12.9 40 14V36C40 37.1 39.6083 38.0417 38.825 38.825C38.0417 39.6083 37.1 40 36 40H4ZM4 36H36V14H26C26 15.1 25.6083 16.0417 24.825 16.825C24.0417 17.6083 23.1 18 22 18H18C16.9 18 15.9583 17.6083 15.175 16.825C14.3917 16.0417 14 15.1 14 14H4V36ZM8 32H20V31.1C20 30.5333 19.8417 30.0083 19.525 29.525C19.2083 29.0417 18.7667 28.6667 18.2 28.4C17.5333 28.1 16.8583 27.875 16.175 27.725C15.4917 27.575 14.7667 27.5 14 27.5C13.2333 27.5 12.5083 27.575 11.825 27.725C11.1417 27.875 10.4667 28.1 9.8 28.4C9.23333 28.6667 8.79167 29.0417 8.475 29.525C8.15833 30.0083 8 30.5333 8 31.1V32ZM24 29H32V26H24V29ZM14 26C14.8333 26 15.5417 25.7083 16.125 25.125C16.7083 24.5417 17 23.8333 17 23C17 22.1667 16.7083 21.4583 16.125 20.875C15.5417 20.2917 14.8333 20 14 20C13.1667 20 12.4583 20.2917 11.875 20.875C11.2917 21.4583 11 22.1667 11 23C11 23.8333 11.2917 24.5417 11.875 25.125C12.4583 25.7083 13.1667 26 14 26ZM24 23H32V20H24V23ZM18 14H22V4H18V14Z" fill="#1A1C1C"/>
                                        </svg>
                                        <span className="truncate text-xs text-gray-800 w-full px-4 text-center font-space-grotesk font-normal">
                                            {KTM
                                                ? KTM.name
                                                : ktmFileName
                                                ? getOriginalFileName(ktmFileName)
                                                : "Drop file di sini atau klik untuk pilih file"}
                                        </span>
                                        <input
                                            type="file"
                                            name="profileImage"
                                            accept=".jpg,.jpeg,.png"
                                            ref={(ref) => (this.fileInput = ref)}
                                            onChange={this.handleFileInputChange}
                                            style={{ display: "none" }}
                                        />
                                        {KTM && <span className="absolute top-2 right-2 text-green-500 font-bold text-base">✓</span>}
                                    </div>
                                    {ktmFileName && !KTM && (
                                        <div className="text-[10px] text-gray-505 font-bold">
                                            File sebelumnya: {getOriginalFileName(ktmFileName)}
                                        </div>
                                    )}
                                    {ktmImageUrl && (
                                        <div className="mt-3 flex justify-center border border-[#1A1C1C] p-2 bg-white max-w-xs mx-auto shadow-[3px_3px_0_#1A1C1C]">
                                            <img src={ktmImageUrl} alt="KTM Preview" className="max-h-40 object-contain" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5 md:col-span-2 mt-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex justify-between items-end">
                                        <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#1A1C1C]">
                                            Twibbon (JPG/PNG, MAX 2MB)
                                        </label>
                                        <span className="text-[10.5px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                                            *Wajib
                                        </span>
                                    </div>
                                        <button
                                            type="button"
                                            onClick={() => window.open("https://www.twibbonize.com/twibbon-ittoday-2025", "_blank")}
                                            className="border-[1.5px] border-[#1A1C1C] bg-[#34399F] px-4.5 py-1.5 text-xs font-black uppercase text-white shadow-[3px_3px_0_#1A1C1C] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1A1C1C] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-1.5"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 12L3 7L4.4 5.55L7 8.15V0H9V8.15L11.6 5.55L13 7L8 12ZM2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V11H2V14H14V11H16V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2Z" fill="white"/>
                                            </svg>
                                            <span className="font-space-grotesk font-normal text-xs text-white">Template Twibbon</span>
                                        </button>
                                    </div>
                                    <div
                                        className={`border border-[#1A1C1C] rounded-none p-9 text-center cursor-pointer hover:bg-gray-50/50 transition duration-200 bg-white flex flex-col items-center justify-center gap-3 relative ${
                                            errorFields.includes(this.fieldLabels.twibbon)
                                                ? "border-red-500 bg-red-50/30"
                                                : ""
                                        }`}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={this.handleTwibbonFileDrop}
                                        onClick={() => this.twibbonInputRef.current && this.twibbonInputRef.current.click()}
                                    >
                                        <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 24H34L27.1 15L22.5 21L19.4 17L14 24ZM12 32C10.9 32 9.95833 31.6083 9.175 30.825C8.39167 30.0417 8 29.1 8 28V4C8 2.9 8.39167 1.95833 9.175 1.175C9.95833 0.391667 10.9 0 12 0H36C37.1 0 38.0417 0.391667 38.825 1.175C39.6083 1.95833 40 2.9 40 4V28C40 29.1 39.6083 30.0417 38.825 30.825C38.0417 31.6083 37.1 32 36 32H12ZM12 28H36V4H12V28ZM4 40C2.9 40 1.95833 39.6083 1.175 38.825C0.391667 38.0417 0 37.1 0 36V8H4V36H32V40H4ZM12 4V28V4Z" fill="#1A1C1C"/>
                                        </svg>
                                        <span className="truncate text-xs text-gray-800 w-full px-4 text-center font-space-grotesk font-normal">
                                            {twibbon
                                                ? twibbon.name
                                                : twibbonFileName
                                                ? getOriginalFileName(twibbonFileName)
                                                : "Drop file di sini atau klik untuk pilih file"}
                                        </span>
                                        <input
                                            type="file"
                                            name="userTwibbon"
                                            accept=".jpg,.jpeg,.png"
                                            ref={this.twibbonInputRef}
                                            onChange={this.handleTwibbonFileInputChange}
                                            style={{ display: "none" }}
                                        />
                                        {twibbon && <span className="absolute top-2 right-2 text-green-500 font-bold text-base">✓</span>}
                                    </div>
                                    {twibbonFileName && !twibbon && (
                                        <div className="text-[10px] text-gray-505 font-bold">
                                            File sebelumnya: {getOriginalFileName(twibbonFileName)}
                                        </div>
                                    )}
                                    {twibbonImageUrl && (
                                        <div className="mt-3 flex justify-center border border-[#1A1C1C] p-2 bg-white max-w-xs mx-auto shadow-[3px_3px_0_#1A1C1C]">
                                            <img src={twibbonImageUrl} alt="Twibbon Preview" className="max-h-40 object-contain" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-2 mb-8">
                            <Link
                                to="/dashboard/beranda"
                                className="border-[2.25px] border-[#1A1C1C] bg-[#E2E2E2] px-9 py-3 text-xs font-black uppercase text-black shadow-[3px_3px_0_#1A1C1C] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1A1C1C] active:translate-x-1 active:translate-y-1 active:shadow-none text-center"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`border-[2.25px] border-[#1A1C1C] px-9 py-3 text-xs font-black uppercase shadow-[3px_3px_0_#1A1C1C] transition-all ${isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70' : 'bg-[#FCD400] text-[#6E5C00] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1A1C1C] active:translate-x-1 active:translate-y-1 active:shadow-none'}`}
                            >
                                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </main>

                {this.state.showProgressRestoredMessage && (
                    <div className="fixed top-5 right-5 border-2 border-[#1A1C1C] bg-[#4ADE80] text-black p-4 shadow-[3px_3px_0_#1A1C1C] max-w-xs w-full z-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-xs">
                            <span>✓</span>
                            <span>Form progress restored!</span>
                        </div>
                        <button 
                            onClick={() => this.setState({ showProgressRestoredMessage: false })}
                            className="bg-black/10 hover:bg-black/20 rounded-full p-1 text-black font-bold"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <Footer variant="neobrutal" />
            </div>
        );
    }
}

export default EditProfile;
