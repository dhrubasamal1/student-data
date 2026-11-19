# Teacher Reviews Module

## Overview
The **Teacher Reviews & Faculty Finder** allows squad students to anonymously rate faculty, share notes on class average difficulty, behavior (strict vs. chill), and late entry rules.

## Firebase Firestore Path / Document (1-Read Architecture)
- **Collection Path**: `/teacher_reviews`
- **Document Path**: `/teacher_reviews/all_reviews`
- **Document Structure**:
  ```json
  {
    "reviews": [
      {
        "id": "rev_1795024829968_abc12",
        "teacherId": "dr__pradeep_kumar___scope",
        "teacherName": "DR. PRADEEP KUMAR",
        "rawFaculty": "DR. PRADEEP KUMAR - SCOPE",
        "school": "SCOPE",
        "rating": 5,
        "classAvg": "high",
        "behavior": "good",
        "lateEntry": "allowed",
        "comment": "Very supportive teacher, clear explanations.",
        "timestamp": 1795024829968
      }
    ],
    "lastUpdated": 1795024829968
  }
  ```

> **Performance & Cost Optimization**: All faculty reviews are stored in a single consolidated document `/teacher_reviews/all_reviews` using `FieldValue.arrayUnion()`. Opening the Teacher Reviews tab requires **only 1 document read** regardless of how many reviews exist in the database!

## Firebase Security Rules
In Firebase Console (`Firestore Database` -> `Rules`), ensure write access is allowed so reviews can be appended:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teacher_reviews/{document=**} {
      allow read, write: if true;
    }
    match /deliveries/{document=**} {
      allow read, write: if true;
    }
  }
}
```
