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
        //
    }
}
const bucket = admin.storage().bucket();
const storage = admin.storage();
export default admin.firestore();
export {
    bucket,
    storage,
};