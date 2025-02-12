const smpp = require('smpp');

require('dotenv/config');

const session = smpp.connect(`smpp://localhost:${process.env.PORT}`);

session.bind_transceiver({
    system_id: process.env.SYSTEM_ID,
    password: process.env.PASSWORD
}, (pdu) => {
    if (pdu.command_status === 0) {
        console.log('Connected to SMPP server');

        // Send a test SMS
        session.submit_sm({
            destination_addr: '+1234567890',
            short_message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.vjkwvkbvjksvbk21Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }, (pdu) => {
            if (pdu.command_status === 0) {
                console.log('Message sent successfully, ID:', pdu.message_id);

                // Unbind and close session after sending SMS
                session.unbind((pdu) => {
                    if (pdu.command_status === 0) {
                        console.log('Successfully unbound from server.');
                        session.close();
                    }
                });
            }
        });
    } else {
        console.log('Failed to connect to SMPP server');
        session.close();
    }
});

session.on('close', () => {
    console.log('SMPP session closed');
});