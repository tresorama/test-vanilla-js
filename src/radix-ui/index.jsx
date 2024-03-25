import { createRoot } from 'react-dom/client';
import { App } from './app.jsx';

// add root DOM element
document.body.insertAdjacentHTML('afterbegin', /*html*/`<section id="radix-ui--root"></section>`);

// Render your React component instead
const root = createRoot(document.getElementById('radix-ui--root'));
root.render(<App />);
