import TextSnippets from './TextSnippets';

const randElementFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const Fonts = [
    'serif',
    'sans-serif',
    'monospace'
];

const FontStyles = [
    '',
    'bold',
    'italic'
];

export {
    randElementFromArray,
    TextSnippets,
    Fonts,
    FontStyles
}