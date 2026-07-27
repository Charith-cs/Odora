import { useEffect, useState } from "react";
import UserManagement from "../../../components/dashComponents/adminDash/UserManagement"
import API from "../../../../api/axios";


const UserSetting = () => {

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get(`/management/registeredUsers/${currentUser._id}`, { params: { role: "user" } });
      setUsers(res.data);
    } catch (err) {
      console.error("Oops! Something went wrong");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [currentUser._id]);

  return (
    <div className="mt-6 grid grid-cols-1">
      <UserManagement data={users} refresh={fetchUsers} />
    </div>
  )
}

export default UserSetting