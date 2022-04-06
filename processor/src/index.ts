import dotenv from 'dotenv';
dotenv.config();
import admin from 'firebase-admin';
import Jimp from 'jimp';

function b64_to_utf8(str: string) {
    return Buffer.from(str, 'base64').toString();
}

async function mainPart() {
    const ref = db.collection('articulos');
    const snapshot = await ref.get();
    snapshot.forEach(async (doc) => {
        // Read the file
        if (doc.data().imageUrl && typeof (doc.data().imageUrl) === 'string') return;
        console.log(`Processing: ${doc.data().nombre}`);
        const image = doc.data().image as string;
        const sliced = image.split('/');
        const file = bucket.file(sliced[sliced.length - 1]);
        const url = await file.getSignedUrl({action: 'read', expires: '03-09-2491'});
        // Get blur data
        const blur = await blurAndScaleDown(url[0] as string);
        const newRef = doc.ref;
        newRef.update({
            imageUrl: url[0],
            blur: blur
        });
        console.log('Done 🚀!');
    });
}

async function blurAndScaleDown(path: string): Promise<string> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        try {
            const image = await Jimp.read(path);
            // TODO: Find the right values
            image.resize(image.getWidth() / 5, image.getHeight() / 5);
            image.quality(30);
            image.blur(10);
            image.getBase64(Jimp.MIME_JPEG, (err, base64) => {
                if(err) reject(err);
                resolve(base64);
            });
        } catch (error) {
            reject(error);
        }
        
    });
    
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
const db = admin.firestore();
// Do the job
mainPart().then(() => console.log('Done all!'));




