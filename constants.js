const width = window.innerWidth / 1.2;
const height = window.innerHeight / 1.2;
const DRAW_SIZE = height < width ? height : width;
const FRAME_RATE = 20;
const LEEG = 0;
const BOL = 1;
const MENS = 2;
const DOOS = 3;
const WAK = 4;
const LIVES = 3;
const GET_API = 'https://57uwleztw33fsrmhpxkotzh3gq0kxpmu.lambda-url.eu-central-1.on.aws/';
const POST_API = 'https://xkbknfcuvyhjgv4bo3q77hhghm0vomfa.lambda-url.eu-central-1.on.aws/';

export {BOL, DRAW_SIZE, FRAME_RATE, GET_API, LEEG, POST_API, MENS, DOOS, WAK, LIVES};