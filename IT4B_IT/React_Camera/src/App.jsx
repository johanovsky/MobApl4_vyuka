import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  //useStates
  //prepinac pro kameru
  const [isCameraOn, setIsCameraOn] = useState(false);
  //pro fotku
  const [photo, setPhoto] = useState(null);
  //useState s vybranou kamerou - def. bude zadni kamera
  const [cameraMode, setCameraMode] = useState("environment");
  //useState jestli zrcadlim nebo ne
  const [cameraMirrored, setCameraMirrored] = useState(false);
  //useRefs
  //odkaz do video-tagu
  const videoRef = useRef(null);
  //odkaz do canvasu
  const canvasRef = useRef(null);

  function startCamera() {
    //v aplikaci preklopim stav kamery na zapnuto
    setIsCameraOn(true);
  }

  async function enableCamera() {
    //nez budeme zapinat kameru, tak ji vypneme
    disableCamera();
    //pozadame o pristup ke kamere
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: {ideal: cameraMode} } //user - predni / environment - zadni
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

  //vypnuti fyzicke kamery
  function disableCamera() {
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
  }

  //metoda ktera vypne kameru (jak fyzicky, tak v aplikaci)
  function stopCamera() {
    setIsCameraOn(false);
    disableCamera();
  }

  useEffect(() => {
    if(isCameraOn === true) {
      enableCamera();
    }

    //doplnime vypnuti kamery po dobehnuti effectu
    return () => {
      disableCamera();
    }
  }, [isCameraOn, cameraMode]);

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
    //ulozime si stav kontextu
    canv_context.save();
    //pokud je zapnute zrcadleni
    if(cameraMirrored === true) {
      //posuneme souradnice
      canv_context.translate(canvas.width, 0);
      //horizontalni zrcadlo
      canv_context.scale(-1, 1);
    }
    //pomoci kontextu namalujeme obrazek z video do canvasu
    canv_context.drawImage(video, 0, 0, canvas.width, canvas.height);
    //prevedeme obrazek na bin. (base64) data
    const data = canvas.toDataURL("image/png");
    //tato data nastavime jako fotku
    setPhoto(data);
    //vypneme kameru
    stopCamera();
  }

  function savePhoto() {
    //vytvorime docasny odkaz
    const link = document.createElement("a");
    //do url linku dame data
    link.href = photo;
    //nastavime jmeno obrazku
    link.download = "fotka.png";
    //link pridame do stranky
    document.body.appendChild(link);
    //"klikneme" na stazeni
    link.click();
    //docasny odkaz zahodime
    document.body.removeChild(link);
  }

  function switchCameraMode() {
    if(cameraMode === "environment") {
      setCameraMode("user");
    } else {
      setCameraMode("environment");
    }
  }

  function switchMirrored() {
    if(cameraMirrored === true) {
      setCameraMirrored(false);
    } else {
      setCameraMirrored(true);
    }
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
              style={{
                width: "100%", 
                maxWidth: "400px",
                transform: ((cameraMirrored) ? "scaleX(-1)" : "scaleX(1)")
              }}
            /> 
            <button onClick={takePhoto}>Vyfotit</button>
            <button onClick={switchCameraMode}>Přepni kameru</button>
            <button onClick={switchMirrored}>Přepni zrcadleni</button>
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
            <button onClick={savePhoto}>Uložit</button>
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
