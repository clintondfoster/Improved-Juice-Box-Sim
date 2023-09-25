import { Link } from "react-router-dom";
import { useLogoutMutation } from "../reducers/authSlice";
import { useSelector } from "react-redux";

function Nav() {

    const [logout] = useLogoutMutation();
    const user = useSelector((state)=>state.auth.credentials.user) || "";

    return (
        <nav>
            <div>
                <Link to={"/"}>HOME</Link>
                <Link to={"/posts"}>Posts</Link>
                {user.userId && <Link to={"/user"}>Profile</Link>}
                {user.userId && <button onClick={logout}>Logout</button>}
            </div>
            {user.userId && <h1>Welcome {user.username}</h1>}
        </nav>
    )
}

export default Nav;
