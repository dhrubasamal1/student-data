/**
 * Campus Saathi - Delete All Anonymous Users from Firebase Authentication
 * 
 * Usage:
 *   1. Download your Firebase service account private key from:
 *      https://console.firebase.google.com/project/student-data-b1244/settings/serviceaccounts/adminsdk
 *   2. Save it in this directory as 'serviceAccountKey.json' (or set GOOGLE_APPLICATION_CREDENTIALS)
 *   3. Run:
 *      npm install firebase-admin
 *      node scripts/delete-anonymous-users.js
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(keyPath)) {
  console.log('----------------------------------------------------------------------');
  console.log('Firebase Service Account Key not found at:', keyPath);
  console.log('\nTo delete all anonymous users automatically:');
  console.log('1. Go to Firebase Console -> Project Settings -> Service accounts:');
  console.log('   https://console.firebase.google.com/project/student-data-b1244/settings/serviceaccounts/adminsdk');
  console.log('2. Click "Generate new private key"');
  console.log('3. Save the JSON file as "scripts/serviceAccountKey.json"');
  console.log('4. Run this script again: node scripts/delete-anonymous-users.js');
  console.log('----------------------------------------------------------------------');
  process.exit(1);
}

const serviceAccount = require(keyPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'student-data-b1244'
});

async function deleteAllAnonymousUsers(nextPageToken) {
  try {
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    const anonymousUids = [];

    listUsersResult.users.forEach((userRecord) => {
      // Anonymous users have providerData array empty
      const isAnonymous = (!userRecord.providerData || userRecord.providerData.length === 0) &&
                          (!userRecord.email) &&
                          (!userRecord.phoneNumber);
      if (isAnonymous) {
        anonymousUids.push(userRecord.uid);
      }
    });

    if (anonymousUids.length > 0) {
      console.log(`Found ${anonymousUids.length} anonymous user(s) to delete...`);
      const deleteResult = await admin.auth().deleteUsers(anonymousUids);
      console.log(`Successfully deleted ${deleteResult.successCount} anonymous users.`);
      if (deleteResult.failureCount > 0) {
        console.warn(`Failed to delete ${deleteResult.failureCount} users.`);
      }
    } else {
      console.log('No anonymous users found on this page.');
    }

    if (listUsersResult.pageToken) {
      await deleteAllAnonymousUsers(listUsersResult.pageToken);
    } else {
      console.log('Done! All anonymous users have been purged from Firebase Authentication.');
      process.exit(0);
    }
  } catch (error) {
    console.error('Error deleting anonymous users:', error);
    process.exit(1);
  }
}

console.log('Starting anonymous user purge for project student-data-b1244...');
deleteAllAnonymousUsers();
