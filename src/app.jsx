import { Route, Routes } from "react-router-dom";
import AuthForm from './components/AuthForm';
import UserPosts from './pages/UserPosts';
import Posts from './pages/Posts';
import { useSelector } from "react-redux";
import { useGetPostsQuery } from "./reducers/postSlice";
import { useEffect, useState } from "react";


function App() {
    
    const me = useSelector((state) => state.auth.credentials.user);
    const data = useSelector(state=> state.data);
    const posts = useGetPostsQuery();

    const [load, setLoad] = useState(true);

    useEffect(()=> {
        setLoad(posts.isLoading)
    }, [posts])

    const guestRouter = (
        <Routes>
            <Route path="/*" element={<AuthForm/>}/>;
        </Routes>
    );
    const userRouter = (
        <Routes>
            <Route path={"/posts"} element={<Posts/>}/>
            <Route path={"/user"} element={<UserPosts/>}/>
        </Routes>
    );
    

    const loggedIn = me.userId;
    return load? <h1>LoadingData</h1>: loggedIn !== null ? userRouter : guestRouter;
}

export default App;
