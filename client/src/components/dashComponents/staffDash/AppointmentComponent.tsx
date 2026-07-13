import { useEffect, useState } from 'react';
import API from '../../../../api/axios';
import Appointments from '../../../routes/Dashboards/staffDash/Appointments';
import { toast } from 'react-hot-toast';

const AppointmentComponent = () => {

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [appointments , setAppointments] = useState<[]>([]);

  const fetchAppointments = async () => {
    try{
      const res = await API.get(`appointment/get/${currentUser._id}`);
      setAppointments(res.data);
    }catch(err){
      toast.error("Oops! something went wrong");
    }
  }

  useEffect(()=>{
    fetchAppointments();
  },[currentUser._id]);

  return (
    <div>
      <Appointments data = {appointments} refreshAppointments={fetchAppointments}/>
    </div>
  )
}

export default AppointmentComponent
