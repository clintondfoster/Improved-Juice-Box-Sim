import { useState }  from "@reduxjs/toolkit";
import { 
    useLoginMutation,
    useRegistrationMutation,
    } from "../reducers/authSlice";
import { useSelector } from "@reduxjs/toolkit";
import TextInput from "./inputs/TextInput";

//AuthForm to either login or register for an account
function AuthForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth.credentials); 

    const [login] = useLoginMutation();
    const [register] = useRegistrationMutation();
    const [logout] = useLogoutMutation();

    const [isLogin, setIsLogin] = useState(true);
    const authType = isLogin ? "Login" : "Register";
    const oppositeAuthCopy = isLogin ? "Don't have an account?" : "Already have an account?";
    const oppositeAuthType = isLogin ? "Register" : "Login";

    //Send cred to server for authentication
    async function attemptAuth(e) {
        e.preventDefault();
        setError(null);

        const authMethod = isLogin ? login : register;
        const credentials = { username, password };

        try {
            setLoading(true);
            await authMethod(credentials).unwrap();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.data);
        }
    }

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Error logging out:", error)
        }
    };

    if (token) {
        return (
            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    }

return (
    <main>
        <h1>{authType}</h1>
        <form onSubmit={attemptAuth} name={authType}>
            <label>
                Username 
                <TextInput vl={username} type='text' chg={setUsername} />
            </label>
            <label>
                Password
                <TextInput vl={password} type='password' chg={setPassword} />
            </label>
            <button type="submit">{authType}</button>
        </form>
        <p>
            {oppositeAuthCopy}{" "}
            <a onClick={() => setIsLogin(!isLogin)}>
                {oppositeAuthType}
            </a>
        </p>
        {loading && <p>Logging in...</p>}
        {error && <p>{error}</p>}
    </main>
    );
}

export default AuthForm;