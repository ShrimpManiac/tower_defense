// Payload: { timestamp }
export const gameStart = (uuid, payload) => {
  console.log(`Stage: `);

  return { status: 'success', message: `Game started` };
};

// Payload: { timestamp, score }
export const gameEnd = (uuid, payload) => {
  return { status: 'success', message: 'Game ended', clientScore };
};
