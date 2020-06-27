var dgram = require('dgram');
var s = dgram.createSocket('udp4');
const { v4: uuidv4 } = require('uuid');

// Get the command line arguments
var args = process.argv.slice(2);

// Protocol
const MULTICAST_ADDRESS = "239.255.22.5";
const MULTICAST_PORT = "1111";

// Check if the number of argument given is correct
if (args.length == 0 || args.length > 1) {
  console.error("Need to provid only one instrument !");
  return;
}

// Links between a instrument and the sound it make
var instrument_sound = new Map();
instrument_sound.set("piano", "ti-ta-ti");
instrument_sound.set("trumpet", "pouet");
instrument_sound.set("flute", "trulu");
instrument_sound.set("violin", "gzi-gzi");
instrument_sound.set("drum", "boum-boum");

// Check if the musician exist
if(!instrument_sound.has(args[0])){
	console.error("Invalid instrument !");
	return;
}

var sound = instrument_sound.get(args[0]);

// Prepare the message (represent a musician)
const message = Buffer.from(JSON.stringify({
    uuid: uuidv4(),
    sound: sound
  })); 
   
// Send the message every 1 second
setInterval(() => {
  s.send(message, 0, message.length, MULTICAST_PORT, MULTICAST_ADDRESS, (err, bytes) => {
    console.log('Sending infos');
  });
}, 1000);

