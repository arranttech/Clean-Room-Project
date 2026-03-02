import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../../backend/controller/controller";
import AddUser from "./addUsers";

export default function EditUser() {
  const { id } = useParams();
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const res = await getUserById(Number(id));
      if (res.success) setEditUser(res.user);
      setLoading(false);
    };
    loadUser();
  }, [id]);

  if (loading) return <div>Loading user...</div>;
  if (!editUser) return <div>User not found.</div>;

  return (
    <AddUser
      user={editUser}
      onCancel={() => window.history.back()}
      onSaved={() => window.history.back()}
    />
  );
}
