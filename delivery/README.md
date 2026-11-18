# Campus Delivery & Parcel Helper Module

## Overview
The **Delivery & Parcel Helper** matches squad members who are free or walking between campus academic blocks with active parcel collection requests.

## Firebase Firestore Path / Collection
- **Collection Path**: `/deliveries`
- **Document Structure**:
  ```json
  {
    "docType": "parcel_request",
    "requester": "Judwe",
    "courier": "Amazon",
    "otp": "4921",
    "note": "Small box under my name",
    "status": "open",
    "claimedBy": "",
    "location": "Between AB & AB02 Counter",
    "timestamp": 1795026388732,
    "createdAt": "serverTimestamp"
  }
  ```

## Firebase Security Rules
In Firebase Console (`Firestore Database` -> `Rules`), ensure the `/deliveries` path is allowed:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /deliveries/{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Route Matching Logic
- **Priority 100**: In AB02 now, next slot is free (walks past parcel counter).
- **Priority 95**: Walking from AB02 to AB (crosses counter passage).
- **Priority 90**: Walking from AB to AB02 (crosses counter passage).
- **Priority 85**: Free now and next slot free.
- **Priority 75**: Free right now, has class next slot.
- **Priority 65**: In class now, free next slot.
