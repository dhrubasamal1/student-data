/**
 * Campus Parcel & Squad Delivery Module
 * 
 * Firebase Firestore Path / Collection:
 *   /deliveries
 *
 * Dedicated collection for all squad parcel pickup requests, claims, and completions.
 */

// Delivery Firestore Collection Name
export const DELIVERY_COLLECTION_PATH = "deliveries";
export const FALLBACK_COLLECTION_PATH = "teacher_reviews";

export function getVenueBlock(venue) {
  if (!venue) return "Unknown";
  const v = venue.trim().toUpperCase();
  if (v.startsWith("AB02-") || v.startsWith("AB02")) return "AB02";
  if (v.startsWith("AB-") || v.startsWith("AB1-")) return "AB";
  if (v.startsWith("CR-")) return "CR";
  if (v.startsWith("AR-")) return "AR";
  return "Other";
}

export function calculateParcelRouteMatch(curVenue, nextVenue, curCourse, nextCourse, curCol, nextCol) {
  const curBlock = getVenueBlock(curVenue);
  const nextBlock = getVenueBlock(nextVenue);

  let priority = 0;
  let category = "busy";
  let badgeLabel = "In Class";
  let badgeStyle = "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700";
  let borderClass = "border border-slate-200/60 dark:border-slate-800/60";
  let routeNote = "";

  if (curCourse && curBlock === "AB02" && !nextCourse) {
    priority = 100;
    category = "leaving_ab02";
    badgeLabel = "🌟 Prime Match • Leaving AB02";
    badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
    borderClass = "border border-emerald-300/80 dark:border-emerald-800/80";
    routeNote = `In ${curVenue} (${curCourse.code}) • Next slot free`;
  } else if (curCourse && curBlock === "AB02" && nextBlock === "AB") {
    priority = 95;
    category = "leaving_ab02";
    badgeLabel = "🚶 Moving AB02 → AB";
    badgeStyle = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
    borderClass = "border border-blue-300/80 dark:border-blue-800/80";
    routeNote = `Moving from ${curVenue} to ${nextVenue} in AB`;
  } else if (curCourse && curBlock === "AB" && nextBlock === "AB02") {
    priority = 90;
    category = "leaving_ab02";
    badgeLabel = "🚶 Moving AB → AB02";
    badgeStyle = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
    borderClass = "border border-blue-300/80 dark:border-blue-800/80";
    routeNote = `Moving from ${curVenue} to ${nextVenue} in AB02`;
  } else if (!curCourse && !nextCourse) {
    priority = 85;
    category = "free_now";
    badgeLabel = "⚡ Free Now & Next";
    badgeStyle = "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800";
    borderClass = "border border-teal-300/80 dark:border-teal-800/80";
    routeNote = `Completely free now & next slot`;
  } else if (!curCourse && nextCourse) {
    priority = 75;
    category = "free_now";
    badgeLabel = "🟢 Free Right Now";
    badgeStyle = "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800";
    borderClass = "border border-teal-300/80 dark:border-teal-800/80";
    routeNote = `Free now • Next class ${nextCol ? nextCol.start : ''} in ${nextVenue}`;
  } else if (curCourse && !nextCourse) {
    priority = 65;
    category = "free_next";
    badgeLabel = "⏳ Free Next Slot";
    badgeStyle = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
    borderClass = "border border-amber-300/80 dark:border-amber-800/80";
    routeNote = `In class now in ${curVenue} • Free next slot (${nextCol ? nextCol.start : curCol.end})`;
  } else {
    priority = 10;
    category = "busy";
    badgeLabel = "In Class";
    badgeStyle = "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700";
    borderClass = "border border-slate-200/60 dark:border-slate-800/60";
    routeNote = `In ${curVenue} (${curCourse.code}) → ${nextVenue} (${nextCourse.code})`;
  }

  return { priority, category, badgeLabel, badgeStyle, borderClass, routeNote };
}
