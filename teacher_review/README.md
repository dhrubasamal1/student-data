# Teacher Reviews Module

## Overview
The **Teacher Reviews & Faculty Finder** allows squad students to anonymously rate faculty, share notes on class average difficulty, behavior (strict vs. chill), and late entry rules.

## Firebase Firestore Path / Collection
- **Collection Path**: `/teacher_reviews`
- **Document Structure**:
  ```json
  {
    "teacherId": "dr__pradeep_kumar___scope",
    "teacherName": "DR. PRADEEP KUMAR",
    "rawFaculty": "DR. PRADEEP KUMAR - SCOPE",
    "rating": 5,
    "classAvg": "high",
    "behavior": "good",
    "lateEntry": "allowed",
    "comment": "Very supportive teacher, clear explanations.",
    "timestamp": 1795024829968,
    "createdAt": "serverTimestamp"
  }
  ```

## Firebase Security Rules
In Firebase Console (`Firestore Database` -> `Rules`), ensure the `/teacher_reviews` path is allowed:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teacher_reviews/{document=**} {
      allow read, write: if true;
    }
  }
}
```
