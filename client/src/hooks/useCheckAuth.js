import { loginuser, logoutuser } from "../redux/userslice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

export const checkAuth = async (dispatch) => {
  try {
    const res = await axios.get("http://localhost:5000/logindetails", {
      withCredentials: true,
    });

    if (res.status === 200) {
      dispatch(loginuser(res.data));


    } else {
      dispatch(logoutuser());
    }
  } catch (error) {
    console.log(error);
    dispatch(logoutuser());
  }
};

// ✅ Hook version (safe only at top-level of components)
const useCheckAuth = () => {
    
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth(dispatch).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  return { loading };
};

export default useCheckAuth;