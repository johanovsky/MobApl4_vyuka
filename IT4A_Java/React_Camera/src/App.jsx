import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  //useStates stav kamery
  const [cameraOn, setCameraOn] = useState(false);
  //useState pro vyfoceny obrazek
  const [photo, setPhoto] = useState(null);
  //odkaz na video-tag
  const videoRef = useRef(null);
  //odkaz na canvas-tag
  const canvasRef = useRef(null);

  function zapniKameru() {
    //nastavi priznak zapnuta kamera
    setCameraOn(true);
  }

  useEffect(() => {
    if(cameraOn === true) {
      //fyzicky zapne kameru
      spustKameru();
    }
  }, [cameraOn]);

  async function spustKameru() {
    //pozadame o pristup
    try {
      //stahneme z prohlizece video-stream
      const stream = await navigator.mediaDevices.getUserMedia( {
        video: { facingMode: "user" } // user - predni / enviroment - zadni
      });
      //pokud uz je vykresleny video-tag v UI
      if(videoRef.current) {
        //do nej posleme stream
        videoRef.current.srcObject = stream;
      }
    } catch(err) {
      alert("Nepodarilo se otevrit kameru");
      console.log("Nepodarilo se otevrit kameru");
      setCameraOn(false);
    }
  }

  function vypniKameru() {
    //stahneme stream z video tagu
    let stream = null;
    if(videoRef.current) {
      stream = videoRef.current.srcObject;
    }

    //ze streamu stahneme vsechny stopy
    let tracks = null;
    if(stream !== null) {
      tracks = stream.getTracks();
    }

    //ukoncime vsechny stopy se streamu
    if(tracks !== null) {
      tracks.forEach(track => track.stop());
    }

    //i v aplikaci prepneme stav kamery na off
    setCameraOn(false);
  }

  //pri refreshi stranky, vypni kameru
  useEffect(() => {
    vypniKameru();
  }, []);

  //funkce pro porizeni fotografie
  function vyfotit() {
    //potrebuju video-tag
    const video = videoRef.current;
    //potrebuju canvas
    const canvas = canvasRef.current;
    //vytvorime kontext z canvasu pro malovani
    const contex = canvas.getContext("2d");
    //nastavime canvasu stejnou vysku a sirku jako ma video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    //pomoci kontextu "premalujeme" video do canvasu
    contex.drawImage(video, 0, 0, canvas.width, canvas.height);
    //potrebujeme prevest obrazek do base64 kodovani
    const data =  canvas.toDataURL("image/jpeg");
    //data nastavime do photo
    setPhoto(data);
    //vypneme kameru
    vypniKameru();
  }

  return (
    <div>
      <h1>React Camera</h1>
      {
        /* Tohle zobrazi pouze tlacitko na zapnuti kamery */
        (((cameraOn === false) && (photo === null)) ?
          <button onClick={zapniKameru}>Spustit kameru</button>
          : null)
      }
      {
        /* Tohle zobrazi video-tag kam pak poslu stream z kamery */
        ((cameraOn === true) ?
        <div>
          <video
            //propojeni referenci, aby se sem dostal React
            ref={videoRef}
            //spusti ihned streamovani
            autoPlay
            //spusti se pouze v okne
            playsInline
            style={{width:"100%", maxWidth:"400px"}}
          />
          <br />
          <button onClick={vyfotit}>Vyfotit</button>
          <br />
          <br />
          <button onClick={vypniKameru}>Zastavit kameru</button>
        </div>
          : null)
      }
      {
        ((photo !== null) ? 
          <div>
            <img
              src={photo}
              alt="fotka"
              style={{width: "100%", maxWidth: "400px"}}
            />
            <br />
            <button onClick={() => {
              setPhoto(null);
              setCameraOn(true);
            }}
            >Zpět</button>
          </div>
          : null)
      }

      {/* budeme potrebovat canvas, ale nezobrazime ho, pouze pouzijeme jeho funkce */}
      <canvas ref={canvasRef} hidden />
    </div>
  )
}

export default App
