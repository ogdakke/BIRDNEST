import axios from "axios";
import { xml2js, xml2json } from "xml-js";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function getData (req, res) {
  const url = "http://assignments.reaktor.com/birdnest/drones"
  const convert = require('xml-js')
  


  //  check if point is inside the circle
  // circle_x, circle_y = origin of the circle
  // radius = radius of the circle
  // positionX, positionY = position of the point
    function insideRadius (circle_x, circle_y, radius, positionX, positionY) {
    if (((positionX - circle_x) * (positionX - circle_x)) + 
    ((positionY - circle_y) * (positionY - circle_y)) <= radius * radius)
      return true
    else
      return false
    }

    const circle_x = 250000
    const circle_y = 250000
    const radius = 100000
    const finalData = []

    await axios.get(url, {timeout: 10000})
    .then(function (response) {
    const newData = convert.xml2js(response.data, {compact: true, ignoreDeclaration: true})
    let drones = newData.report.capture.drone

    //map through each drones data
    drones.map((
      {
        serialNumber: {_text: serialNumber},
        positionY: {_text: positionY},
        positionX: {_text: positionX}
      }) => {
        // parse the input string to a float to avoid weird behaviour
        let x = parseFloat(positionX)
        let y = parseFloat(positionY)
        // If the function return true for given positionX and positionY do => ...
        if (insideRadius(circle_x, circle_y, radius, x, y)) {
          async function getPilotData(serialNumber) {
            const pilotUrl = `http://assignments.reaktor.com/birdnest/pilots/${encodeURIComponent(serialNumber)}` // make the url based on the serialNumber and make sure that it does not break the url if serialNumber contains something funky
             await axios.get(pilotUrl)
            .then(function (response) {
              let pilotData = response.data
              let serialData = {"drone":{serialNumber:{[serialNumber]: [pilotData]}}}
              
              finalData.push(serialData)              
              console.log(finalData);
              
              return finalData, serialData
            })
            .catch(function (error) {
              console.log(error);
              
              return res.status(500).json({error: "error"})
            })
          }
          return getPilotData(serialNumber)
        } else {
          finalData.push({drone :`${serialNumber} is not inside.`})
        }
      })
      console.log(finalData)
    })
    .catch(function (error) {
      console.log(error);
    })
    
}

