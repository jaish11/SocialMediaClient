import React, { useState } from "react";
import Avatar from "../avatar/Avatar";
import "./CreatePost.scss";
import { BsCardImage } from "react-icons/bs";
import { axiosClient } from "../../utils/axiosClient";
import {useDispatch, useSelector} from 'react-redux';
import { getUserProfile } from "../../redux/slices/postsSlice";

function CreatePost() {
    const [postImg, setPostImg] = useState("");
    const [caption, setCaption] = useState('')
    const dispatch = useDispatch();
    const myProfile = useSelector(state => state.appConfigReducer.myProfile);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setPostImg(fileReader.result);
                // console.log("img data", fileReader.result);
            }
        };
    };

    const hanldePostSubmit = async() => {
        try {
            if(!caption || !postImg ) {
                alert("Caption or Image is required")
                return;
            }

            const result = await axiosClient.post('/posts', {
                caption,
                postImg
            });                
            
            dispatch(getUserProfile({
                userId: myProfile?._id
            }));
            console.log('post done', result);
        } catch (error) {
            console.log('what is the error', error);
        } finally {
            setCaption('');
            setPostImg('');
        }
        

    }

    return (
        <div className="CreatePost">
            <div className="left-part">
                <Avatar src={myProfile?.avatar?.url}/>
            </div>
            <div className="right-part">
                <input
                    value={caption}
                    type="text"
                    className="captionInput"
                    placeholder="What's on your mind?"
                    onChange={(e) => setCaption(e.target.value)}
                />
                {postImg && (
                    <div className="img-container">
                        <img
                            className="post-img"
                            src={postImg}
                            alt="post-img"
                        />
                    </div>
                )}

                <div className="bottom-part">
                    <div className="input-post-img">
                        <label htmlFor="inputImg" className="labelImg">
                            <BsCardImage />
                        </label>
                        <input
                            className="inputImg"
                            id="inputImg"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <button className="post-btn btn-primary" onClick={hanldePostSubmit}>Post</button>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
