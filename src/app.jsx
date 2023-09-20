import { Route, Routes } from "react-router-dom";
import AuthForm from './components/AuthForm';
import Posts from './components/Posts';
import { useSelector } from "react-redux";




function App() {
    
    const me = useSelector((state) => state.auth.credentials.user);

    const guestRouter = (
        <Routes>
            <Route path="/*" element={<AuthForm/>}/>;
        </Routes>
    );
    const userRouter = (
        <Routes>
            <Route path={"/posts"} element={<Posts/>}/>
        </Routes>
    );
    

    const loggedIn = me.userId;
    return loggedIn !== null ? userRouter : guestRouter;
}

export default App;
