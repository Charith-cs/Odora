import Charts from '../../../components/dashComponents/doctorDash/Charts'
import { data } from '../../../../data'
import { doctorConfig } from '../../../../types/constants'
import { useEffect, useState } from 'react';
import API from '../../../../api/axios';
import toast from 'react-hot-toast';

const MyPerformance = () => {

    const [cData, setCData] = useState<[]>([]);
     const currentUser = JSON.parse(localStorage.getItem("user") || "null");

            useEffect(() => {
        const fetchCData = async () => {
            try {
                const chartData = await API.get(`/dash/data/${currentUser._id}`)
                console.log(chartData.data)
                setCData(chartData.data.chartData);
            } catch (err: any) {
                toast.error(err?.response?.data?.message || "Oops! Something went wrong");
            }
        }
        fetchCData();
    }, [currentUser._id]);

    const monthlyAverage =
    cData.length > 0
        ? (cData.reduce((sum, item) => sum + (item.patients || 0), 0) / cData.length)
        : 0;
  return (
    <div className="mt-6 grid grid-cols-1 gap-10 ">
        <div className=" flex justify-between items-center">
            <h1 className="  text-2xl font font-semibold">
                My Performance
            </h1>
            <span className=" flex flex-col">
                <h1 className="font-semibold text-gray-600">Monthly Avg:{monthlyAverage < 0 ? "0" : monthlyAverage.toFixed()}+ per Day</h1>
            </span>
           
        </div>
         <Charts data={cData} config={doctorConfig}/>
    </div>
  )
}

export default MyPerformance