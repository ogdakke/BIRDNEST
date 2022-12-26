import axios from "axios";
import { xml2js, xml2json } from "xml-js";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function getData (req, res) {
  const url = "http://assignments.reaktor.com/birdnest/drones"
  const convert = require('xml-js')
  
  try {
      const response = await axios.get(url)
      // const data = new xml2json(response.data)
      const data = convert.xml2js(response.data, {compact: true, ignoreDeclaration: true} )
      res.status(200).json(data)
      // console.log(JSON.stringify(data))
  } catch (error) {
    console.error(error)
  }
}