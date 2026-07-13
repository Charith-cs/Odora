import SharedEditView from '../../../components/dashComponents/adminDash/SharedEditView'
import { adminEditViewStaffTitle, adminStaffEditViewTable, StaffEditViewColumns, staffCardTitle, staffCardLabel, staffCard, StaffUpdateLabel, staffPerData, StaffRevData } from '../../../../data';
import { staffPerConfig, staffRevConfig } from '../../../../types/constants';
import type { AdminstaffCard, editViewStaff } from '../../../../types/types';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../../../../api/axios';
import { toast } from 'react-hot-toast';

const EditViewStaff = () => {

    const { id } = useParams();

    const [staffDetails, setStaffDetails] = useState<any[]>([]);
    const [appointmentDetails, setAppointmentDetails] = useState<any[]>([]);
    const [monthly, setMonthly] = useState<any[]>([]);
    const [weekly, setWeekly] = useState<any[]>([]);

    const fetchStaffdetails = async () => {
        try {

            const res = await API.get(`/management/view_edit_user/${id}`, { params: { role: "staff" } });
            setStaffDetails(res.data.staffDetails || []);
            setAppointmentDetails(res.data.appointmentDetails || []);

        } catch (err) {
            toast.error("Oops! Something went wrong");
        }
    };

    const fetchchartData = async () => {
        try {
            const res = await API.get(`/dash/per_rev_data/${id}`);
            setMonthly(res.data.monthly);
            setWeekly(res.data.weekly);
        } catch (err) {
            toast.error("Oops! Something went wrong");
        }
    }

    useEffect(() => {
        fetchStaffdetails();
        fetchchartData();
    }, [id]);


    const staffCard: AdminstaffCard = {
        name: staffDetails[0]?.userId?.firstName + " " + staffDetails[0]?.userId?.lastName,
        clinic: staffDetails[0]?.clinic?.clinicName,
        tpnum: staffDetails[0]?.userId?.mobileNumber,
        createdAt: new Date(staffDetails[0]?.userId?.createdAt).toDateString(),
    };

    const adminStaffEditViewTable: editViewStaff[] =
        appointmentDetails.map((item: any) => ({
            appNumber: item?.appointmentId?._id,
            doctor: "Dr." + item?.doctorId?.firstName + " " + item?.doctorId?.lastName,
            patient: item?.userId?.firstName + " " + item?.userId?.lastName,
            date: new Date(item?.createdAt).toDateString(),
            treatments: item?.treatmentId?.treatments
                ?.map((t: any) => t.name)
                .join(", "),
            amount: item?.amount,
        }));

    const StaffUpdateLabel = [
    { key: "firstName", label: "First name :", placeholder: staffDetails[0]?.userId?.firstName, type: "text" },
    { key: "lastName", label: "Last name :", placeholder: staffDetails[0]?.userId?.lastName, type: "text" },
    { key: "email", label: "Email", placeholder: staffDetails[0]?.userId?.email, type: "text" },
    { key: "mobileNumber", label: "Mobile number :", placeholder: staffDetails[0]?.userId?.mobileNumber, type: "text" },
    { key: "address", label: "Address :", placeholder: staffDetails[0]?.userId?.address, type: "text" },
    { key: "birthDay", label: "Birth Day :", placeholder: staffDetails[0]?.userId?.birthDay, type: "date" },
    { key: "gender", label: "Gender :", placeholder: staffDetails[0]?.userId?.gender, type: "text" },
    ];

    return (
        <div className=" mt-6">
            <SharedEditView
                dataColumns={StaffEditViewColumns}
                tableData={adminStaffEditViewTable}
                tableTitle={adminEditViewStaffTitle}
                title={staffCardTitle}
                label={staffCardLabel}

                data={staffCard}
                updateLabel={StaffUpdateLabel}

                performanceData={monthly}
                revenueData={weekly}

                performanceConf={staffPerConfig}
                revenueConf={staffRevConfig}
                isUser={false}
            />
        </div>
    )
}

export default EditViewStaff