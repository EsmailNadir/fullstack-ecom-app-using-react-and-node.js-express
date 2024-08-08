import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
const navigate = useNavigate();

const handleLogOut = () => {
    localStorage.removeItem("token")
    navigate("/login")
}
return(
<button onClick={handleLogOut}>log out</button>
)




};
export default Logout;