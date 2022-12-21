import axios from "axios";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const url = "http://assignments.reaktor.com/birdnest/drones"

  await axios.get(url, {
      headers: {

      }
  })
  .then(res => {
      console.log(res);
  })



  res.status(200).json(res)
}
