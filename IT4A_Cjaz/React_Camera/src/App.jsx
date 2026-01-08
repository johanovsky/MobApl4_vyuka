import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  //zde bude fotka
  const [photo, setPhoto] = useState(null);
  //stav kamery on/off
  const [cameraOn, setCameraOn] = useState(false);
  //odkazy na komponent
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  //metoda ktera prepne stav kamery na zapnuto
  function switchCameraState() {
    setCameraOn(true);
  }

  useEffect(() => {
    if(cameraOn === true) {
      startCamera();
    }
  }, [cameraOn]);

  //metoda ktera zapnu kameru
  async function startCamera() {
    //pozadame o pristup ke kamere
    try 
    {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" } // vyber kamery: user/enviroment
      });
      //ptam se jestli uz je v UI vykreslen video-tag
      if(videoRef.current) {
        //kdyz ano -> posleme do nej stream z kamery
        videoRef.current.srcObject = stream;
      }
    }
    catch(err) 
    {
      alert("Nepodarilo se zapnout kameru");
      setCameraOn(false);
    }
  }

  function stopCamera() {
    //stahneme stream z videotagu
    let stream = null;
    if(videoRef.current) {
      stream = videoRef.current.srcObject;
    }
    let tracks = null;
    //kdyz mame stream, vytahneme z nej pole stop
    if(stream !== null) {
      tracks = stream.getTracks();
    }
    //cele pole projdeme a vsechny stopy ukocime
    if(tracks !== null) {
      tracks.forEach(track => track.stop());
    }
    //nastav priznak vypnuta kamera
    setCameraOn(false);
  }

  //vypne kameru pri refreshi stranky
  useState(() => {
    stopCamera();
  }, []);

  function takePhoto() {
    //potrebuju video-tag
    const video = videoRef.current;
    //potrebuju canvas
    const canvas = canvasRef.current;
    //vytvorime si context canvasu
    const context = canvas.getContext("2d");
    //nastavime vysku a sirku canvasu podle videa
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    //s pomoci kontextu "premaluju" to co vidim na kamere
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    //prevedeme obrazek do base64 formatu
    const data = canvas.toDataURL("image/png");
    //nastavime data do fotky
    setPhoto(data);
    //vypneme kameru
    stopCamera();
  }

  return (
    <div>
      <h1>React Camera</h1>
      <div>
        {/* tlacitko pro spusteni kamery, zobrazime jen kdyz je kamera vypnut a soucane nemam nic vyfoceno */}
        {(((cameraOn === false) && (photo === null)) ? 
          <button onClick={switchCameraState}>Zapnout kameru</button>
          : null)}
        {/* pokud je priznak zapnuta kamera na true -> zobraz video-tag kam pak preposleme stream z kamery */}
        {
          ((cameraOn === true) ?
          <div> 
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width:"100%", maxWidth:"400px" }}
            /><br />
            <button onClick={stopCamera}>Vypnout kameru</button>
            <br />
            <br />
            <button onClick={takePhoto}>Vyfotit</button>
          </div>
          : null)
        }
        {
          //Kdyz mam fotku, tak ji zobrazim
          ((photo !== null) ?
          <div>
            <img 
              src={photo}
              alt="fotka"
              style={{ width: "100%", maxWidth: "400px" }}
            />
            <br />
            <button onClick={() => {
              setPhoto(null);
              setCameraOn(true);
            }}>Zpět</button>
          </div>
          : null)
        }

        {/* tady bude hidden canvas */}
        <canvas ref={canvasRef} hidden />
      </div>
    </div>
  )
}

export default App
