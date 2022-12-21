import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { xml2json } from 'xml-js'


export default function get () {
    
    const url = "http://assignments.reaktor.com/birdnest/drones"
    

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        axios.get(url, {})
            .then(data => {
                setLoading(false)
                setData(data)
                console.log(data)
            })
    }, [])
    

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No data found.</p>
    return (
        <p>ready</p>
    )
}
// export default function Drones () {
//     const url = "https://assignments.reaktor.com/birdnest/drones"
    
    

//     return (
//         <>
//             <div>
//                 <h3>Drones in area</h3>
//                 <ul>
//                     <p>
                        
//                     </p>
//                 </ul>
//             </div>
//         </>
//     )
// }


// export async function get(res) {
//     try {
//         await fetch('assignments.reaktor.com/birdnest/drones')
//         .then(res => res.text())
//         .then(data => {
//             let parser = new DOMParser()
//             let text = JSON.parse(parser.parseFromString(data, 'application/xml'))
//             console.log(text);
//             console.log(data);
//         })
        
//     } catch (error) {
        
//     }
// }