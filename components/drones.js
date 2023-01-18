import {React, useState, useEffect} from "react"
import styles from "../styles/Home.module.css"

export default function Drones() {
  let [loading, setLoading] = useState(true)
  const [newData, setNewData] = useState([])
  
//   const checkAndRemoveOldData = () => {
//     const storedData = JSON.parse(localStorage.getItem('data')) || []
//     const currentTimestamp = Date.now() / 1000 // convert milliseconds to seconds

//     // loop through storedData and check timestamp
//     storedData.forEach((item, index) => {
//         if (currentTimestamp - item.timestamp > 20) {
//             console.log(`removed ${item.serialNumber}`);
//             storedData.splice(index, 1)
//         }
//     })

//     // update localstorage with new data
//     localStorage.setItem('data', JSON.stringify(storedData))
//     setNewData([...storedData])
// }



  useEffect(() => {
    // check localstorage for previous data
    // and set existing data if found. Otherwise, set an enmpty array 
    const storedData = JSON.parse(localStorage.getItem('data')) || []
    setNewData(storedData)

    // checkAndRemoveOldData()

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
                    found = true
                    if (storedDataItem.distance > newDataToStore.distance) {
                      console.log("new" + newDataToStore.serialNumber)
                      console.log("old" + storedDataItem.serialNumber)
                      storedDataItem.distance = newDataToStore.distance
                    }
                }
            })
            if (!found) {
                storedData.push(newDataToStore)
            }
        })

        localStorage.setItem('data', JSON.stringify(storedData))
        setNewData([...storedData])
    }
    }, 2000)
    return () => clearInterval(interval)
  }, [loading])

  if (loading) return <p>Loading...</p>
  return (
    <div className={styles}>
      {newData.map((item, index) => (
        <div className={styles.card} key={index}>
          <p>Serial Number: {item.serialNumber}</p>
          <p>Closest observed distance: {`${Math.round(item.distance / 1000)} m`}</p>
            {item.pilotData.map( (pilot, index) => (
            <div key={index}>
              <div>name: {pilot.name}</div>
              <div>phoneNumber: {pilot.phoneNumber}</div>
              <div>email: {pilot.email}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}


  // const [result, setData] = useState(null)
  // const [isLoading, setLoading] = useState(false)

  // useEffect(() => {
  //     setLoading(true)
  //     const interval = setInterval(async () => {
  //         const result = []
  //         await fetch('/api/api')
  //         .then((res) => res.json())
  //         .then((data) => {
  //             console.log(data)  
  //             if (data.length !== 0) {
  //               result.push(data)
  //               console.log(result)
  //               console.log(typeof(result))
  //               setLoading(false)
  //               setData(result)
  //             } else {
  //               setLoading(true)
  //             }              
  //         })
  //     }, 6000)
  //     setLoading(false)
  //     return () => clearInterval(interval)
  //     },[])
      
  //     if (isLoading) return <p>Loading...</p>
  //     if (!result) return <p>No profile data</p>
      
  //     return (
  //       <div>
  //         {result.map(item => {
  //           return (
  //             <>
  //             <div>serialNumber: {JSON.stringify(item.serialNumber)}</div>
  //             <div>distance: {item.distance}</div>
  //             <div>pilotData: {item.pilotData}</div>
  //             </>
  //           )
  //         })}
  //       </div>
  //     )



