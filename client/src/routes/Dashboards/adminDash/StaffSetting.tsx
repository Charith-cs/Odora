import { useEffect, useState } from 'react';
import StaffManagement from '../../../components/dashComponents/adminDash/StaffManagement'
import API from '../../../../api/axios';

const StaffSetting = () => {

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [staff, setStaff] = useState<any[]>([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get(`/management/registeredUsers/${currentUser._id}`, { params: { role: "staff" } });
        setStaff(res.data);
      } catch (err) {
        console.error("Oops! Something went wrong");
      }
    }
    fetchUsers();
  }, [currentUser._id]);



  return (
    <div className="mt-6 grid grid-cols-1">
      <StaffManagement data = {staff}/>
    </div>
  )
}

export default StaffSetting