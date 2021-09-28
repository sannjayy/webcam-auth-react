import React, { useState } from 'react';
import Webcam from "react-webcam";

// const WebcamComponent = () => <Webcam />;

const videoConstraints = {
    width: 200,
    height: 200,
    facingMode: "user"
};

export const WebcamCapture = () => {

    const [image,setImage]=useState('');
    const [username, setUsername] = useState('');
    const [user, setUser] = useState({});
    const [similarity , setSimilarity] = useState('');
    const [confidence , setConfidence] = useState('');
    const [error , setError] = useState('');

    const webcamRef = React.useRef(null);  
    const submitForm = async (e) => {
        e.preventDefault()
        // console.log('username', username)
        // console.log('image : ',image);
        const body = JSON.stringify({
            'username':username,
            'image':image
        });

        const apiRes = await fetch(`http://localhost:8000/auth`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        })
        
        const data = await apiRes.json();
        
        if (apiRes.status === 202) {
            setUser(data.user)
            setSimilarity(data.similarity)
            setConfidence(data.confidence)
            setUsername('');
            setImage('')
            setError('')
        } else {
            setUser({})
            setError('Authentication failed')
        }        
    }

    const capture = React.useCallback(
        async () => {
            const imageSrc = webcamRef.current.getScreenshot();
            setImage(imageSrc)
        },  []);


    return (
        <div className="home-container">
            <div className="container">
                <div className="text">
                    <h1>Face Authentication</h1>
                    <form className="form">
                        {/* Webcam Start */}
                        <div className="webcam-container">
                            <div className="webcam-img">

                                {image === '' ? <Webcam
                                    audio={false}
                                    height={200}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    width={200}
                                    style={{'borderRadius':'50%'}}
                                    videoConstraints={videoConstraints}
                                /> : <img src={image} alt='img' style={{'borderRadius':'50%'}}/>}
                            </div>
                            <div>
                                {image !== '' ?
                                    <button onClick={(e) => {
                                        e.preventDefault();
                                        setImage('')
                                    }}
                                        className="webcam-btn">
                                        Retake</button> :
                                    <button onClick={(e) => {
                                        e.preventDefault();
                                        capture();
                                    }}
                                        className="webcam-btn">Capture</button>
                                }
                            </div>
                        </div>
                        {/* Webcam End */}
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <button type="submit" id="login-button" onClick={(e) => submitForm(e)}>Login</button>
                    </form>
                </div>                
            </div>
            {user.username ?
            <div className="info-bg">
                <h2>{user.name}</h2>    
                <hr />
                <p className="text-info">Username : {user.username}</p>            
                <p className="text-info">Email : {user.email}</p>      
                <hr />      
                <p className="text-info">Similarity : <small>{similarity}</small></p>            
                <p className="text-info">Confidence : <small>{confidence}</small></p>            
            </div>
            : ''}
            {error ?
            <div className="info-bg">
                <h2 className="red">{error}</h2>  
            </div> : ''
            }
        </div>
        
    );
};
