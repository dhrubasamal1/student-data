/**
 * Teacher Reviews & Faculty Finder Module
 * 
 * Firebase Firestore Path / Collection:
 *   /teacher_reviews
 *
 * Dedicated collection for faculty ratings, class averages, and anonymous squad reviews.
 */

// Teacher Review Firestore Collection Name & Single Consolidated Document ID (1-Read Architecture)
export const TEACHER_REVIEWS_COLLECTION_PATH = "teacher_reviews";
export const TEACHER_REVIEWS_DOC_ID = "all_reviews";

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

    /**
     * ========================================================================
     * COMPLETE VIT BHOPAL FACULTY DIRECTORY (326+ FACULTY MEMBERS)
     * Ingested from Combined_Faculty_List.csv
     * Includes: Teacher Name, School/Department Code, Phone Number, Room/Cabin Number
     * ========================================================================
     */
    export const ALL_FACULTY_DATA = [
            {
                  "name": "Dr. Benevatho Jaison A",
                  "school": "SASL",
                  "phone": "9994066779",
                  "room": "A-401",
                  "email": "benevatho.jaison@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Suresh Dara",
                  "school": "SASL",
                  "phone": "7353268058",
                  "room": "A-321",
                  "email": "suresh.dara@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Mayank Sharma",
                  "school": "SASL",
                  "phone": "9826081038",
                  "room": "B-503",
                  "email": "mayank.sharma@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Bhumika Choksi",
                  "school": "SASL",
                  "phone": "7016527953",
                  "room": "A-318",
                  "email": "bhumika.choksi@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Pavan Kumar",
                  "school": "SASL",
                  "phone": "8179700264",
                  "room": "B-514",
                  "email": "pavan.kumar@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Navneet Kumar Verma",
                  "school": "SASL",
                  "phone": "9598663322",
                  "room": "A-203",
                  "email": "navneet.verma@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Sayed Mohammed Zeeshan",
                  "school": "SASL",
                  "phone": "7004465671",
                  "room": "B-511",
                  "email": "sayed.zeeshan@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Reena Jain",
                  "school": "SASL",
                  "phone": "8989982847",
                  "room": "A-110",
                  "email": "reena.jain@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Mamta Agrawal",
                  "school": "SASL",
                  "phone": "9425027637",
                  "room": "A-201",
                  "email": "mamta.agrawal@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Anant Kant Shukla",
                  "school": "SASL",
                  "phone": "8050710905",
                  "room": "G-11",
                  "email": "anantkant.shukla@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Neha Choubey",
                  "school": "SASL",
                  "phone": "9713606045",
                  "room": "ADMISSION OFFICE-02",
                  "email": "neha.choubey@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Manisha Pandey",
                  "school": "SASL",
                  "phone": "9039826104",
                  "room": "G-04",
                  "email": "manisha.jain@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Ajay Kumar Bhurjee",
                  "school": "SASL",
                  "phone": "9178913172",
                  "room": "A-301",
                  "email": "ajay.kumarbhurjee@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Rabia Musheer",
                  "school": "SASL",
                  "phone": "9479967401",
                  "room": "B-408",
                  "email": "rabia.musheer@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Akshara Makrariya",
                  "school": "SASL",
                  "phone": "7748836973",
                  "room": "A-302",
                  "email": "akshara.makrariya@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Yogesh Shukla",
                  "school": "SASL",
                  "phone": "9479877102",
                  "room": "ADMISSION OFFICE-01",
                  "email": "yogesh.shukla@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Jyoti Badge",
                  "school": "SASL",
                  "phone": "9993945259",
                  "room": "B-504",
                  "email": "jyoti.badge@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Manickam . A",
                  "school": "SASL",
                  "phone": "9789742540",
                  "room": "C-503",
                  "email": "manickam.a@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Kumar Abhishek",
                  "school": "SASL",
                  "phone": "9043642001",
                  "room": "AB 428 or AB 442",
                  "email": "kumar@vitbhopal.ac.in"
            },
            {
                  "name": "Ms. Priyanka Roy",
                  "school": "SASL",
                  "phone": "8296603348",
                  "room": "C-525",
                  "email": "priyanka.roy@vitbhopal.ac.in"
            },
            {
                  "name": "Ms. Sheerin Kayenat",
                  "school": "SASL",
                  "phone": "7870955315",
                  "room": "B-303",
                  "email": "sheerin.kayenat@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Nilam Venkatakoteswararao",
                  "school": "SASL",
                  "phone": "9177477722",
                  "room": "B-302",
                  "email": "nilam.venkatakoteswararao@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Harihara Padhy",
                  "school": "SASL",
                  "phone": "9668780860",
                  "room": "",
                  "email": "harihara.padhy@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Manoj Acharya",
                  "school": "SASL",
                  "phone": "9827206056",
                  "room": "G-06",
                  "email": "manoj.acharya@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Sumit Mittal",
                  "school": "SASL",
                  "phone": "9318325748",
                  "room": "B-304",
                  "email": "sumit.mittal@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Arockiasamy",
                  "school": "SASL",
                  "phone": "9176825969",
                  "room": "",
                  "email": "arockiasamy.s@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. G L Balaji",
                  "school": "SASL",
                  "phone": "9994613458",
                  "room": "A-414",
                  "email": "balaji.gl@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Saurav prasad",
                  "school": "SASL",
                  "phone": "9310157546",
                  "room": "C-506",
                  "email": "saurav.prasad@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Satyam ravi",
                  "school": "SASL",
                  "phone": "9646937054",
                  "room": "C-536",
                  "email": "satyam@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Vivek Kumar Yadav",
                  "school": "SASL",
                  "phone": "9452266088",
                  "room": "",
                  "email": "vivek@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Saurabh Bhargava",
                  "school": "SASL",
                  "phone": "8901539669",
                  "room": "B-401",
                  "email": "saurabhbhargava@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Shweta Mukherjee",
                  "school": "SASL",
                  "phone": "7354155194 / 7354155194/9826215494",
                  "room": "A-204",
                  "email": "shweta.mukherjee@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Avirup Das",
                  "school": "SASL",
                  "phone": "9674927124",
                  "room": "A-313",
                  "email": "avirup.das@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Sharad Chandra Tripathi",
                  "school": "SASL",
                  "phone": "7697867027",
                  "room": "PAT OFFICE",
                  "email": "sharadchandra.tripathi@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Divya Haridas",
                  "school": "SASL",
                  "phone": "9930594727",
                  "room": "C-515 / AB-110",
                  "email": "divya.haridas@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Ramu Pasupathi Sugavaneshwar",
                  "school": "SASL",
                  "phone": "7899036744",
                  "room": "A-308",
                  "email": "ramupasupathi.s@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Rajdeep Singh Payal",
                  "school": "SASL",
                  "phone": "9389634514",
                  "room": "B-515",
                  "email": "rajdeep.payal@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Pradeep Kumar Kashyap",
                  "school": "SASL",
                  "phone": "7465967251",
                  "room": "A-325",
                  "email": "pradeep.kashyap@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Xavier Suresh",
                  "school": "SASL",
                  "phone": "9486915394",
                  "room": "B-312",
                  "email": "xavier.m@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Suchetana Sadhukan",
                  "school": "SASL",
                  "phone": "9748005527",
                  "room": "A-311",
                  "email": "suchetana@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Chandan Kumar",
                  "school": "SEEE",
                  "phone": "8896677605",
                  "room": "",
                  "email": "chandan.kumar@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Siddhartha Maiti",
                  "school": "SBE",
                  "phone": "9326132839",
                  "room": "A-245",
                  "email": "siddhartha.maiti@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Neetu Kalra",
                  "school": "SBE",
                  "phone": "9479661282",
                  "room": "B-410",
                  "email": "neetu.karla@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Arumay PAL",
                  "school": "SBE",
                  "phone": "7439611148",
                  "room": "",
                  "email": "arumay.pal@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Mahendran B",
                  "school": "SBE",
                  "phone": "7382145827",
                  "room": "A-506",
                  "email": "mahendran.b@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Justin Joseph",
                  "school": "SBE",
                  "phone": "9961438040",
                  "room": "",
                  "email": "justin.joseph@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Anita Yadav",
                  "school": "SASL",
                  "phone": "9977588551",
                  "room": "A-315",
                  "email": "anita.yadav@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Vinod Bhatt",
                  "school": "SASL",
                  "phone": "9826143220",
                  "room": "G-02",
                  "email": "vinod.bhatt@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Rajeev Saxena",
                  "school": "SASL",
                  "phone": "9701336323",
                  "room": "A-248",
                  "email": "rajeev.saxena@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Ravi Bhatt",
                  "school": "SASL",
                  "phone": "9630400659",
                  "room": "A-515",
                  "email": "ravi.bhatt@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Soumya Sankar Ghosh",
                  "school": "SASL",
                  "phone": "9748581767",
                  "room": "C-507",
                  "email": "soumya.sankar@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Vidhi Agrawal",
                  "school": "SASL",
                  "phone": "9838889590",
                  "room": "",
                  "email": "vidhiagrawal2021@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Atul Aman",
                  "school": "SASL",
                  "phone": "8420862335",
                  "room": "A-512",
                  "email": "atul.aman@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Pushpinder Singh Patheja",
                  "school": "SCSE",
                  "phone": "9893273243",
                  "room": "G-09",
                  "email": "pushpinder.singh@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Sandip Mal",
                  "school": "SCSE",
                  "phone": "7974537024",
                  "room": "A-207",
                  "email": "sandip.mal@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Kanchan Lata Kashyap",
                  "school": "SCSE",
                  "phone": "9826733258",
                  "room": "B-310",
                  "email": "kanchan.k@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Sountharrajan S",
                  "school": "SCSE",
                  "phone": "9786066776",
                  "room": "",
                  "email": "s.sountharrajan@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Shriram R",
                  "school": "SCSE",
                  "phone": "7358194673",
                  "room": "PAT OFFICE",
                  "email": "shriram.r@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Baseera.A",
                  "school": "SCSE",
                  "phone": "9698960667",
                  "room": "G-01",
                  "email": "baseera.a@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Shishir Kumar Shandilya",
                  "school": "SCSE",
                  "phone": "9009972032",
                  "room": "AB-507",
                  "email": "shishirkumar.s@vitbhopal.ac.in"
            },
            {
                  "name": "Ms. Suganya E",
                  "school": "SCSE",
                  "phone": "9884970535",
                  "room": "",
                  "email": "suganya.e@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Praveen Lalwani",
                  "school": "SCSE",
                  "phone": "9826573350",
                  "room": "A-101",
                  "email": "praveen.lalwani@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Nilamadhab Mishra",
                  "school": "SCSE",
                  "phone": "7735627711",
                  "room": "B-308",
                  "email": "nilamadhab.mishra@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Pon Harshavardhanan",
                  "school": "SCSE",
                  "phone": "9840768153",
                  "room": "A-202",
                  "email": "pon.harshavardhanan@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Manas Kumar Mishra",
                  "school": "SCSE",
                  "phone": "9956250356",
                  "room": "",
                  "email": "manaskumar.mishra@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Amudhavel J",
                  "school": "SCSE",
                  "phone": "9597788658",
                  "room": "",
                  "email": "amudhavel.j@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Anand Motwani",
                  "school": "SCSE",
                  "phone": "8818965776",
                  "room": "B-407",
                  "email": "anand.motwani@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Chandan Kumar Behera",
                  "school": "SCSE",
                  "phone": "8847872575 / 9039490306",
                  "room": "B-314",
                  "email": "chandankumar.behara@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Ashwin M",
                  "school": "SCSE",
                  "phone": "9710970034",
                  "room": "",
                  "email": "ashwin.m@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Ashish Kumar Sahu",
                  "school": "SCSE",
                  "phone": "9506347438",
                  "room": "",
                  "email": "ashish.kumar@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. L Sathish Kumar",
                  "school": "SCSE",
                  "phone": "9597200240",
                  "room": "B-402",
                  "email": "sathish.kumar@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. V Pandimurugan",
                  "school": "SCSE",
                  "phone": "9976277455",
                  "room": "",
                  "email": "pandi.murugan@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Subhash Chandra Patel",
                  "school": "SCSE",
                  "phone": "7905407837",
                  "room": "A-404",
                  "email": "subhash.patel@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Muneeswaran",
                  "school": "SCSE",
                  "phone": "9842541667",
                  "room": "",
                  "email": "muneeswaran@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Paras Jain",
                  "school": "SCSE",
                  "phone": "9963023330",
                  "room": "G-07",
                  "email": "paras.jain@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Virendra Singh Kushwaha",
                  "school": "SCSE",
                  "phone": "7415869616",
                  "room": "A-309",
                  "email": "virendra.kushwah@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Venkat Prasad Padhy",
                  "school": "SCSE",
                  "phone": "8310597038",
                  "room": "G-15",
                  "email": "venkat.prasad@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. H Azath",
                  "school": "SCSE",
                  "phone": "9865164505",
                  "room": "B-311",
                  "email": "azath.h@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. L. Shakeera",
                  "school": "SCSE",
                  "phone": "9444679387",
                  "room": "",
                  "email": "shakkeera.l@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Sharmasth Vali Y",
                  "school": "SCSE",
                  "phone": "9444679387",
                  "room": "",
                  "email": "sharmasth.vali@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Rajasoundaran S",
                  "school": "SCSE",
                  "phone": "9025678818",
                  "room": "",
                  "email": "raja.soundaran@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. R.Thilagavathy",
                  "school": "SCSE",
                  "phone": "9894984025",
                  "room": "",
                  "email": "thilagavathy.r@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Nitish Andola",
                  "school": "SCSE",
                  "phone": "8218880567",
                  "room": "",
                  "email": "nitish.andola@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. R.Rakesh",
                  "school": "SCSE",
                  "phone": "9840768026",
                  "room": "",
                  "email": "rakesh.r@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Alangudi Balaji",
                  "school": "SCSE",
                  "phone": "9894391980",
                  "room": "",
                  "email": "alangudi.balaji@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Hariharasitaraman. S",
                  "school": "SCSE",
                  "phone": "99402 95262",
                  "room": "PAT OFFICE",
                  "email": "hariharasitaraman.s@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Amit Mishra",
                  "school": "SCSE",
                  "phone": "8619430401",
                  "room": "",
                  "email": "amit.mishra@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Vikas Panthi",
                  "school": "SCSE",
                  "phone": "9778460751",
                  "room": "A-324 / C-519",
                  "email": "vikas.panthi@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Nidhi Mishra",
                  "school": "SCSE",
                  "phone": "9887677357",
                  "room": "",
                  "email": "Nidhi.mishra@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Saravanan",
                  "school": "SCSE",
                  "phone": "9865483413",
                  "room": "A-249 / C-517",
                  "email": "Saravanan.d@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Durga Prasad",
                  "school": "SCSE",
                  "phone": "8008562322",
                  "room": "",
                  "email": "durga.prasad@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Aprna Tripathi",
                  "school": "SCSE",
                  "phone": "9415736072",
                  "room": "",
                  "email": "aprna.tripathi@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Suthir S",
                  "school": "SCSE",
                  "phone": "9944042932",
                  "room": "",
                  "email": "suthir.s@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Trapti Sharma",
                  "school": "SCSE",
                  "phone": "9425630895",
                  "room": "C-526",
                  "email": "traptisharma@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Kannan S",
                  "school": "SCSE",
                  "phone": "9976878278 / 7702672411",
                  "room": "B-403 / C-528",
                  "email": "kannanshanmugam@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. A.V.R Mayuri",
                  "school": "SCSE",
                  "phone": "9441438843",
                  "room": "B-313",
                  "email": "Mayuri2021@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Murugeswari.k",
                  "school": "SCSE",
                  "phone": "9994276824",
                  "room": "A-403",
                  "email": "murugeswari.k2021@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Abha Trivedi",
                  "school": "SCSE",
                  "phone": "7839319383",
                  "room": "C-530",
                  "email": "Abhatrivedi2021@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. D. Lakshmi",
                  "school": "SCSE",
                  "phone": "9945379089 / 86100 93319",
                  "room": "G-08",
                  "email": "lakshmi.d@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Swagat Kumar",
                  "school": "SCSE",
                  "phone": "9437181775 / 7978166023",
                  "room": "A-247",
                  "email": "swagatkumarsamantaray@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Ganeshan R",
                  "school": "SCSE",
                  "phone": "9789920281 / 8610285129",
                  "room": "A-312",
                  "email": "ganeshan.r@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Manickavasagam",
                  "school": "SCSE",
                  "phone": "9600156423",
                  "room": "",
                  "email": "manickavasagam@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Ashok Patel",
                  "school": "SCSE",
                  "phone": "9770890583",
                  "room": "A-326 / C-535",
                  "email": "ashok.patel@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Balaji A",
                  "school": "SCSE",
                  "phone": "9444422518 / 9444433518",
                  "room": "A-241",
                  "email": "balaji.a@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Rizwan Ur Rahman",
                  "school": "SCSE",
                  "phone": "9893526322",
                  "room": "C-518",
                  "email": "rizwan.ur@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Poonkuntran",
                  "school": "SCSE",
                  "phone": "9894432890",
                  "room": "AB-019 (C)",
                  "email": "poonkuntran.s@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. G. Elangovan",
                  "school": "SCSE",
                  "phone": "7904994756",
                  "room": "",
                  "email": "elangovan.g@vitbhopal.ac.in"
            },
            {
                  "name": "Mrs. Simi V.R",
                  "school": "SCSE",
                  "phone": "9567987449",
                  "room": "",
                  "email": "simi@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Hariharan Rajadurai",
                  "school": "SCSE",
                  "phone": "9791322178",
                  "room": "B-301",
                  "email": "hariharan.r@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Mohandas R",
                  "school": "SCSE",
                  "phone": "9840595406",
                  "room": "",
                  "email": "mohandas@vitbhopal"
            },
            {
                  "name": "Mr. Ab Rouf Khan",
                  "school": "SCSE",
                  "phone": "8825073337",
                  "room": "",
                  "email": "roufkhan@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. J. Manikandan",
                  "school": "SCSE",
                  "phone": "7871174176",
                  "room": "PAT OFFICE",
                  "email": "manikandan.j@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. M. Maragatharajan",
                  "school": "SCSE",
                  "phone": "9003613484",
                  "room": "B-406",
                  "email": "maragatharajan@vitbhopal.ac.in"
            },
            {
                  "name": "Ms. Rakhi",
                  "school": "SCSE",
                  "phone": "8750078320",
                  "room": "",
                  "email": "rakhi@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Shweta Saxena",
                  "school": "SCSE",
                  "phone": "9893954987",
                  "room": "C-511",
                  "email": "shweta.saxena@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Ankush Jain",
                  "school": "SCSE",
                  "phone": "8949224010",
                  "room": "",
                  "email": "ankush.jain@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Surendra Nagar",
                  "school": "SCSE",
                  "phone": "8602783396",
                  "room": "",
                  "email": "surendra.nagar@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Mahendra Pratap Yadav",
                  "school": "SCSE",
                  "phone": "9125933765",
                  "room": "",
                  "email": "mahendra.pratap@vitbhopal.ac.in"
            },
            {
                  "name": "Ms. Meenakshi Choudhary",
                  "school": "SCSE",
                  "phone": "7000176561",
                  "room": "",
                  "email": "meenakshi.choudhary@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Gyan Prakash Tiwary",
                  "school": "SCSE",
                  "phone": "9752791331",
                  "room": "",
                  "email": "gyan.prakash@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Komarasamy G",
                  "school": "SCSE",
                  "phone": "9715614081",
                  "room": "A-402",
                  "email": "komarasamy.g@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Suryakanta Panda",
                  "school": "SCSE",
                  "phone": "9439518626",
                  "room": "",
                  "email": "suryakantapanda@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Kailash Wamanrao Kalare",
                  "school": "SCSE",
                  "phone": "8605050085",
                  "room": "",
                  "email": "kailash.kalare@vitbhopal.ac.in"
            },
            {
                  "name": "Mrs. E. Nirmala",
                  "school": "SCSE",
                  "phone": "8778539987",
                  "room": "B-412",
                  "email": "nirmala.e@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Ribu Mathew",
                  "school": "SEEE",
                  "phone": "9003397713",
                  "room": "G-05",
                  "email": "ribu.mathew@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Mayank Gupta",
                  "school": "SEEE",
                  "phone": "7722993939",
                  "room": "ADMISSION OFFICE-03",
                  "email": "mayank.gupta@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Anirban Bhowmick",
                  "school": "SEEE",
                  "phone": "9547155428",
                  "room": "PAT OFFICE",
                  "email": "anirban.bhowmick@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Nella Anveshkumar",
                  "school": "SEEE",
                  "phone": "9503132874",
                  "room": "A-322",
                  "email": "nella.anveshkumar@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Pallabi Sarkar",
                  "school": "SEEE",
                  "phone": "6294524861",
                  "room": "A-305",
                  "email": "pallabi.sarkar@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Maheswar R",
                  "school": "SEEE",
                  "phone": "9894512300",
                  "room": "",
                  "email": "Maheswar.r@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Ankur Beohar",
                  "school": "SEEE",
                  "phone": "9893383443, 9425704533",
                  "room": "A-244",
                  "email": "ankur.beohar@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Soumitra Keshari Nayak",
                  "school": "SEEE",
                  "phone": "9321923010",
                  "room": "A-246",
                  "email": "soumitra.nayak@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Rahul Kottath",
                  "school": "SEEE",
                  "phone": "8591515682",
                  "room": "",
                  "email": "rahul.kottath@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Abhay Vidyarthi",
                  "school": "SEEE",
                  "phone": "6265754892",
                  "room": "B-413",
                  "email": "abhay.vidyarthi@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Susant Kumar Panigrahi",
                  "school": "SEEE",
                  "phone": "8249232450",
                  "room": "A-310",
                  "email": "susant.kumar@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Om Prakash Pahari",
                  "school": "SEEE",
                  "phone": "9583085832",
                  "room": "A-316",
                  "email": "om.prakash@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. V. Sivasankarn",
                  "school": "SEEE",
                  "phone": "9843856991",
                  "room": "A-243",
                  "email": "sivasankaran@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Baldev Swamy",
                  "school": "SEEE",
                  "phone": "9985175896",
                  "room": "",
                  "email": "baldevswamy@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Debashis Adhikari",
                  "school": "SEEE",
                  "phone": "9822347215",
                  "room": "AB-019 (B)",
                  "email": "debashis@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Praveen Kumar Shukla",
                  "school": "SEEE",
                  "phone": "7999517129 9752100000",
                  "room": "",
                  "email": "praveen.kumar@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Jino Ramson",
                  "school": "SEEE",
                  "phone": "9791327895",
                  "room": "",
                  "email": "jino.ramson@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Amit Kumar",
                  "school": "SEEE",
                  "phone": "870 846 2784",
                  "room": "",
                  "email": "amit.kumar@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Satyajit Mahapatra",
                  "school": "SEEE",
                  "phone": "8249354604, 9853348191",
                  "room": "",
                  "email": "satyajit.mahapatra@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Amit Kumar Singh",
                  "school": "SEEE",
                  "phone": "8840574075",
                  "room": "C-502",
                  "email": "amit.singh@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. P. Narendra Babu",
                  "school": "SEEE",
                  "phone": "6281571216, 9553773487",
                  "room": "AB-410",
                  "email": "narendrababu.p@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Mohammed Irfan Alam",
                  "school": "SMEC",
                  "phone": "9869841985",
                  "room": "",
                  "email": "mohammed.alam@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Ankush D Tharkar",
                  "school": "SMEC",
                  "phone": "8087181373",
                  "room": "B-411",
                  "email": "ankush.tharkar@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Prashant G K",
                  "school": "SMEC",
                  "phone": "9910010941",
                  "room": "A-250",
                  "email": "prashant.gk@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Rohit Sharma",
                  "school": "SMEC",
                  "phone": "9131960256",
                  "room": "A-320",
                  "email": "rohit.sharma@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Pushpdant Jain",
                  "school": "SMEC",
                  "phone": "9437786562",
                  "room": "A-412",
                  "email": "pushpdant.jain@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Balaguru S",
                  "school": "SMEC",
                  "phone": "9444465649",
                  "room": "A-210",
                  "email": "balaguru.s@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Shivmanjree Gopaliya",
                  "school": "SMEC",
                  "phone": "9891354291",
                  "room": "A-307",
                  "email": "shivmanjaree@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Ashish Tripathi",
                  "school": "VITBS",
                  "phone": "7579287442",
                  "room": "",
                  "email": "ashish.tripathi@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Bhakti Parashar",
                  "school": "VITBS",
                  "phone": "9826722177",
                  "room": "A-304",
                  "email": "bhakti.parashar@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Prince Jason",
                  "school": "VITBS",
                  "phone": "9445268898",
                  "room": "",
                  "email": "prince.jason@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Manisha Singh",
                  "school": "VITBS",
                  "phone": "9425005177",
                  "room": "B-415",
                  "email": "manisha.singh@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Saravanan J",
                  "school": "VITBS",
                  "phone": "9047240141",
                  "room": "A-405",
                  "email": "saravanan.j@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Pankaj Kumar",
                  "school": "VITBS",
                  "phone": "9508237322",
                  "room": "C-520",
                  "email": "pankajkumar@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Hemlata Gangwar",
                  "school": "VITBS",
                  "phone": "9766001510",
                  "room": "A-407",
                  "email": "hemlata.gangwar@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. Sheetal Sharma",
                  "school": "SOA",
                  "phone": "8103555591",
                  "room": "A-102",
                  "email": "sheetal.sharma@vitbhopal.ac.in"
            },
            {
                  "name": "Mr. Ujjal Halder",
                  "school": "SOA",
                  "phone": "8981693828",
                  "room": "C-533",
                  "email": "ujjalhalder@vitbhopal.ac.in"
            },
            {
                  "name": "Dr. A. Sirajudeen",
                  "school": "",
                  "phone": "9043787298",
                  "room": "A-314 / G-05",
                  "email": ""
            },
            {
                  "name": "Dr. Pradeep Kumar Mishra",
                  "school": "",
                  "phone": "9926170794 / 9926177094",
                  "room": "A-317 / C-521",
                  "email": ""
            },
            {
                  "name": "Dr. S. Periyanayagi",
                  "school": "",
                  "phone": "9994458455",
                  "room": "C-529 / A-323",
                  "email": ""
            },
            {
                  "name": "Dr. Shantanu Mandal",
                  "school": "",
                  "phone": "9233184705",
                  "room": "LIBRARY / A-414",
                  "email": ""
            },
            {
                  "name": "Dr. Saurabh Mishra",
                  "school": "",
                  "phone": "7394999590",
                  "room": "LIBRARY / B-506",
                  "email": ""
            },
            {
                  "name": "Dr. G. Vishnuvarthanan",
                  "school": "",
                  "phone": "9360654171",
                  "room": "G-03",
                  "email": ""
            },
            {
                  "name": "Dr. Dev brat Gupta",
                  "school": "",
                  "phone": "9079344563",
                  "room": "G-10",
                  "email": ""
            },
            {
                  "name": "Dr. Javed Khan Sheikh",
                  "school": "",
                  "phone": "9320017780",
                  "room": "G-12",
                  "email": ""
            },
            {
                  "name": "Dr. Nikhil Pateria",
                  "school": "",
                  "phone": "7999324362",
                  "room": "G-13",
                  "email": ""
            },
            {
                  "name": "Dr. G.R. Hemalakshmi",
                  "school": "",
                  "phone": "9500396629",
                  "room": "G-14",
                  "email": ""
            },
            {
                  "name": "Nagarajan I",
                  "school": "",
                  "phone": "9131128386",
                  "room": "G-16",
                  "email": ""
            },
            {
                  "name": "VIJAY KUMAR TRIVEDI",
                  "school": "",
                  "phone": "8098999684",
                  "room": "G-17",
                  "email": ""
            },
            {
                  "name": "Dr. Abha Sharma",
                  "school": "",
                  "phone": "8838270601",
                  "room": "G-18",
                  "email": ""
            },
            {
                  "name": "Dr. Dileep Kumar",
                  "school": "",
                  "phone": "9926639291",
                  "room": "G-19",
                  "email": ""
            },
            {
                  "name": "D.Harish Babu",
                  "school": "",
                  "phone": "9455222528",
                  "room": "G-20",
                  "email": ""
            },
            {
                  "name": "J.P.Shritharanyaa",
                  "school": "",
                  "phone": "9893948272",
                  "room": "G-21",
                  "email": ""
            },
            {
                  "name": "Dr. Buvaneswari",
                  "school": "",
                  "phone": "9885168010",
                  "room": "G-22",
                  "email": ""
            },
            {
                  "name": "I. Jasmine Selvakumari Jeya",
                  "school": "",
                  "phone": "9443381609",
                  "room": "A-103",
                  "email": ""
            },
            {
                  "name": "Ar. Poonam Upadhyay",
                  "school": "",
                  "phone": "8860125107",
                  "room": "A-104",
                  "email": ""
            },
            {
                  "name": "Dr. Suparna Patowary",
                  "school": "",
                  "phone": "7433819775",
                  "room": "A-107",
                  "email": ""
            },
            {
                  "name": "Dr. Arun Kumar K.",
                  "school": "",
                  "phone": "",
                  "room": "A-108",
                  "email": ""
            },
            {
                  "name": "Dr. Hemant Kumar Nashine",
                  "school": "",
                  "phone": "8770771319",
                  "room": "A-109",
                  "email": ""
            },
            {
                  "name": "Dr. Ranju Yadav",
                  "school": "",
                  "phone": "9406834330",
                  "room": "A-111",
                  "email": ""
            },
            {
                  "name": "Dr. Chandrabhan Seniya",
                  "school": "",
                  "phone": "9755213002",
                  "room": "A-112",
                  "email": ""
            },
            {
                  "name": "Dr. Faisal Rasheed Lone",
                  "school": "",
                  "phone": "7006910686",
                  "room": "A-113",
                  "email": ""
            },
            {
                  "name": "Dr. Sajjad Ahmed",
                  "school": "",
                  "phone": "7006483148",
                  "room": "A-114",
                  "email": ""
            },
            {
                  "name": "Sripriyan",
                  "school": "",
                  "phone": "8754089331",
                  "room": "A-115",
                  "email": ""
            },
            {
                  "name": "Mr. Abhishek Kumar Shukla",
                  "school": "",
                  "phone": "7470529298",
                  "room": "A-116",
                  "email": ""
            },
            {
                  "name": "Azra Nazir",
                  "school": "",
                  "phone": "7006543347",
                  "room": "A-117",
                  "email": ""
            },
            {
                  "name": "Ms Manorama Chouhan",
                  "school": "",
                  "phone": "7415659511",
                  "room": "A-118",
                  "email": ""
            },
            {
                  "name": "Arindam Sadhukhan",
                  "school": "",
                  "phone": "8804552592",
                  "room": "A-119",
                  "email": ""
            },
            {
                  "name": "Ajay Sharma",
                  "school": "",
                  "phone": "9203837010",
                  "room": "A-120",
                  "email": ""
            },
            {
                  "name": "Bhupendra Panchal",
                  "school": "",
                  "phone": "9770240818",
                  "room": "A-121",
                  "email": ""
            },
            {
                  "name": "Pranshu Pranjal",
                  "school": "",
                  "phone": "8979609032",
                  "room": "A-122",
                  "email": ""
            },
            {
                  "name": "Dr. Subash Chandra Bose",
                  "school": "",
                  "phone": "9445842201",
                  "room": "A-205",
                  "email": ""
            },
            {
                  "name": "Dr. Sasmita Padhy",
                  "school": "",
                  "phone": "9040946658",
                  "room": "A-206",
                  "email": ""
            },
            {
                  "name": "Dr. Preetam Suman",
                  "school": "",
                  "phone": "7376333523",
                  "room": "A-208",
                  "email": ""
            },
            {
                  "name": "Karishma Tiwari",
                  "school": "",
                  "phone": "7227881018",
                  "room": "A-209",
                  "email": ""
            },
            {
                  "name": "Dr Vinesh Kumar",
                  "school": "",
                  "phone": "9758648636",
                  "room": "A-211",
                  "email": ""
            },
            {
                  "name": "Dr. A Usha Ruby",
                  "school": "",
                  "phone": "7708465168",
                  "room": "A-212",
                  "email": ""
            },
            {
                  "name": "Dr. Ranjeeta Kumar",
                  "school": "",
                  "phone": "",
                  "room": "A-213",
                  "email": ""
            },
            {
                  "name": "Dr. M. Manimaran",
                  "school": "",
                  "phone": "",
                  "room": "A-214",
                  "email": ""
            },
            {
                  "name": "Dr. S. Devaraju",
                  "school": "",
                  "phone": "9788445867",
                  "room": "A-215",
                  "email": ""
            },
            {
                  "name": "Harish Chandra",
                  "school": "",
                  "phone": "7248659909",
                  "room": "A-216",
                  "email": ""
            },
            {
                  "name": "Dr. Dheresh Soni",
                  "school": "",
                  "phone": "8878743351",
                  "room": "A-217",
                  "email": ""
            },
            {
                  "name": "Dr. Gopal S Tandel",
                  "school": "",
                  "phone": "9893773358",
                  "room": "A-218",
                  "email": ""
            },
            {
                  "name": "Jaynthi J.",
                  "school": "",
                  "phone": "9646491907",
                  "room": "A-219",
                  "email": ""
            },
            {
                  "name": "Ujjwal Kumar Mishra",
                  "school": "",
                  "phone": "9852977391",
                  "room": "A-220",
                  "email": ""
            },
            {
                  "name": "MR. JAY PRAKASH MAURYA",
                  "school": "",
                  "phone": "7354549227",
                  "room": "A-221",
                  "email": ""
            },
            {
                  "name": "Chandrama Swain",
                  "school": "",
                  "phone": "8460934933",
                  "room": "A-222",
                  "email": ""
            },
            {
                  "name": "Dr. Abdul Rehman",
                  "school": "",
                  "phone": "",
                  "room": "A-223",
                  "email": ""
            },
            {
                  "name": "Dr. S.AANJANKUMAR",
                  "school": "",
                  "phone": "9786501012",
                  "room": "A-224",
                  "email": ""
            },
            {
                  "name": "Karthik Rao M C",
                  "school": "",
                  "phone": "9742739015",
                  "room": "A-225",
                  "email": ""
            },
            {
                  "name": "Dr. Vijay Kumar Patidar",
                  "school": "",
                  "phone": "",
                  "room": "A-226",
                  "email": ""
            },
            {
                  "name": "Dr. Rajdeep Ghosh",
                  "school": "",
                  "phone": "9085577988",
                  "room": "A-227",
                  "email": ""
            },
            {
                  "name": "Dr. Umakanta Meher",
                  "school": "",
                  "phone": "",
                  "room": "A-228",
                  "email": ""
            },
            {
                  "name": "Abhishek Shrivastava",
                  "school": "",
                  "phone": "8887820195",
                  "room": "A-229",
                  "email": ""
            },
            {
                  "name": "Mr. Ashish Kumar Kesarwany",
                  "school": "",
                  "phone": "",
                  "room": "A-230",
                  "email": ""
            },
            {
                  "name": "Bhawna Bagherwal",
                  "school": "",
                  "phone": "9111116600",
                  "room": "A-230",
                  "email": ""
            },
            {
                  "name": "Vijay Kumar Patel",
                  "school": "",
                  "phone": "9026050579",
                  "room": "A-232",
                  "email": ""
            },
            {
                  "name": "Suchismita Patra",
                  "school": "",
                  "phone": "9540610053",
                  "room": "A-233",
                  "email": ""
            },
            {
                  "name": "Rahul Kumar Chaturvedi",
                  "school": "",
                  "phone": "8858709096/8299748659",
                  "room": "A-234",
                  "email": ""
            },
            {
                  "name": "Dr. Shahana Gajala Qureshi",
                  "school": "",
                  "phone": "8770762947",
                  "room": "A-235",
                  "email": ""
            },
            {
                  "name": "Swati Chauhan",
                  "school": "",
                  "phone": "6398505154",
                  "room": "A-236",
                  "email": ""
            },
            {
                  "name": "Anil Kumar Shukla",
                  "school": "",
                  "phone": "9918094075",
                  "room": "A-237",
                  "email": ""
            },
            {
                  "name": "Dr. Juhi Yasmeen",
                  "school": "",
                  "phone": "8273788594",
                  "room": "A-238",
                  "email": ""
            },
            {
                  "name": "Dr. Vivek Parashar",
                  "school": "",
                  "phone": "",
                  "room": "A-239",
                  "email": ""
            },
            {
                  "name": "Dr. Kiran Pandey",
                  "school": "",
                  "phone": "9179948303",
                  "room": "A-240",
                  "email": ""
            },
            {
                  "name": "Dr. Siddharth S Chouhan",
                  "school": "",
                  "phone": "",
                  "room": "A-242",
                  "email": ""
            },
            {
                  "name": "Prashant Kumar Pandey",
                  "school": "",
                  "phone": "8178376418",
                  "room": "A-303",
                  "email": ""
            },
            {
                  "name": "Rajneesh Kumar Patel",
                  "school": "",
                  "phone": "8871235814",
                  "room": "A-306",
                  "email": ""
            },
            {
                  "name": "Dr. Sonal Gupta",
                  "school": "",
                  "phone": "",
                  "room": "A-314",
                  "email": ""
            },
            {
                  "name": "Dr. Anjali Mathur",
                  "school": "",
                  "phone": "9928986023",
                  "room": "A-319",
                  "email": ""
            },
            {
                  "name": "Dr. Monika Sankat",
                  "school": "",
                  "phone": "",
                  "room": "B-305",
                  "email": ""
            },
            {
                  "name": "Harshlata Vishwakarma",
                  "school": "",
                  "phone": "8349780109",
                  "room": "B-306",
                  "email": ""
            },
            {
                  "name": "Narottam Das Patel",
                  "school": "",
                  "phone": "9450095800",
                  "room": "B-307",
                  "email": ""
            },
            {
                  "name": "Dr. C. P. Koushik",
                  "school": "",
                  "phone": "9840403316",
                  "room": "B-309",
                  "email": ""
            },
            {
                  "name": "Dr. Ajeet Singh",
                  "school": "",
                  "phone": "9805075085",
                  "room": "B-315",
                  "email": ""
            },
            {
                  "name": "Abdul Rashid",
                  "school": "",
                  "phone": "8109171886",
                  "room": "A-406",
                  "email": ""
            },
            {
                  "name": "Dr. M. Suresh (Asso. Professor)",
                  "school": "",
                  "phone": "",
                  "room": "A-408",
                  "email": ""
            },
            {
                  "name": "Shiv Shankar Prasad Shukla",
                  "school": "",
                  "phone": "8349390186",
                  "room": "A-409",
                  "email": ""
            },
            {
                  "name": "Ajay Kumar Phulre",
                  "school": "",
                  "phone": "8770450967 9009218023",
                  "room": "A-410",
                  "email": ""
            },
            {
                  "name": "M.SURESH nirmala",
                  "school": "",
                  "phone": "9962212030",
                  "room": "A-411",
                  "email": ""
            },
            {
                  "name": "Jitendra Pratap Singh Mathur",
                  "school": "",
                  "phone": "9893536675",
                  "room": "A-413",
                  "email": ""
            },
            {
                  "name": "Dr. Ganeshan G.",
                  "school": "",
                  "phone": "",
                  "room": "A-415",
                  "email": ""
            },
            {
                  "name": "Devraj Vishnu",
                  "school": "",
                  "phone": "9475451245",
                  "room": "B-404",
                  "email": ""
            },
            {
                  "name": "Dr Ankur Jain",
                  "school": "",
                  "phone": "7415259169",
                  "room": "B-405",
                  "email": ""
            },
            {
                  "name": "Sonali Shrivastava",
                  "school": "",
                  "phone": "9045914940",
                  "room": "B-409",
                  "email": ""
            },
            {
                  "name": "Karthick S.",
                  "school": "",
                  "phone": "9514264651/8103981414",
                  "room": "B-414",
                  "email": ""
            },
            {
                  "name": "Dr. Nilesh Kunhare",
                  "school": "",
                  "phone": "9685251246",
                  "room": "C-401",
                  "email": ""
            },
            {
                  "name": "Joshi Abhishek Dilip",
                  "school": "",
                  "phone": "9421803544",
                  "room": "C-402",
                  "email": ""
            },
            {
                  "name": "Adarsh Patel",
                  "school": "",
                  "phone": "9399414598",
                  "room": "C-403",
                  "email": ""
            },
            {
                  "name": "Dr. Gaurav Soni",
                  "school": "",
                  "phone": "9826018671",
                  "room": "C-404",
                  "email": ""
            },
            {
                  "name": "Dr Saravanan S",
                  "school": "",
                  "phone": "9944059288",
                  "room": "A-501",
                  "email": ""
            },
            {
                  "name": "Ankit Pal",
                  "school": "",
                  "phone": "8586875502",
                  "room": "A-502",
                  "email": ""
            },
            {
                  "name": "Dr. Sandeep Sahu",
                  "school": "",
                  "phone": "9407337972",
                  "room": "A-503",
                  "email": ""
            },
            {
                  "name": "Dr. Raghavendra Mishra",
                  "school": "",
                  "phone": "8085102581",
                  "room": "A-504",
                  "email": ""
            },
            {
                  "name": "Arindam Ghosh",
                  "school": "",
                  "phone": "8328808499",
                  "room": "A-505",
                  "email": ""
            },
            {
                  "name": "Dipankar Sutradhar",
                  "school": "",
                  "phone": "7308126760",
                  "room": "A-507",
                  "email": ""
            },
            {
                  "name": "Dr. Jyoti Chauhan",
                  "school": "",
                  "phone": "8700502598",
                  "room": "A-508",
                  "email": ""
            },
            {
                  "name": "Humaira Fatima",
                  "school": "",
                  "phone": "7455838246/8307962979",
                  "room": "A-509",
                  "email": ""
            },
            {
                  "name": "Dr. Anju Shukla",
                  "school": "",
                  "phone": "9111211104",
                  "room": "A-510",
                  "email": ""
            },
            {
                  "name": "Dr. Manoj Kumar",
                  "school": "",
                  "phone": "8269576451",
                  "room": "A-511",
                  "email": ""
            },
            {
                  "name": "Animesh Bhandari",
                  "school": "",
                  "phone": "8257041061, 9007847469",
                  "room": "A-513",
                  "email": ""
            },
            {
                  "name": "Dr. Ravi Verma",
                  "school": "",
                  "phone": "8770995536",
                  "room": "A-514",
                  "email": ""
            },
            {
                  "name": "DR. RUDRA KALYAN NAYAK",
                  "school": "",
                  "phone": "9861366884",
                  "room": "B-501",
                  "email": ""
            },
            {
                  "name": "Dr. Dip Mukherjee",
                  "school": "",
                  "phone": "",
                  "room": "B-502",
                  "email": ""
            },
            {
                  "name": "Dr. Feroz Babu",
                  "school": "",
                  "phone": "",
                  "room": "B-505",
                  "email": ""
            },
            {
                  "name": "Dr. Shiju. E",
                  "school": "",
                  "phone": "",
                  "room": "B-506",
                  "email": ""
            },
            {
                  "name": "Ms. Geeta Singh",
                  "school": "",
                  "phone": "7680854848",
                  "room": "B-507",
                  "email": ""
            },
            {
                  "name": "Dr. S. K. Das",
                  "school": "",
                  "phone": "",
                  "room": "B-508",
                  "email": ""
            },
            {
                  "name": "Usama Khan",
                  "school": "",
                  "phone": "",
                  "room": "B-509",
                  "email": ""
            },
            {
                  "name": "Mr. Vipin Jain",
                  "school": "",
                  "phone": "",
                  "room": "B-510",
                  "email": ""
            },
            {
                  "name": "Dr. Suneet Joshi",
                  "school": "",
                  "phone": "7748946630",
                  "room": "B-512",
                  "email": ""
            },
            {
                  "name": "Dr. Shafiul Alom Ahmed",
                  "school": "",
                  "phone": "9706931206",
                  "room": "B-513",
                  "email": ""
            },
            {
                  "name": "Dr. Ram Kumar",
                  "school": "",
                  "phone": "9770045634",
                  "room": "C-501",
                  "email": ""
            },
            {
                  "name": "Dr. Sultan Alam",
                  "school": "",
                  "phone": "",
                  "room": "C-504",
                  "email": ""
            },
            {
                  "name": "Vijendra Singh Bramhe",
                  "school": "",
                  "phone": "8954675017",
                  "room": "C-505",
                  "email": ""
            },
            {
                  "name": "Ms. Nancy Kumari",
                  "school": "",
                  "phone": "7011745833",
                  "room": "C-508",
                  "email": ""
            },
            {
                  "name": "Dr. Hemraj S.L.",
                  "school": "",
                  "phone": "7387114521",
                  "room": "C-509",
                  "email": ""
            },
            {
                  "name": "Dr. Vinod Kumar Jatav",
                  "school": "",
                  "phone": "8239074693",
                  "room": "C-510",
                  "email": ""
            },
            {
                  "name": "Soma Saha",
                  "school": "",
                  "phone": "8269896171",
                  "room": "C-512",
                  "email": ""
            },
            {
                  "name": "Santosh Kumar Tripathy",
                  "school": "",
                  "phone": "8658297935",
                  "room": "C-513",
                  "email": ""
            },
            {
                  "name": "Mr. Sanat Jain",
                  "school": "",
                  "phone": "9893979695",
                  "room": "C-514",
                  "email": ""
            },
            {
                  "name": "Dr. G. PRABU KANNA",
                  "school": "",
                  "phone": "9791802829",
                  "room": "C-516",
                  "email": ""
            },
            {
                  "name": "Dr. Rajit Nair",
                  "school": "",
                  "phone": "9907694424, 7000760748",
                  "room": "C-522",
                  "email": ""
            },
            {
                  "name": "Dr. NITIN KUMAR MISHRA",
                  "school": "",
                  "phone": "9826449051",
                  "room": "C-523",
                  "email": ""
            },
            {
                  "name": "Deep Chandra Upadhyay",
                  "school": "",
                  "phone": "9119935285",
                  "room": "C-524",
                  "email": ""
            },
            {
                  "name": "Dr. Ashish Mohan Yadav",
                  "school": "",
                  "phone": "7999836793",
                  "room": "C-527",
                  "email": ""
            },
            {
                  "name": "Ashok Kumar Baral",
                  "school": "",
                  "phone": "9861999643",
                  "room": "C-531",
                  "email": ""
            },
            {
                  "name": "Dr. KR. SIVABALAN",
                  "school": "",
                  "phone": "9698766754",
                  "room": "C-532",
                  "email": ""
            },
            {
                  "name": "Garima Jain",
                  "school": "",
                  "phone": "9302920647",
                  "room": "C-534",
                  "email": ""
            },
            {
                  "name": "Udai Kumar",
                  "school": "",
                  "phone": "7651914458",
                  "room": "C-537",
                  "email": ""
            },
            {
                  "name": "Shilpa Suman",
                  "school": "",
                  "phone": "9693750319",
                  "room": "C-538",
                  "email": ""
            },
            {
                  "name": "PRATOSH KUMAR PAL",
                  "school": "",
                  "phone": "8989806880",
                  "room": "C-539",
                  "email": ""
            },
            {
                  "name": "Prasad Begde",
                  "school": "",
                  "phone": "8225048609",
                  "room": "C-540",
                  "email": ""
            },
            {
                  "name": "Dr. J. George Chellin Chandran",
                  "school": "",
                  "phone": "9384174987",
                  "room": "AB-011",
                  "email": ""
            },
            {
                  "name": "Dr. PRADYUMNA YADAV",
                  "school": "",
                  "phone": "8109961099/7024111639",
                  "room": "AB-019 (A)",
                  "email": ""
            },
            {
                  "name": "Mr. ANIL MEWADA (Secy. of Registrar)",
                  "school": "",
                  "phone": "9131094751",
                  "room": "AB-019 (L)",
                  "email": ""
            },
            {
                  "name": "Dr. S. Ananthakumaran",
                  "school": "",
                  "phone": "9842221962",
                  "room": "PAT OFFICE",
                  "email": ""
            },
            {
                  "name": "R.Sukumar",
                  "school": "",
                  "phone": "9962029293",
                  "room": "PAT OFFICE",
                  "email": ""
            },
            {
                  "name": "Rajendra Mahanandia",
                  "school": "",
                  "phone": "9438659192",
                  "room": "PAT OFFICE",
                  "email": ""
            },
            {
                  "name": "Dr. Abha Gupta",
                  "school": "",
                  "phone": "",
                  "room": "AB-306",
                  "email": ""
            },
            {
                  "name": "Dr. Juhi Kesarwani",
                  "school": "",
                  "phone": "",
                  "room": "AB-306",
                  "email": ""
            },
            {
                  "name": "Mr. RAVI KUMAR SINGH",
                  "school": "",
                  "phone": "",
                  "room": "AB-310",
                  "email": ""
            },
            {
                  "name": "Priyanka Mishra",
                  "school": "",
                  "phone": "9140871509",
                  "room": "AB-406",
                  "email": ""
            },
            {
                  "name": "Dr S.VAIRACHILAI",
                  "school": "",
                  "phone": "8106813402",
                  "room": "AB-406",
                  "email": ""
            },
            {
                  "name": "Dr Kamlesh Chandravanshi",
                  "school": "",
                  "phone": "9009217763",
                  "room": "AB-410",
                  "email": ""
            },
            {
                  "name": "Mr. Vikas Kumar Jain",
                  "school": "",
                  "phone": "9981008680",
                  "room": "AB-506",
                  "email": ""
            },
            {
                  "name": "Mr. Narendra Kumar",
                  "school": "",
                  "phone": "8968945650",
                  "room": "AB-506",
                  "email": ""
            },
            {
                  "name": "Dr. Anil Kumar Yadav",
                  "school": "",
                  "phone": "9479499566",
                  "room": "AB-510",
                  "email": ""
            },
            {
                  "name": "M.R. Thiyagu Priyadharsan",
                  "school": "",
                  "phone": "9994115629",
                  "room": "AB-510",
                  "email": ""
            },
            {
                  "name": "Dr. Sumit Som",
                  "school": "",
                  "phone": "",
                  "room": "LIBRARY",
                  "email": ""
            },
            {
                  "name": "Dr. Sanjay Pan",
                  "school": "",
                  "phone": "",
                  "room": "LIBRARY",
                  "email": ""
            },
            {
                  "name": "Dr. Sanjeev Nayak",
                  "school": "",
                  "phone": "",
                  "room": "LIBRARY",
                  "email": ""
            },
            {
                  "name": "Dr. Shweta Singh",
                  "school": "",
                  "phone": "",
                  "room": "LIBRARY",
                  "email": ""
            },
            {
                  "name": "Dr. Ravindra Prasad",
                  "school": "",
                  "phone": "",
                  "room": "LIBRARY",
                  "email": ""
            },
            {
                  "name": "Dr. Saurabh kumar morya",
                  "school": "",
                  "phone": "9532437348",
                  "room": "LIBRARY",
                  "email": ""
            },
            {
                  "name": "Dr. P.V.N. Kishor",
                  "school": "",
                  "phone": "9553773590",
                  "room": "LIBRARY",
                  "email": ""
            },
            {
                  "name": "Dr. Kashinath",
                  "school": "SCSE",
                  "phone": "9730951876",
                  "room": "",
                  "email": ""
            },
            {
                  "name": "Dr. Santosh Kumar Bahl",
                  "school": "SASL",
                  "phone": "9373410389",
                  "room": "",
                  "email": ""
            },
            {
                  "name": "Dr. Dipanjana Hazra",
                  "school": "SASL",
                  "phone": "9340355344",
                  "room": "",
                  "email": ""
            },
            {
                  "name": "Dr. Kiran Kumar Behra",
                  "school": "SASL",
                  "phone": "8267808230",
                  "room": "",
                  "email": ""
            },
            {
                  "name": "Dr. Gounder Thangamani Jayaram",
                  "school": "SASL",
                  "phone": "8110019705",
                  "room": "",
                  "email": ""
            },
            {
                  "name": "Dr. Hemanta Kalita",
                  "school": "SASL",
                  "phone": "8811039996",
                  "room": "",
                  "email": ""
            }
      ];

/**
 * Search faculty directory by query (matches name, cabin room, school code, or phone number)
 */
export function searchFacultyDirectory(query = "", list = ALL_FACULTY_DATA) {
  if (!query || !query.trim()) return list;
  const q = query.trim().toLowerCase();
  return list.filter(f => {
    const matchesName = (f.name || "").toLowerCase().includes(q);
    const matchesSchool = (f.school || "").toLowerCase().includes(q);
    const matchesRoom = (f.room || "").toLowerCase().includes(q);
    const matchesPhone = (f.phone || "").toLowerCase().includes(q);
    const matchesEmail = (f.email || "").toLowerCase().includes(q);
    return matchesName || matchesSchool || matchesRoom || matchesPhone || matchesEmail;
  });
}

/**
 * Lookup faculty members by cabin room number (e.g. "A-401", "B-503")
 */
export function findFacultyByRoom(roomNumber, list = ALL_FACULTY_DATA) {
  if (!roomNumber) return [];
  const q = roomNumber.trim().toLowerCase();
  return list.filter(f => (f.room || "").toLowerCase().includes(q));
}

/**
 * Lookup faculty members by phone number
 */
export function findFacultyByPhone(phoneNumber, list = ALL_FACULTY_DATA) {
  if (!phoneNumber) return [];
  const q = phoneNumber.trim().replace(/[^0-9]/g, "");
  return list.filter(f => (f.phone || "").replace(/[^0-9]/g, "").includes(q));
}

/**
 * Lookup faculty members by email address
 */
export function findFacultyByEmail(email, list = ALL_FACULTY_DATA) {
  if (!email) return [];
  const q = email.trim().toLowerCase();
  return list.filter(f => (f.email || "").toLowerCase().includes(q));
}
