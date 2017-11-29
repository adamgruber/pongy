import { WebSocket } from 'mock-socket';

window.WebSocket = WebSocket;

// Mock Web Speech API
// Note: This is incomplete and only mocks out properties/methods we use
window.speechSynthesis = {
  cancel: jest.fn(),
  pause: jest.fn(),
  paused: false,
  pending: false,
  speak: jest.fn(),
  speaking: false
};

window.SpeechSynthesisUtterance = function SpeechSynthesisUtterance(sentence) {
  this.sentence = sentence;
};
