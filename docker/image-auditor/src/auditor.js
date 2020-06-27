const dgram = require('dgram');
const s = dgram.createSocket('udp4');

const moment = require('moment');
const net = require('net');

// Protocol
const PORT = "2205";
const MULTICAST_PORT = "1111";
const MULTICAST_ADDRESS = "239.255.22.5";

// Links between a sound and the instrument that makes it
var sound_instrument = new Map();
sound_instrument.set("ti-ta-ti", "piano");
sound_instrument.set("pouet", "trumpet");
sound_instrument.set("trulu", "flute");
sound_instrument.set("gzi-gzi", "violin");
sound_instrument.set("boum-boum", "drum");

var musicians = new Map();

// Listen for datagrams published in the multicast group by musicians
s.bind(MULTICAST_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(MULTICAST_ADDRESS);
});


// Put a playing musician into the musicians map
s.on('message', function(msg, source) {
	console.log("Data has arrived: " + msg + ". Source port: " + source.port);

	const musician = JSON.parse(msg.toString());
	
	musicians.set(musician.uuid,{
		uuid : musician.uuid,
		instrument : sound_instrument.get(musician.sound),
		activeSince : new Date() 
	});
	
});

// Check each second if a musician stopped playing for 5 seconds
setInterval(() => {
	var now = moment(new Date());
	
    musicians.forEach((musician) => {
    if (moment.duration(now.diff(musician.activeSince)).get("seconds") >= 5) {
		musicians.delete(musician.uuid);
    }
	
  })
}, 1000);

// Server TCP
var server = net.createServer().listen(PORT);

server.on('connection', (socket) => {
	var activeMusicians = [];	
	
	musicians.forEach((musician) => {
	  activeMusicians.push({
      uuid: musician.uuid,
      instrument: musician.instrument,
      activeSince: musician.activeSince
     });
   })
   
    socket.write(JSON.stringify(activeMusicians));
});



