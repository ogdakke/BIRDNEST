import axios from "axios";

export default async function getData (req, res) {
  const url = "http://assignments.reaktor.com/birdnest/drones"
  const convert = require('xml-js')
  
  // check if point is inside the circle
  // circle_x, circle_y = origin of the circle
  // radius = radius of the circle
  // positionX, positionY = position of the point
  function insideRadius (circle_x, circle_y, radius, positionX, positionY) {
    if (((positionX - circle_x) * (positionX - circle_x)) + 
    ((positionY - circle_y) * (positionY - circle_y)) <= radius * radius) {
      return true
    }
    else
      return false
    }

  const circle_x = 250000
  const circle_y = 250000
  const radius = 100000

    // get data from url
    await axios.get(url, {timeout: 5000})
    .then(response => {
      const newData = convert.xml2js(response.data, {compact: true, ignoreDeclaration: true})
      
    const getPilotData = async (serialNumber, distance) => {
      // for testing a 404 response
      // const pilotUrl = 'http://assignments.reaktor.com/birdnest/pilots/SN-TiMthtLkXJ'

      const pilotUrl = `http://assignments.reaktor.com/birdnest/pilots/${encodeURIComponent(serialNumber)}`
      return await axios.get(pilotUrl, {timeout: 5000})
          .then(response => {
            let pilotData = response.data
              return {
                  serialNumber,
                  distance,
                  pilotData: [
                  {
                    name: `${pilotData.firstName} ${pilotData.lastName}`,
                    phoneNumber: pilotData.phoneNumber,
                    email: pilotData.email
                  }]
              }
          })
          .catch(error => {
            return errorHandler(error)
            
        })
      }
    
      const drones = newData.report.capture.drone
      const pilotPromises = drones.map((
        {
            serialNumber: {_text: serialNumber},
            positionY: {_text: positionY},
            positionX: {_text: positionX}
        }) => {
            let x = parseFloat(positionX)
            let y = parseFloat(positionY)
            if (insideRadius(circle_x, circle_y, radius, x, y)) {
              const distance = Math.hypot(circle_x - x, circle_y - y)
              console.log(distance, serialNumber);
              return getPilotData(serialNumber, distance)
            } else {
                return null
            }
        })
    
      Promise.all(pilotPromises)
        .then(droneData => {
          const finalData = droneData.filter(data => data !== null);
          return res.json(finalData)
        })
          .catch(error => {
            errorHandler(error)
        })
    })
    // This function is called each time we catch an error.
    function errorHandler(error) {
        if (error.response) {
          // Request made and server responded
          if (error.response.status === 404) {
            console.log(error.response.status);
            console.log(error.response.headers);
            return res.status(404).json(`${error.response.status} Data was not found, Try refreshing your browser.`)
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
          return res.status(error.status).json(error.message)
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message, error);
          return res.status(error.status)
        }
    }
  }
