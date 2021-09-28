import React, { useState } from 'react';
import Webcam from "react-webcam";
import Loader from "react-loader-spinner";

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
    const [loading , isLoading] = useState(false);

    const webcamRef = React.useRef(null);  
    const submitForm = async (e) => {
        e.preventDefault()
        // console.log('username', username)
        // console.log('image : ',image);
        isLoading(true)
        const body = JSON.stringify({
            'username':username,
            'image':image
        });

        const apiRes = await fetch(`https://api-yami.herokuapp.com/auth`, {
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
            isLoading(false)
        } else {
            setUser({})
            isLoading(false)
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
                        
                        {loading ? 
                            <Loader
                                type="ThreeDots"
                                color="#350de9"
                                height={100}
                                width={50}
                            /> :
                        <>
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            <button type="submit" id="login-button" onClick={(e) => submitForm(e)}>Login</button>
                        </>
                        }
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
