export default function Drones (req, res) {
    fetch('assignments.reaktor.com/birdnest/drones')
    .then(res => res.text())
    .then(data => {
        console.log(data);
        let parser = new DOMParser()
        let text = parser.parseFromString(data, 'application/xml')
        document.createElement('div').textContent = data
        console.log(text);
    })

    return (
        <>
            <div>
                <h3>Drones in area</h3>
                <ul>
                    
                </ul>
            </div>
        </>
    )
}


// export async function getStaticProps() {
//     const xml = await fetch('https://assignments.reaktor.com/birdnest/drones')
//     .then(res => res.text())
//     .then(data => {
//         console.log(data);
//         let parser = new DOMParser()
//         let text = parser.parseFromString(data, 'application/xml')
//     })
//     return {
//        props: {text}
//     }
// }