var { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const debug = true;
const FIPY_COM_PORT = 'COM9';
const NUCLEO_COM_PORT = 'COM6'

const fipy = new SerialPort({ path: FIPY_COM_PORT, baudRate: 115200 }).on('error', console.error) // Serial to FipY

try {
  const nucleo = new SerialPort({ path: NUCLEO_COM_PORT, baudRate: 9600 }).on('error', console.error) // Serial to Nucleo

  const nucleoParser = nucleo.pipe(new ReadlineParser({ delimiter: '\r\n' })) // Parses every new line. Emits data when available

  
  nucleoParser.on('data', line => {
    // Got some data

    if (line.includes(":"))
    {
      // Continue, it's the sensor structure {sensor}:{value}

      let fragments = line.split(":");
      let key = fragments[0];
      let value = fragments[1];

      let message = {};
      message[key] = value; // Set as { 'key': value }

      let chunk = [message]; // Add to array, needed for Azure

      fipy.write(JSON.stringify(chunk) + "\r\n") // Write to the Fipy. Note the \r\n, is required for starting a new line and making the fipy parse it.

      if (debug) {
        console.log("writing: ", JSON.stringify(chunk)) // debug
      }
        
    }
  })
} catch (error) {
  console.error("Error while initializing Nucleo parser", error)
}