import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder needed by React Router in Node.js environment
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;