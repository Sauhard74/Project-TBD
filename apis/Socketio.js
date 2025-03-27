import io from 'socket.io-client';

export const socket = io('https://ai.agastya.app', {
  path: '/ws/socket.io/'
});

socket.on('connect', () => {
  console.log('Connected to Socket');
});

socket.on('connect_error', (err) => {
  console.log('Connection Error:', err.message);
});

socket.on('connect_timeout', (err) => {
  console.log('Connection Timeout:', err.message);
});

export const onResponse = (callback) => {
  socket.connect();
  socket.on('message', (response) => {
    if ('error' in response) callback(false);
    else callback(response.data);
  });

  socket.on('streamEnded', () => callback(false));
};

export const offResponse = () => {
  socket.off('message');
  socket.disconnect();
};
