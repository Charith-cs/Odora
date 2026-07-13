import { useEffect, useState } from 'react';
import DoctorManagement from '../../../components/dashComponents/adminDash/DoctorManagement'
import API from '../../../../api/axios';

const DoctorSetting = () => {

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [doctors , setDoctors] = useState<any[]>([]);


  useEffect(()=>{
    const fetchUsers = async () => {
      try{
        const res = await API.get(`/management/registeredUsers/${currentUser._id}` ,{params:{role:"doctor"}});
        setDoctors(res.data);
      }catch(err){
        console.error("Oops! Something went wrong");
      }
    }
    fetchUsers();
  },[currentUser._id]);

  return (
      <div className="mt-6 grid grid-cols-1">
      <DoctorManagement data={doctors}/>
    </div>
  )
}
 
export default DoctorSetting