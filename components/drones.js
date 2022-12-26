import {React, useState, useEffect} from "react"

export default function GetDrones () {
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)



    useEffect(() => {
        setLoading(true)
        setInterval(async () => {
            await fetch('/api/data')
            .then((res) => res.json())
            .then((data) => {
                JSON.stringify(data)
                setData(data)
            })
        }, 2000)
        setLoading(false)
        },[])
        
        if (isLoading) return <p>Loading...</p>
        if (!data) return <p>No profile data</p>
        

        return (
        <div>
            <p>{JSON.stringify(data)}</p>
        </div>
    )
}


