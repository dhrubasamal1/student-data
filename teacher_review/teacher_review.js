/**
 * Teacher Reviews & Faculty Finder Module
 * 
 * Firebase Firestore Path / Collection:
 *   /teacher_reviews
 *
 * Dedicated collection for faculty ratings, class averages, and anonymous squad reviews.
 */

// Teacher Review Firestore Collection Name
export const TEACHER_REVIEWS_COLLECTION_PATH = "teacher_reviews";

export function formatTeacherId(facultyString) {
  if (!facultyString) return "unknown";
  return facultyString.toLowerCase().replace(/[^a-z0-9]/g, "_");
}

export function calculateTeacherStats(reviews = []) {
  if (!reviews || reviews.length === 0) {
    return {
      count: 0,
      avgRating: 0,
      highAvgPercent: 0,
      chillPercent: 0,
      lateAllowedPercent: 0
    };
  }

  const count = reviews.length;
  const sumRating = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  const avgRating = (sumRating / count).toFixed(1);

  const highAvgCount = reviews.filter(r => r.classAvg === "high").length;
  const highAvgPercent = Math.round((highAvgCount / count) * 100);

  const chillCount = reviews.filter(r => r.behavior === "chill" || r.behavior === "good").length;
  const chillPercent = Math.round((chillCount / count) * 100);

  const lateAllowedCount = reviews.filter(r => r.lateEntry === "allowed").length;
  const lateAllowedPercent = Math.round((lateAllowedCount / count) * 100);

  return {
    count,
    avgRating,
    highAvgPercent,
    chillPercent,
    lateAllowedPercent
  };
}
