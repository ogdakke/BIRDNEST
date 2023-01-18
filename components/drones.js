import {React, useState, useEffect} from "react"
import styles from "../styles/Home.module.css"


/**
 * Gets data from the api/api/, parses it and sets a timestamp to each data element.
 * If timestamp exceedes 600 seconds, the data is deleted.
 * Uses localStorage to store the data for each individual browser, so it is not in any way
 * a perfect solution. I think rather it would have been smarter to create a database for the data using a realtime capable db like firebase for ex. I played with storing the data in a cookie, but didn't really see the benfefit + added complexity.
 * 
 */
export default function Drones() {
  let [loading, setLoading] = useState(true)
  const [newData, setNewData] = useState([])
  
  const checkAndRemoveOldData = () => {
    const storedData = JSON.parse(localStorage.getItem('data')) || []
    const currentTimestamp = Math.round(Date.now() / 1000) // convert milliseconds to seconds
    
    // loop through storedData and check timestamp
    // Something is going wrong with removing the data. Some old data pops up after removing an item/items from the localstorage. 
    // No idea what is causing that.
    storedData.forEach((item, index) => {
        if (currentTimestamp - item.timestamp > 600) {
            console.log(`removed ${item.serialNumber}`);
            storedData.splice(index, 1)
        }
    })

    // update localstorage with new data
    localStorage.setItem('data', JSON.stringify(storedData))
    setNewData([...storedData])
}
  useEffect(() => {
    // set an interval to check for old data every 0.5 seconds
    const interval = setInterval(() => {
        checkAndRemoveOldData();
    }, 500);

    return () => clearInterval(interval);
    }, []);



  useEffect(() => {
    let intervalTime = 4000
    // check localstorage for previous data
    // and set existing data if found. Otherwise, set an enmpty array 
    const storedData = JSON.parse(localStorage.getItem('data')) || []
    setNewData(storedData)

    // set an interval to fetch data after a set time. 
    // 
    const interval = setInterval(async () => {
      const response = await fetch('/api/api')
      const data = await response.json()
      if (data.length !== 0 && data) {
        setLoading(false)

        // loop through new data to store and check if serialNumber already exists in localstorage
        await data.forEach(newDataToStore => {
            let found = false 
            storedData.forEach(storedDataItem => {
                if (storedDataItem.serialNumber === newDataToStore.serialNumber) {
                  // check if the new data has a distance that is smaller to the stored distance and store that.
                  found = true
                  if (storedDataItem.distance > newDataToStore.distance) {
                      storedDataItem.distance = newDataToStore.distance
                    }
                }
            })
            if (!found) {
                // for new incoming data, set an timestamp and push it to the beginning of the storedData array.
                newDataToStore.timestamp = Math.round(Date.now() / 1000)
                storedData.unshift(newDataToStore)
            }
        })
        // set the data to localstorage
        localStorage.setItem('data', JSON.stringify(storedData))
        setNewData([...storedData])
    }
    }, intervalTime)
    return () => clearInterval(interval)
  }, [loading])

  // if for some reason newData is completely empty, doesn't really handle the err so no good.
  if (!newData) return (
    <div>No new data received from api.</div>
  )

  // if the state is loading.
  if (loading) return (
  <div className={styles.grid}>
    <div className={styles.description}>
    <p>Loading data, please wait...</p>
    </div>
  </div>
  )
  // finally, return the data to the fronend
  return (
    <div className={styles.grid}>
      {/* map through the received data*/}
      {newData.map((item, index) => (
        <div className={styles.card} key={index}>
          <p>Serial Number: {item.serialNumber}</p>
          <p>Closest observed distance: {`${Math.round(item.distance / 1000)} m`}</p>
            {item.pilotData.map( (pilot, index) => (
            <div key={index}>
              <div>name: {pilot.name}</div>
              <div>phoneNumber: {pilot.phoneNumber}</div>
              <div>email: {pilot.email}</div>
              <p>Data age : {Math.round(Date.now() / 1000 - item.timestamp)}s</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}