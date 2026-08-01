import SharedEditView from '../../../components/dashComponents/adminDash/SharedEditView'
import { adminEditViewDoctorTitle, DoctorEditViewColumns, doctorCardTitle, doctorCardLabel } from '../../../../data';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import type { DoctorUpdateLabelType, editViewDoctor } from '../../../../types/types';

const EditViewDoctor = () => {

  const { id } = useParams();

  const [doctorDetails, setDoctorDetails] = useState<any[]>([]);
  const [appointmentDetails, setAppointmentDetails] = useState<any[]>([]);

  const fetchDoctordetails = async () => {
    try {

      const res = await API.get(`/management/view_edit_user/${id}`, { params: { role: "doctor" } });
      setDoctorDetails(res.data.doctorDetails || []);
      setAppointmentDetails(res.data.appointmentDetails || []);

    } catch (err) {
      toast.error("Oops! Something went wrong");
    }
  }

  useEffect(() => {
    fetchDoctordetails();
  }, [id]);

  const doctorCard = {
    name: `${doctorDetails[0]?.userId?.firstName || ""} ${doctorDetails[0]?.userId?.lastName || ""}`,
    email: doctorDetails[0]?.userId?.email || "",
    slmc: doctorDetails[0]?.slmcReg || "",
    tpnum: doctorDetails[0]?.userId?.mobileNumber || "",
    img: doctorDetails[0]?.userId?.img || "",
  }

  const adminDoctorEditViewTable: editViewDoctor[] =
    appointmentDetails.map((item) => ({
      appNumber: item?.appointmentId?._id,
      patient: `${item?.userId?.firstName || ""} ${item?.userId?.lastName || ""}`,
      date: item?.appointmentId?.dateTime
        ? new Date(item.appointmentId.dateTime).toDateString()
        : "",

      treatments: item?.treatmentId?.treatments
        ?.map((t: any) => t.name)
        .join(", "),

      amount: item?.amount,
    }));

  const doctorUpdateLabel: DoctorUpdateLabelType[] = [
    { key: "firstName", label: "First name :", placeholder: doctorDetails[0]?.userId?.firstName, type: "text" },
    { key: "lastName", label: "Last name :", placeholder: doctorDetails[0]?.userId?.lastName, type: "text" },
    { key: "email", label: "Email", placeholder: doctorDetails[0]?.userId?.email, type: "text" },
    { key: "mobileNumber", label: "Mobile number :", placeholder: doctorDetails[0]?.userId?.mobileNumber, type: "text" },
    { key: "address", label: "Address :", placeholder: doctorDetails[0]?.userId?.address, type: "text" },
    { key: "birthDay", label: "Birth Day :", placeholder: doctorDetails[0]?.userId?.birthDay, type: "date" },
    { key: "gender", label: "Gender :", placeholder: doctorDetails[0]?.userId?.gender, type: "text" },

    { key: "slmcReg", label: "SLMC :", placeholder: doctorDetails[0]?.slmcReg, type: "text" },
    { key: "university", label: "University :", placeholder: doctorDetails[0]?.university, type: "text" },
    { key: "experience", label: "Experience :", placeholder: doctorDetails[0]?.experience, type: "text" },
    { key: "consultationFee", label: "Consultation Fee :", placeholder: doctorDetails[0]?.consultationFee, type: "text" },
    { key: "specialization", label: "Specialization :", placeholder: doctorDetails[0]?.specialization.map((s: any) => (s)).join(" , "), type: "text" },
    { key: "desc", label: "Description :", placeholder: doctorDetails[0]?.desc, type: "text" },
    { key: "degree", label: "Name of the degree :", placeholder: doctorDetails[0]?.degree, type: "text" },


  ];

  return (
    <div className="mt-6">
      <SharedEditView
        dataColumns={DoctorEditViewColumns}
        tableData={adminDoctorEditViewTable}
        tableTitle={adminEditViewDoctorTitle}
        title={doctorCardTitle}
        label={doctorCardLabel}
        data={doctorCard}
        updateLabel={doctorUpdateLabel}
        isUser={false}
      />
    </div>
  )
}

export default EditViewDoctor;