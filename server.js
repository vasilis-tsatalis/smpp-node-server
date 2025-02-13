const smpp = require('smpp');
const { v4: uuidv4 } = require('uuid');

require('dotenv/config');

smpp.encodings.default = process.env.ENCODING;

const server = smpp.createServer((session) => {
    console.log('SMPP session connected');
    //console.log('Session: ', session);

    session.on('bind_transceiver', (pdu) => {
        console.log('Received bind_transceiver request:', pdu.system_id);

        // Authenticate the client (you can replace with your logic)
        if (pdu.system_id === process.env.SYSTEM_ID && pdu.password === process.env.PASSWORD) {
            session.send(pdu.response({
                command_status: 0 // 0 means success
            }));
            console.log('Client authenticated successfully');
        } else {
            session.send(pdu.response({
                command_status: 5 // Invalid credentials
            }));
            console.log('Client authentication failed');
        }
    });

    session.on('submit_sm', (pdu) => {
        console.log('Received SMS:', pdu.short_message.message);
        //console.log('PDU: ', pdu);

        // Respond with success
        session.send(pdu.response({
            message_id: uuidv4()
        }));
    });

    session.on('unbind', (pdu) => {
        console.log('Client unbind request');
        session.send(pdu.response());
        session.close();
    });

    session.on('close', () => {
        console.log('SMPP session closed');
    });
});

server.listen(process.env.PORT, () => {
    console.log(`SMPP server is running on port ${process.env.PORT}`);
});