"use client";
import CheckBox from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { isEnglish } from "@/lib/utils";
import SelectInput from "@/components/ui/select-input";
import { useEffect, useState } from "react";
import { useDevice } from "@/lib/useDevice";

const Form = () => {
  const isDesktop = useDevice();

  const renderTitle = () => {
    const text = isEnglish()
      ? "Collaboration_& Partnership"
      : "Kolaborasi_& Kemitraan";
    const newText = text.split("_");

    return (
      <p className="uppercase font-semibold text-4xl">
        {newText[0]} <span className="text-green-light">{newText[1]}</span>
      </p>
    );
  };

  const [formData, setFormData] = useState<{ [key: string]: string | boolean }>(
    {
      name: "",
      company: "",
      address: "",
      email: "",
      phone: "",
      collaboration_type: "",
      notes: "",
      attachment: "",
    }
  );

  const [, setEmptyFields] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    id: 0,
    name: "Jenis Kolaborasi",
  });

  useEffect(() => {
    const emptyFieldsList = Object.entries(formData)
      .filter(([, value]) => value === "")
      .map(([key]) => key);

    setEmptyFields(emptyFieldsList);
    setIsFormValid(emptyFieldsList.length === 0 && isChecked);
  }, [formData, isChecked]);

  const handleTextinput = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Mengupdate hanya field yang berubah
    }));
  };

  const handleChangeCheckBox = (checked: boolean) => {
    setIsChecked(checked);
  };

  const handleSelectChange = (value: { id: number; name: string }) => {
    setSelectedOption(value);
    setFormData({
      ...formData,
      collaboration_type: value.id !== 0 ? value.name : "",
    });
  };

  const sendEmail = () => {
    const emailBody = `
			Salam Kolaborasi Pertamina Retail! 
			
			Kami sangat terkesan dengan pencapaian dan reputasi Perusahaan Anda, bersama ini:

				1. Nama: ${formData.name}
				2. Perusahaan: ${formData.company}
				3. Alamat: ${formData.address}
				4. File Attachment: ${formData.attachment}
				5. Email: ${formData.email}
				6. No. Telepon: ${formData.phone}
				7. Tipe Kolaborasi: ${formData.collaboration_type}
				8. Catatan: ${formData.notes}


				Kami melihat potensi untuk bekerja sama dalam program tersebut,  kolaborasi dapat membawa dampak positif, menciptakan solusi yang lebih efektif dan berkelanjutan.

				Kami sangat menghargai perhatian Anda, serta berharap dapat membangun kolaborasi yang bermanfaat bagi masyarakat dan lingkungan.

				Salam SINERGI
			`
      .trim()
      .replace(/\n/g, "%0A");

    const mailClient = "raditprogrammer.asets@gmail.com";
    const emailRoute = isDesktop
      ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
          mailClient
        )}&su=${encodeURIComponent(
          "Req. Kolaborasi & Kemitraan - Keberlanjutan"
        )}&body=${emailBody}`
      : `mailto:${mailClient}?subject=Booking%20Order%20-%20Payment%20Confirmation&body=${emailBody}`;

    const mailtoLink = emailRoute;

    window.open(mailtoLink, "_blank");
  };

  return (
    <section
      id="form-collaboration-partnership"
      className="flex justify-center md:mt-10 mt-8"
    >
      <section>
        <header className="text-center">
          {renderTitle()}
          <p className="mt-4">
            Salurkan aspirasi anda melalui berbagai bentuk kegiatan kerja sama
            CSR
          </p>
        </header>
        <div className="md:px-0">
          <TextInput
            label={"Nama"}
            name="name"
            placeholder="Masukkan nama Anda"
            type="text"
            onChange={handleTextinput}
          />
          <TextInput
            label={"Yayasan/Institusi/Perusahaan"}
            name="company"
            placeholder="Masukkan nama Yayasan/Institusi/Perusahaan Anda"
            type="text"
            onChange={handleTextinput}
          />
          <TextInput
            label={"Alamat"}
            name="address"
            placeholder="Masukkan alamat Anda"
            type="text"
            onChange={handleTextinput}
          />
          <TextInput
            label={"Email"}
            name="email"
            placeholder="Masukkan email Anda"
            type="email"
            onChange={handleTextinput}
          />
          <TextInput
            label={"Nomor Telepon"}
            name="phone"
            placeholder="Masukkan nomor telepon Anda"
            type="tel"
            onChange={handleTextinput}
          />
          <SelectInput
            label="Jenis Kolaborasi"
            name="collaboration_type"
            selected={selectedOption}
            onChange={handleSelectChange}
          />
          <TextInput
            label={"Link PDF"}
            name="attachment"
            placeholder="Masukkan Link File PDF Anda"
            type="text"
            onChange={handleTextinput}
          />
          <TextInput
            label={"Catatan"}
            name="notes"
            placeholder="Masukkan catatan Anda disini"
            type="text"
            onChange={handleTextinput}
          />
          <CheckBox checked={isChecked} onChange={handleChangeCheckBox} />
          <Button
            onClick={sendEmail}
            className="md:mx-0 mx-4 bg-green-light disabled:bg-[#005CAB]/[.60] text-white mt-4 w-[172px] h-[56px] uppercase"
            disabled={!isFormValid}
          >
            Daftar
          </Button>
        </div>
      </section>
    </section>
  );
};

export default Form;
