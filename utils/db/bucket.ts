import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

function b64_to_utf8(str: string) {
    return Buffer.from(str, 'base64').toString();
}

const serviceAccount = JSON.parse(b64_to_utf8(process?.env?.SECRET_JSON || '' ));

initializeApp({
    credential: cert(serviceAccount),
});
const storage = getStorage();
export default storage.bucket();
export {
    storage,
};

