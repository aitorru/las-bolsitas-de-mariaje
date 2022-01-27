/** Firebase use for web workers. */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
const app = initializeApp({
    projectId: "las-bolsitas-de-mariaje",
    storageBucket: "gs://las-bolsitas-de-mariaje.appspot.com"
});
const db = getFirestore(app);

export default db;
export {
    app
};