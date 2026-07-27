import toast from 'react-hot-toast'
import PatientsComponent from '../../../components/dashComponents/staffDash/PatientsComponent'
import API from '../../../../api/axios'
import { useEffect, useState } from 'react';

const Patients = () => {

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [userDetails, setUserDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchedUserDetails = async () => {
      try {
        if (currentUser.role === "doctor") {
          let res = await API.get(`/user/my_patients/${currentUser._id}`);
          setUserDetails(res.data.usersDetails);
        } else if (currentUser.role === "staff") {
          const clinic = await API.get(`/staff/clinicId/${currentUser._id}`);
          if (clinic.status === 200) {
            let res = await API.get(`/user/my_patients/${clinic?.data.clinic}`);
            setUserDetails(res.data.usersDetails);
          } else {
            toast.error("Oops! Something went wrong")
          }
        }

      } catch (err) {
        toast.error("Oops! Somrthng went wrong");
      }
    }
    fetchedUserDetails();
  }, [currentUser._id]);


  return (
    <div className="">
      <PatientsComponent data={userDetails} />
    </div>
  )
}

export default Patients