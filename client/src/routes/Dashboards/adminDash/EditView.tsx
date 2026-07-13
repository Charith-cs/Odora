import SharedEditView from '../../../components/dashComponents/adminDash/SharedEditView';
import { adminEditViewUserTitle, userEditViewColumns } from '../../../../data';
import { userCardLabel, userCardTitle } from '../../../../data'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import API from '../../../../api/axios';

const EditView = () => {

  const { id } = useParams();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [appointmentDetails, setAppointmentDetails] = useState<any[]>([]);

  const fetchUserdetails = async () => {
    try {
      const res = await API.get(`/management/view_edit_user/${id}`,{params:{role:"user"}});
      setUserDetails(res.data.userDetails);
      setAppointmentDetails(res.data.appointmentDetails);
    } catch (err) {
      toast.error("Oops! Something went wrong");
    }
  }

  useEffect(() => {
    fetchUserdetails();
  }, [id]);

  //formatted Data

  const userCard = {
    name: `${userDetails?.firstName + " " + userDetails?.lastName}`,
    email: `${userDetails?.email}`,
    bday: `${userDetails?.birthDay}`,
    tpnum: `${userDetails?.mobileNumber}`,
    img: `${userDetails?.img}`,
  }

  const adminUserEditViewTable = appointmentDetails.map((item: any) => ({
    doctor: `${item?.doctorId?.firstName + " " + item?.doctorId?.lastName}`,
    date: new Date(item?.appointmentId?.dateTime).toLocaleString(),
    treatments: `${item?.treatmentId?.treatments.map((t: any) => ([
      t.name
    ]))}`,
    amount: `${item?.amount}`,
  }));

  const userUpdateLabel = [
    { key: "firstName", label: "First name :", placeholder: userDetails?.firstName, type:"text" },
    { key: "lastName", label: "Last name :", placeholder: userDetails?.lastName  ,type:"text"},
    { key: "email", label: "Email :", placeholder: userDetails?.email ,type:"text" },
    { key: "mobileNumber", label: "Mobile number :", placeholder: userDetails?.mobileNumber , type:"text"},
    { key: "birthDay", label: "Birth Day :", placeholder: userDetails?.birthDay , type:"date"},
    { key: "gender", label: "Gender :", placeholder: userDetails?.gender  ,type:"text"},
    { key: "address", label: "Address :", placeholder: userDetails?.address , type:"text"},
  ];

  return (
    <div className=" mt-6">
      <SharedEditView
        dataColumns={userEditViewColumns}
        tableData={adminUserEditViewTable}
        tableTitle={adminEditViewUserTitle}
        title={userCardTitle}
        label={userCardLabel}
        data={userCard}
        updateLabel={userUpdateLabel}

        ///////////
        performanceData={[]}
        revenueData={[]}
        performanceConf={{}}
        revenueConf={{}}
        isUser={true}
      />
    </div>
  )
}

export default EditView