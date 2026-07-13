import API from "../api/axios";

export const loginUser = async (data: { email: string, password: string }) => {
    const res = await API.post("auth/login", data);
    return res.data;
};

export const registerUser = async (data: any) => {
    const res = await API.post("/auth/register", data);
    return res.data;
}

export const updateUser = async (id: string, data: FormData) => {
  const res = await API.put(`/auth/update/${id}`, data);
  return res.data;
};