import { useLocation } from 'react-router-dom';
import { PastappointmentColumns } from '../../../../data';
import Table from '../../../components/dashComponents/adminDash/Table';

const PastAppointments = () => {

    const location = useLocation();
    const pastData = location.state?.data || [];

    const formattedData = pastData.map((item: any) => ({
        doctor: item?.doctorId?.firstName + " " + item?.doctorId?.lastName,
        appointmentDate: new Date(item?.appointmentId?.dateTime).toLocaleDateString("en-GB"),
        treatments: item?.treatments?.map((t: any) => `${t.name}` + " - " + `${t.price}`).join(", "),
        note: item?.note ? item.note : "No added note",
    }));

    console.log(formattedData);

    return (
        <div>
            <Table
                columns={PastappointmentColumns} 
                data={formattedData}
                title={"Past Appointments"}
            /*                 actions={(_row) => (
                                <div className="flex gap-2">
                                    <Link to={`/view_edit/${_row._id}`} className="px-3 py-1 rounded-lg border text-gray-600 hover:text-sky-500 hover:border-sky-500 transition">View</Link>
                                    <button className="px-3 py-1 rounded-lg border text-gray-600 hover:text-red-500 hover:border-red-500 transition">Delete</button>
                                </div>
                            )} */
            />
        </div>
    )
}

export default PastAppointments
