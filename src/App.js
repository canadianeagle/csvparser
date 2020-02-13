import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [distance, setDistance] = useState(null);
  const inputOpenFileRef = useRef(null);
  let fileReader;
  
  const handleFileRead = (e) => {
    const content = fileReader.result;

    let final = [];
    let split = [];
    let reversed = [];
    let lines = [];
    lines = content.split(/\r\n|\n/); //split text into lines

    for (let i=0; i<lines.length; i++) { //split lines into arrays
      if(lines[i] !== "") {
        split.push(lines[i].split(","));//.reverse());
        reversed.push(lines[i].split(",").reverse());
      }
    }

    let compare = 0;

    for (let i=0; i<split.length; i++) { // find san fran
      if(split[i].includes("San Francisco")) {
        final.push(split[i][0]);
        compare = split[i][3];
      }
    }

    let sorted = reversed.sort((a, b) => a[0] - b[0]).reverse();
    let index = sorted.length-1;
    
    while(index >= 0) { // add cities to route
      if(!sorted[index].includes("San Francisco")) { 
        if (parseFloat(sorted[index][0]) > parseFloat(compare) && !final.includes(sorted[index][0])) {
          final.push(sorted[index][3]);
        }
      }
      index--;
    }  

    let tempDist = 0;
    for (let i=0; i<sorted.length; i++) { // calc distance
      if (i<sorted.length-1) {
        tempDist += calcDistance(sorted[i][1], sorted[i][0], sorted[i+1][1], sorted[i+1][0])
      }
    }

    setDistance(parseFloat(tempDist).toFixed(0));
    setOutput(final);

  };

  const calcDistance = (lat1, lon1, lat2, lon2) => {
    
    var p = 0.017453292519943295;
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
  
    return 12742 * Math.asin(Math.sqrt(a)); 
  }

  const parseCSV = (e) => {
    if(e.target.files[0]){
      setFile(e.target.files[0]);
      fileReader = new FileReader();
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(e.target.files[0]);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Browse for your csv file:</h1>
        <div>
          <span className="control-fileupload mt-3">
            <label htmlFor="file">{file === null ? "Choose a .csv file to parse:" : file.name}</label>
            <input
              accept=".csv"
              autoComplete="off"
              className="custom-file-input"
              onChange={(e) => { parseCSV(e) }}
              placeholder="Choose a csv file to parse"
              ref={inputOpenFileRef}
              type="file"
            />
          </span>
          <a href="/cities_small.csv"><h3>Sample CSV File</h3></a>
        </div>
        
        <div className="output mt-5 p-4 border">
          <h4>Suggested Route</h4>
          {
            output === null ?
              <span><h2>No file selected yet.</h2><br/><br/>
                This app parses a file containing cities with longitude and latitudes and sorts them based on what's closest to San Francisco.<br/><br/><br/>
                If you need a sample csv file, see the link above. 
              </span>
            :
            <p>
              {
                output.map((city) => 
                  <><span key={city}>{city}</span><br /></>
                )
              }
              <span key="static">{output[0]}</span><br />
            </p>
          }
        </div>
        <div className="total mt-3 p-4 border">
          <h5>Distance travelled</h5>
          { distance === null ? 0+" km" : distance+" km" }
        </div>
      </header>
    </div>
  );
}

export default App;
