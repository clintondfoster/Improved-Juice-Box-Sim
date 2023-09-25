import { useGetPostsQuery } from "../reducers/postSlice";
import { useSelector } from "react-redux";
import Button from "../components/inputs/Button";

function Posts() {
    const {data, isLoading} = useGetPostsQuery();
    const me = useSelector((state) => state.auth.credentials.user);

    console.log(me)

    return (
        <>
            {isLoading?<h1>Loading...</h1>: data.length === 0 ? <h1>No Posts Listed</h1> : data.map((i)=>
            <div key={i.id}>
                <h1>{i.text}</h1>
                {me.admin&&<Button form={false} vl={"DELETE"} theme={"primary"} click={()=> console.log("Attempted Delete")}/>}
            </div>
            )}
        </>
    )
}

export default Posts;