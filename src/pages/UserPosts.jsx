import { useCreatePostMutation, useDeletePostMutation, useGetPostsQuery } from "../reducers/postSlice";
import { useSelector } from "react-redux";
import {useEffect, useState } from "react";

function UserPosts() {

    const me = useSelector(state=>state.auth.credentials.user)
    const [deletePost] = useDeletePostMutation();
    const [createPost] = useCreatePostMutation();

    const { data, isLoading } = useGetPostsQuery(me.userId);

    const onDelete = async (id) => {
        await deletePost(id).then(()=>{
            console.log("delete");
        }).catch(()=>{
            console.log("error")
        })
    }

    const onSubmit = async () => {
        await createPost({
            text: "this is your new post!",
            authorId: me.userId,
        }).then(()=>{
            console.log("added");
        }).catch(()=>{
            console.log("error")
        })
    }

    return (
        <>
            <button onClick={onSubmit}>Add Post</button>
            {isLoading? <h1>Loading...</h1>: data.length === 0? <h1>User has not created any posts</h1>:data.map((i)=>
                <div key={i.id}>
                    <h1>{i.text}</h1>
                    <button onClick={()=>onDelete(i.id)}>DELETE</button>
                </div>
                )}
        </>
    )
}

export default UserPosts;
