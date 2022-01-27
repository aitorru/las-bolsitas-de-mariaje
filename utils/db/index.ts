import admin from 'firebase-admin';

function b64_to_utf8(str: string) {
    return Buffer.from(str, 'base64').toString();
}

const serviceAccount = JSON.parse(b64_to_utf8(process?.env?.SECRET_JSON || "" ))

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error: any) {
        console.log('Firebase admin initialization error', error.stack);
    }
}
export default admin.firestore();