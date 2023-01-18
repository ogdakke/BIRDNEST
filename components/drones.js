import {React, useState, useEffect} from "react"


export default function Drones() {
  let [loading, setLoading] = useState(true);
  const [newData, setNewData] = useState([])
  
  useEffect(() => {
    // check localstorage for previous data
    const storedData = JSON.parse(localStorage.getItem('data')) || []
    setNewData(storedData)
    // setLoading(true)
    const interval = setInterval(async () => {
      const response = await fetch('/api/api')
      const data = await response.json()
      if (data.length !== 0 && data) {
        setLoading(false)

        // loop through new data to store and check if serialNumber already exists in localstorage
        await data.forEach(newDataToStore => {
            let found = false;
            storedData.forEach(storedDataItem => {
                if (storedDataItem.serialNumber === newDataToStore.serialNumber) {
                    found = true;
                    if (storedDataItem.distance > newDataToStore.distance) {
                      console.log("new" + newDataToStore.serialNumber);
                      console.log("old" + storedDataItem.serialNumber);
                      storedDataItem.distance = newDataToStore.distance
                    }
                }
            });
            if (!found) {
                storedData.push(newDataToStore);
            }
        });

        localStorage.setItem('data', JSON.stringify(storedData))
        setNewData([...storedData])
    }
    }, 2000)
    return () => clearInterval(interval)
  }, [loading])

  if (loading) return <p>Loading...</p>
  return (
    <div>
      {newData.map((item, index) => (
        <div className="wrapper" key={index}>
          <p>Serial Number: {item.serialNumber}</p>
          <p>Closest observed distance: {Math.round(item.distance / 1000)} m</p>
            {item.pilotData.map( pilot => (
            <>
              <div>name: {pilot.name}</div>
              <div>phoneNumber: {pilot.phoneNumber}</div>
              <div>email: {pilot.email}</div>
            </>
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
  //             console.log(data);  
  //             if (data.length !== 0) {
  //               result.push(data)
  //               console.log(result);
  //               console.log(typeof(result));
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



