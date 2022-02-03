import admin from 'firebase-admin';

function b64_to_utf8(str: string) {
    return Buffer.from(str, 'base64').toString();
}

const serviceAccount = JSON.parse(b64_to_utf8(process?.env?.SECRET_JSON || '' ));

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: 'gs://las-bolsitas-de-mariaje.appspot.com'
        });
    } catch (error: any) {
        console.log('Firebase admin initialization error', error.stack);
    }
}
const bucket = admin.storage().bucket();
export default admin.firestore();
export {
    bucket
};