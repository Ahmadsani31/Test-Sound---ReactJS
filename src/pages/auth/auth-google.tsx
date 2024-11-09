import { googleLogout, GoogleLogin } from '@react-oauth/google';
import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'


export default function AuthGoogle() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem("profile");
        if (saved !== null) {
            return JSON.parse(saved);
        } else {
            return null;
        }
    });

    const responseMessage = (response: any) => {
        console.log(response);
        setProfile(jwtDecode(response.credential));
        localStorage.setItem("profile", JSON.stringify(jwtDecode(response.credential)));
        return navigate('/');
    };
    const errorMessage = (error: any) => {
        console.log(error);
    };

    console.log(profile);

    const logOut = () => {
        googleLogout();
        setProfile(null);
        localStorage.setItem("profile", '');
    };

    return (
        <div className="py-3 py-md-5" style={{ backgroundColor: 'cadetblue' }}>
            <div className="parent d-flex justify-content-center align-items-center h-100" style={{
                minHeight: '100vh'
            }}>
                <div className="container">
                    <div className="row justify-content-md-center">
                        <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
                            <div className="bg-white p-4 p-md-5 rounded shadow-sm">
                                {profile ? (
                                    <div className='text-center'>
                                        <img src={profile.picture} alt="user image" />
                                        <h3>User Logged in</h3>
                                        <p>Name: {profile.name}</p>
                                        <p>Email Address: {profile.email}</p>
                                        <br />

                                        <button onClick={logOut} className='btn btn-warning btn-sm'>Log out</button>
                                    </div>
                                ) : (
                                    <React.Fragment>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="mb-5 text-center">
                                                    <h3>Log in With</h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="d-flex justify-content-center">
                                                    <GoogleLogin onSuccess={responseMessage}
                                                        onError={() => errorMessage} useOneTap />
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
