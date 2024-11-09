import React, { useState, useRef } from 'react';
import { useInterval } from 'react-use';
import { useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google';
import imgPhone from './assets/img/megaphone.png';
import FloatingIcon from './components/FloatingIcon';
import { FaArrowRightFromBracket } from "react-icons/fa6";
import Swal from "sweetalert2";

function App() {
  const navigate = useNavigate();

  const [decibel, setDecibel] = useState(0);
  const [maxDb, setMaxDb] = useState(0);
  const [levelCss, setLevelCss] = useState<string>('lemaaah');
  const [isRunning, setIsRunning] = useState(false);
  const audioContextRef = useRef<any>(null);
  const analyserRef = useRef<any>(null);
  const microphoneRef = useRef<any>(null);
  const dataArrayRef = useRef<any>(null);

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("profile");
    if (saved !== null) {
      return JSON.parse(saved);
    } else {
      return null;
    }

  });


  const getDbLevel = (nilai: any) => {

    if (nilai >= 0 && nilai <= 25) setLevelCss('lemaaah');
    if (nilai >= 26 && nilai <= 40) setLevelCss('not bad');
    if (nilai >= 41 && nilai <= 60) setLevelCss('segitu aja');
    if (nilai >= 61 && nilai <= 85) setLevelCss('excellent');
    if (nilai >= 86 && nilai <= 100) setLevelCss('menyala suaraku');
  }

  const levelText = (nilai: any) => {

    if (nilai >= 0 && nilai <= 25) return 'Lemah';
    if (nilai >= 26 && nilai <= 40) return 'Lumayan';
    if (nilai >= 41 && nilai <= 60) return 'Segitu aja';
    if (nilai >= 61 && nilai <= 85) return 'Excellent';
    if (nilai >= 86 && nilai <= 100) return 'Menyala Suaraku';
  }

  const startAudio = async () => {
    if (profile === null) {
      console.log('hit');
      Swal.fire({
        title: "Opps!",
        text: 'Memerlukan Hak Authorize',
        icon: "warning",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return false;
    }

    if (isRunning) return; // Prevent starting multiple times

    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      microphoneRef.current = microphone;
      dataArrayRef.current = dataArray;

      setIsRunning(true);
    } catch (err) {
      console.error('Error accessing audio stream:', err);
    }
  };

  const stopAudio = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }
    setIsRunning(false);
  };

  useInterval(() => {
    if (isRunning && analyserRef.current && dataArrayRef.current) {
      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;

      analyser.getByteFrequencyData(dataArray);
      const sum = dataArray.reduce((a: any, b: any) => a + b, 0);
      const average = sum / dataArray.length;

      // Calculate desibel level
      const normalized = (average / 255) * 100;

      // Ensure desibel is in range 0-100
      let dB = Math.max(0, Math.min(normalized, 100)).toFixed(0);
      setDecibel(parseInt(dB));

      getDbLevel(dB);
      // console.log(level);

      if (parseInt(dB) > maxDb) {
        setMaxDb(parseInt(dB));
      }
    } else {
      setDecibel(0); // Set to 0 if no sound
    }
  }, 100); // Update every 100ms

  const logOut = () => {
    googleLogout();
    setProfile(null);
    localStorage.setItem("profile", '');
  };

  return (
    <div className="background-container">
      <div className="dynamic-bg" id="dynamic-bg" style={{
        height: decibel + '%'
      }}>
        <section>
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
          <div className="wave wave4"></div>
        </section>

      </div>
      <div className="content">
        <img src={imgPhone} alt="icon" className='mb-4' width={220} />
        {profile ? (
          <React.Fragment>
            <h5>{profile.name}</h5>
            <button onClick={logOut} className='btn btn-warning btn-sm'><FaArrowRightFromBracket /> Log out google</button>
          </React.Fragment>
        ) : null}
        <h1>Buktikan Teriakan mu!!</h1>
        <p>Gunakan button icon microphone (<i className="fa-solid fa-microphone"></i>) dibawah untuk memulai teriakan.
          Ayoo coba seberapa besar teriakanmu, Buktikan.</p>
        <p className="highlight bg-success rounded">Highest Recorded Level: {maxDb} dB ({levelText(maxDb)})</p>
        <h4><span id="db">{decibel}</span> dB (Desibel)</h4>
      </div>

      <div className="slider-container">

        <button onClick={() => { startAudio(), setIsAlertOpen(!isAlertOpen) }} disabled={isRunning} className="btn btn-primary btn-icon m-1 p-3"><i className="fa-solid fa-microphone fa-xl"></i></button>
        <button onClick={stopAudio} disabled={!isRunning} className="btn btn-danger btn-icon m-1 p-3"><i className="fa-solid fa-microphone-slash fa-xl"></i></button>
      </div>
      <FloatingIcon position={`right`} level={levelCss} />
      {/* <div className={`db-indicator  ${levelCss.replace(' ', '-')}`} id="dbIndicator">
        <div className="level"><img src={imgShout} alt="sh-icon" width={30} /> (  {levelCss.charAt(0).toUpperCase() + levelCss.slice(1)})</div>
      </div> */}

    </div>
  );
}

export default App;
