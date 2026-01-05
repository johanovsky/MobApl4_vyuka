import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  //useStates
  //prepinac pro kameru
  const [isCameraOn, setIsCameraOn] = useState(false);
  //pro fotku
  const [photo, setPhoto] = useState(null);
  //useRefs
  //odkaz do video-tagu
  const videoRef = useRef(null);
  //odkaz do canvasu
  const canvasRef = useRef(null);

  function startCamera() {
    //v aplikaci preklopim stav kamery na zapnuto
    setIsCameraOn(true);
  }

  useEffect(() => {
    if(isCameraOn === true) {
      enableCamera();
    }
  }, [isCameraOn]);

  async function enableCamera() {
    //pozadame o pristup ke kamere
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" } //user - predni / enviroment - zadni
    });
    //pokud je vykresleny video-tag
    if(videoRef.current) {
      //posleme do tagu stream
      videoRef.current.srcObject = stream;
    }
    try {

    } catch(err) {
      //sem to spadne napr. kdyz uzivatel nepovoli pristup ke kamere
      alert("Nepodarilo se zapnout kameru");
      //preklopime stav kamery na vypnuto
      setIsCameraOn(false);
    }
  }

  function stopCamera() {
    //nejprve stahnu z video-tagu stream
    let stream = null;
    if(videoRef.current) {
      stream = videoRef.current.srcObject;
    }
    //stahneme ze streamu stopy
    let tracks = null;
    if(stream !== null) {
      tracks = stream.getTracks();
    }
    //projdeme cele pole stop a vsechny je ukoncime
    if(tracks !== null) {
      tracks.forEach(track => track.stop());
    }
    //prepneme kameru v aplikaci jako vypnutou
    setIsCameraOn(false);
  }

  //vypnuti a radne ukonceni streamu pri obnove stranky
  useEffect(() => {
    return () => stopCamera();
  }, []);
  
  //funkce pro vyfoceni fotky
  function takePhoto() {
    //potrebuju se dostat k video-tagu
    const video = videoRef.current;
    //potrebuju canvas
    const canvas = canvasRef.current;
    //potrebuji vnitrek (context) canvasu pro malovani
    const canv_context = canvas.getContext("2d");
    //nastavime canvasu stejnou vysku a sirku jako ma video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    //pomoci kontextu namalujeme obrazek z video do canvasu
    canv_context.drawImage(video, 0, 0, canvas.width, canvas.height);
    //prevedeme obrazek na bin. (base64) data
    const data = canvas.toDataURL("image/png");
    //tato data nastavime jako fotku
    setPhoto(data);
    //vypneme kameru
    stopCamera();
  }

  return (
    <div>
      <h1>React Camera</h1>
      {
        //pokud neni zapnuta kamera a soucasne nemame nic vyfoceno
        //zobrazime tlacitko pro zapnuti kamery
        (((isCameraOn === false) && (photo === null)) ?
          <button onClick={startCamera}>Zapni kameru</button> :
          null)
      }
      {
        //pokud je kamera zapnuta
        ((isCameraOn === true) ?
          <div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{width: "100%", maxWidth: "400px"}}
            /> 
            <button onClick={takePhoto}>Vyfotit</button>
            <button onClick={stopCamera}>Vypni kameru</button>
          </div>
          :
          null)
      }
      {
        ((photo !== null) ?
          <div>
            <img
              src={photo}
              alt="fotka"
              style={{ width: "100%", maxWidth: "400px"}}
            />
            <button onClick={() => {
              setPhoto(null);
              setIsCameraOn(true);
            }}>Zpět</button>
          </div>
          :
          null)
      }

      {/* Pro praci s obrazkem, ale nezobrazuji ho, proto je hidden */}
      <canvas ref={canvasRef} hidden/>
    </div>
  )
}

export default App
