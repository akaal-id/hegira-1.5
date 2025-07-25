
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { OrganizationAccountData } from '../BusinessMatchingDashboardPage';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { UserCircle, Mail, Phone, Users, Calendar, Edit2, Save, CheckCircle, Info, Camera, UploadCloud, Eye, EyeOff, Lock, ShieldCheck, Briefcase } from 'lucide-react';

interface AccountSettingsBMProps {
  organizationData: OrganizationAccountData;
  onUpdatePhoneNumber: (newPhoneNumber: string) => void;
  onUpdateProfilePicture: (newPictureUrl: string) => void;
  onUpdatePassword: (oldPassword: string, newPassword: string) => void;
  // Add more specific update functions if needed, e.g., onUpdateOrgDetails
}

interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  text: string;
  colorClass: string;
}

const PasswordStrengthIndicator: React.FC<{ password?: string }> = ({ password = "" }) => {
  const calculateStrength = (pass: string): PasswordStrength => {
    let score = 0;
    if (!pass) return { score: 0, text: "", colorClass: "bg-gray-200" };
    if (pass.length >= 8) score++; if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++; if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) return { score: 1, text: "Lemah", colorClass: "bg-red-400" };
    if (score <= 2) return { score: 2, text: "Sedang", colorClass: "bg-yellow-400" };
    if (score <= 3) return { score: 3, text: "Kuat", colorClass: "bg-blue-400" };
    return { score: 4, text: "Sangat Kuat", colorClass: "bg-green-500" };
  };
  const strength = calculateStrength(password);
  if (!password && strength.score === 0) return null;
  return (
    <div className="mt-1.5">
      <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-200"><div className={`transition-all duration-300 ease-in-out ${strength.colorClass}`} style={{ width: `${(strength.score / 4) * 100}%` }}></div></div>
      <p className={`text-xs mt-1 ${strength.score <= 1 ? 'text-red-500' : strength.score <=2 ? 'text-yellow-600' : strength.score <=3 ? 'text-blue-600' : 'text-green-600'}`}>Kekuatan Password: {strength.text}</p>
    </div>
  );
};

const countryCodeOptions = [ { code: "+62", name: "Indonesia", flag: "🇮🇩" }, { code: "+1", name: "United States", flag: "🇺🇸" }, { code: "+44", name: "United Kingdom", flag: "🇬🇧" }];

const AccountSettingsBM: React.FC<AccountSettingsBMProps> = ({ organizationData, onUpdatePhoneNumber, onUpdateProfilePicture, onUpdatePassword }) => {
  const [localPhoneNumber, setLocalPhoneNumber] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState("+62");
  const [isPhoneNumberDisabled, setIsPhoneNumberDisabled] = useState(!!organizationData.phoneNumber);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [phoneNumberToConfirm, setPhoneNumberToConfirm] = useState('');
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(organizationData.profilePictureUrl || null);
  const [selectedProfilePictureFile, setSelectedProfilePictureFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOldPasswordInternal, setShowOldPasswordInternal] = useState(false);
  const [showNewPasswordInternal, setShowNewPasswordInternal] = useState(false);
  const [showConfirmNewPasswordInternal, setShowConfirmNewPasswordInternal] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{new?:string, confirm?:string}>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);


  useEffect(() => {
    setIsPhoneNumberDisabled(!!organizationData.phoneNumber);
    if (organizationData.phoneNumber) {
      const matchedOption = countryCodeOptions.find(opt => organizationData.phoneNumber!.startsWith(opt.code));
      if (matchedOption) { setSelectedCountryCode(matchedOption.code); setLocalPhoneNumber(organizationData.phoneNumber!.substring(matchedOption.code.length)); }
      else { setLocalPhoneNumber(organizationData.phoneNumber!); }
    } else { setLocalPhoneNumber(''); }
    setProfilePicturePreview(organizationData.profilePictureUrl || null);
  }, [organizationData.phoneNumber, organizationData.profilePictureUrl]);

  const handleSavePhoneNumber = () => {
    if (!localPhoneNumber.trim()) { alert("Nomor telepon tidak boleh kosong."); return; }
    const fullNumber = selectedCountryCode + localPhoneNumber.trim();
    setPhoneNumberToConfirm(fullNumber); setShowConfirmModal(true);
  };
  const confirmPhoneNumberSave = () => { onUpdatePhoneNumber(phoneNumberToConfirm); setIsPhoneNumberDisabled(true); setShowConfirmModal(false); };
  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]; setSelectedProfilePictureFile(file);
      const reader = new FileReader(); reader.onloadend = () => setProfilePicturePreview(reader.result as string); reader.readAsDataURL(file);
    }
  };
  const handleSaveProfilePicture = () => { if (profilePicturePreview && selectedProfilePictureFile) { onUpdateProfilePicture(profilePicturePreview); setSelectedProfilePictureFile(null); } };
  const handleCancelProfilePictureChange = () => { setSelectedProfilePictureFile(null); setProfilePicturePreview(organizationData.profilePictureUrl || null); };
  const validatePasswordForm = () => {
    const errors: {new?:string, confirm?:string} = {};
    if (!newPassword) errors.new = "Password baru tidak boleh kosong."; else if (newPassword.length < 8) errors.new = "Password baru minimal 8 karakter.";
    if (newPassword !== confirmNewPassword) errors.confirm = "Konfirmasi password baru tidak cocok.";
    setPasswordErrors(errors); return Object.keys(errors).length === 0;
  };
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(validatePasswordForm()){ if (!oldPassword) { alert("Password lama tidak boleh kosong."); return; } onUpdatePassword(oldPassword, newPassword); setOldPassword(''); setNewPassword(''); setConfirmNewPassword(''); setShowPasswordForm(false); }
  };

  const renderInfoField = (label: string, value: string | undefined | null, Icon: React.ElementType, type: string = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon className="h-5 w-5 text-gray-400" /></div>
        <input type={type} value={value || ''} disabled className="w-full py-2.5 pl-10 pr-3 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-500 cursor-not-allowed disabled:text-gray-400"/>
      </div>
    </div>
  );

  const renderPasswordField = (id:string, label: string, value: string, setter: (val:string)=>void, showToggler: ()=>void, isShown: boolean, error?: string, disabled?: boolean) => (
    <div>
      <label htmlFor={id} className={`block text-sm font-medium mb-1 ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
        <input type={isShown ? "text" : "password"} id={id} value={value} onChange={(e) => setter(e.target.value)} required={!disabled} disabled={disabled}
               className={`w-full py-2.5 pl-10 pr-10 border rounded-lg shadow-sm focus:ring-1 focus:ring-hegira-turquoise transition-colors text-sm bg-white ${error ? 'border-red-500' : 'border-gray-300'} ${disabled ? 'text-gray-400 cursor-not-allowed' : ''}`} placeholder={label}/>
        <button type="button" onClick={showToggler} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-hegira-navy" disabled={disabled}>{isShown ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
      </div>
      {id === 'newPassword' && !error && !disabled && <PasswordStrengthIndicator password={value}/>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-hegira-deep-navy mb-8">Pengaturan Akun Organisasi</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="text-center mb-8">
          <div className="relative w-36 h-36 rounded-full mx-auto mb-3 group">
            <img src={profilePicturePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(organizationData.organizationName)}&background=18093B&color=FFFFFF&size=144`} alt="Logo Organisasi" className="w-full h-full rounded-full object-cover border-4 border-hegira-turquoise/30"/>
            <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" aria-label="Ubah logo"><Camera size={32} /></button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleProfilePictureChange} accept="image/*" className="hidden"/>
          {selectedProfilePictureFile && (<div className="flex justify-center gap-2 mt-3"><button onClick={handleSaveProfilePicture} className="text-xs bg-green-500 hover:bg-green-600 text-white font-semibold py-1.5 px-3 rounded-md transition-colors flex items-center gap-1"><Save size={14}/> Simpan</button><button onClick={handleCancelProfilePictureChange} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1.5 px-3 rounded-md transition-colors">Batal</button></div>)}
          <h2 className="text-xl font-semibold text-hegira-navy mt-3">{organizationData.organizationName}</h2>
          <p className="text-sm text-gray-500">{organizationData.email}</p>
        </div>
        <div className="space-y-6 max-w-2xl mx-auto">
          {renderInfoField("Nama Organisasi", organizationData.organizationName, Briefcase)}
          {renderInfoField("Kontak Person", organizationData.contactPerson, UserCircle)}
          {renderInfoField("Email Organisasi", organizationData.email, Mail)}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-500 mb-1">Nomor Telepon</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-shrink-0">
                 <select id="countryCode" name="countryCode" value={selectedCountryCode} onChange={(e) => setSelectedCountryCode(e.target.value)} disabled={isPhoneNumberDisabled} className="appearance-none z-10 h-full block w-auto py-2.5 pl-3 pr-8 text-sm border rounded-l-lg focus:ring-hegira-turquoise focus:border-hegira-turquoise bg-white disabled:bg-white disabled:text-gray-400 disabled:cursor-not-allowed border-gray-300">
                  {countryCodeOptions.map(opt => (<option key={opt.code} value={opt.code}>{opt.flag} {opt.code}</option>))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
              </div>
              <div className="relative flex-grow"><input type="tel" id="phoneNumber" name="phoneNumber" value={localPhoneNumber} onChange={(e) => setLocalPhoneNumber(e.target.value.replace(/\D/g, ''))} disabled={isPhoneNumberDisabled} placeholder="81234567890" className="w-full py-2.5 px-3 border border-gray-300 rounded-r-lg shadow-sm focus:ring-hegira-turquoise focus:border-hegira-turquoise text-sm bg-white disabled:bg-white disabled:text-gray-400 disabled:cursor-not-allowed"/></div>
              {!isPhoneNumberDisabled && (<button onClick={handleSavePhoneNumber} className="p-2.5 bg-hegira-turquoise text-white rounded-lg hover:bg-opacity-90 transition-colors flex-shrink-0" aria-label="Simpan Nomor Telepon" title="Simpan Nomor Telepon"><Save size={20} /></button>)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Password Saat Ini</label>
            <div className="flex items-center gap-2">
                <div className="relative flex-grow"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/><input type={showCurrentPassword ? "text" : "password"} value={organizationData.currentPassword || '••••••••'} disabled className="w-full py-2.5 pl-10 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-400 cursor-not-allowed"/><button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-hegira-navy">{showCurrentPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div>
                {!showPasswordForm && (<button onClick={() => setShowPasswordForm(true)} className="flex-shrink-0 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-600 font-semibold py-2.5 px-3 rounded-lg hover:bg-gray-200 transition-colors text-xs" title="Ubah Password"><ShieldCheck size={14} /> Ubah</button>)}
            </div>
          </div>
          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-md font-semibold text-hegira-deep-navy">Formulir Ubah Password</h3>
              {renderPasswordField("oldPassword", "Password Lama", oldPassword, setOldPassword, () => setShowOldPasswordInternal(!showOldPasswordInternal), showOldPasswordInternal)}
              {renderPasswordField("newPassword", "Password Baru", newPassword, setNewPassword, () => setShowNewPasswordInternal(!showNewPasswordInternal), showNewPasswordInternal, passwordErrors.new)}
              {renderPasswordField("confirmNewPassword", "Konfirmasi Password Baru", confirmNewPassword, setConfirmNewPassword, () => setShowConfirmNewPasswordInternal(!showConfirmNewPasswordInternal), showConfirmNewPasswordInternal, passwordErrors.confirm)}
              <div className="flex flex-col sm:flex-row gap-3"><button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-hegira-yellow text-hegira-navy font-bold py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-sm"><Save size={16}/> Simpan Password Baru</button><button type="button" onClick={() => { setShowPasswordForm(false); setOldPassword(''); setNewPassword(''); setConfirmNewPassword(''); setPasswordErrors({});}} className="w-full sm:w-auto text-sm text-gray-600 hover:text-gray-800 py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-100">Batal</button></div>
            </form>
          )}
        </div>
      </div>
      {showConfirmModal && (<ConfirmationModal isOpen={showConfirmModal} title="Konfirmasi Nomor Telepon" message={`Apakah Anda yakin nomor telepon ${phoneNumberToConfirm} sudah benar?`} confirmText="Ya, Simpan" cancelText="Batal" onConfirm={confirmPhoneNumberSave} onCancel={() => setShowConfirmModal(false)} icon={Info} iconColorClass="text-hegira-turquoise" confirmButtonClass="bg-hegira-turquoise hover:bg-opacity-90 text-white"/>)}
    </div>
  );
};

export default AccountSettingsBM;
