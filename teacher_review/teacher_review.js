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
            "room": "A-401"
      },
      {
            "name": "Dr. Suresh Dara",
            "school": "SASL",
            "phone": "7353268058",
            "room": "A-321"
      },
      {
            "name": "Dr. Mayank Sharma",
            "school": "SASL",
            "phone": "9826081038",
            "room": "B-503"
      },
      {
            "name": "Dr. Bhumika Choksi",
            "school": "SASL",
            "phone": "7016527953",
            "room": "A-318"
      },
      {
            "name": "Dr. Pavan Kumar",
            "school": "SASL",
            "phone": "8179700264",
            "room": "B-514"
      },
      {
            "name": "Dr. Navneet Kumar Verma",
            "school": "SASL",
            "phone": "9598663322",
            "room": "A-203"
      },
      {
            "name": "Dr. Sayed Mohammed Zeeshan",
            "school": "SASL",
            "phone": "7004465671",
            "room": "B-511"
      },
      {
            "name": "Dr. Reena Jain",
            "school": "SASL",
            "phone": "8989982847",
            "room": "A-110"
      },
      {
            "name": "Dr. Mamta Agrawal",
            "school": "SASL",
            "phone": "9425027637",
            "room": "A-201"
      },
      {
            "name": "Dr. Anant Kant Shukla",
            "school": "SASL",
            "phone": "8050710905",
            "room": "G-11"
      },
      {
            "name": "Dr. Neha Choubey",
            "school": "SASL",
            "phone": "9713606045",
            "room": "ADMISSION OFFICE-02"
      },
      {
            "name": "Dr. Manisha Pandey",
            "school": "SASL",
            "phone": "9039826104",
            "room": "G-04"
      },
      {
            "name": "Dr. Ajay Kumar Bhurjee",
            "school": "SASL",
            "phone": "9178913172",
            "room": "A-301"
      },
      {
            "name": "Dr. Rabia Musheer",
            "school": "SASL",
            "phone": "9479967401",
            "room": "B-408"
      },
      {
            "name": "Dr. Akshara Makrariya",
            "school": "SASL",
            "phone": "7748836973",
            "room": "A-302"
      },
      {
            "name": "Dr. Yogesh Shukla",
            "school": "SASL",
            "phone": "9479877102",
            "room": "ADMISSION OFFICE-01"
      },
      {
            "name": "Dr. Jyoti Badge",
            "school": "SASL",
            "phone": "9993945259",
            "room": "B-504"
      },
      {
            "name": "Dr. Manickam . A",
            "school": "SASL",
            "phone": "9789742540",
            "room": "C-503"
      },
      {
            "name": "Dr. Kumar Abhishek",
            "school": "SASL",
            "phone": "9043642001",
            "room": "A-106"
      },
      {
            "name": "Ms. Priyanka Roy",
            "school": "SASL",
            "phone": "8296603348",
            "room": "C-525"
      },
      {
            "name": "Ms. Sheerin Kayenat",
            "school": "SASL",
            "phone": "7870955315",
            "room": "B-303"
      },
      {
            "name": "Dr. Nilam Venkatakoteswararao",
            "school": "SASL",
            "phone": "9177477722",
            "room": "B-302"
      },
      {
            "name": "Dr. Harihara Padhy",
            "school": "SASL",
            "phone": "9668780860",
            "room": ""
      },
      {
            "name": "Dr. Manoj Acharya",
            "school": "SASL",
            "phone": "9827206056",
            "room": "G-06"
      },
      {
            "name": "Dr. Sumit Mittal",
            "school": "SASL",
            "phone": "9318325748",
            "room": "B-304"
      },
      {
            "name": "Dr. Arockiasamy",
            "school": "SASL",
            "phone": "9176825969",
            "room": ""
      },
      {
            "name": "Dr. G L Balaji",
            "school": "SASL",
            "phone": "9994613458",
            "room": "A-414"
      },
      {
            "name": "Dr. Saurav prasad",
            "school": "SASL",
            "phone": "9310157546",
            "room": "C-506"
      },
      {
            "name": "Dr. Satyam ravi",
            "school": "SASL",
            "phone": "9646937054",
            "room": "C-536"
      },
      {
            "name": "Dr. Vivek Kumar Yadav",
            "school": "SASL",
            "phone": "9452266088",
            "room": ""
      },
      {
            "name": "Dr. Saurabh Bhargava",
            "school": "SASL",
            "phone": "8901539669",
            "room": "B-401"
      },
      {
            "name": "Dr. Shweta Mukherjee",
            "school": "SASL",
            "phone": "7354155194 / 7354155194/9826215494",
            "room": "A-204"
      },
      {
            "name": "Dr. Avirup Das",
            "school": "SASL",
            "phone": "9674927124",
            "room": "A-313"
      },
      {
            "name": "Dr. Sharad Chandra Tripathi",
            "school": "SASL",
            "phone": "7697867027",
            "room": "PAT OFFICE"
      },
      {
            "name": "Dr. Divya Haridas",
            "school": "SASL",
            "phone": "9930594727",
            "room": "C-515 / AB-110"
      },
      {
            "name": "Dr. Ramu Pasupathi Sugavaneshwar",
            "school": "SASL",
            "phone": "7899036744",
            "room": "A-308"
      },
      {
            "name": "Dr. Rajdeep Singh Payal",
            "school": "SASL",
            "phone": "9389634514",
            "room": "B-515"
      },
      {
            "name": "Dr. Pradeep Kumar Kashyap",
            "school": "SASL",
            "phone": "7465967251",
            "room": "A-325"
      },
      {
            "name": "Dr. Xavier Suresh",
            "school": "SASL",
            "phone": "9486915394",
            "room": "B-312"
      },
      {
            "name": "Dr. Suchetana Sadhukan",
            "school": "SASL",
            "phone": "9748005527",
            "room": "A-311"
      },
      {
            "name": "Dr. Chandan Kumar",
            "school": "SEEE",
            "phone": "8896677605",
            "room": ""
      },
      {
            "name": "Dr. Siddhartha Maiti",
            "school": "SBE",
            "phone": "9326132839",
            "room": "A-245"
      },
      {
            "name": "Dr. Neetu Kalra",
            "school": "SBE",
            "phone": "9479661282",
            "room": "B-410"
      },
      {
            "name": "Dr. Arumay PAL",
            "school": "SBE",
            "phone": "7439611148",
            "room": ""
      },
      {
            "name": "Dr. Mahendran B",
            "school": "SBE",
            "phone": "7382145827",
            "room": "A-506"
      },
      {
            "name": "Dr. Justin Joseph",
            "school": "SBE",
            "phone": "9961438040",
            "room": ""
      },
      {
            "name": "Dr. Anita Yadav",
            "school": "SASL",
            "phone": "9977588551",
            "room": "A-315"
      },
      {
            "name": "Dr. Vinod Bhatt",
            "school": "SASL",
            "phone": "9826143220",
            "room": "G-02"
      },
      {
            "name": "Dr. Rajeev Saxena",
            "school": "SASL",
            "phone": "9701336323",
            "room": "A-248"
      },
      {
            "name": "Dr. Ravi Bhatt",
            "school": "SASL",
            "phone": "9630400659",
            "room": "A-515"
      },
      {
            "name": "Dr. Soumya Sankar Ghosh",
            "school": "SASL",
            "phone": "9748581767",
            "room": "C-507"
      },
      {
            "name": "Dr. Vidhi Agrawal",
            "school": "SASL",
            "phone": "9838889590",
            "room": ""
      },
      {
            "name": "Dr. Atul Aman",
            "school": "SASL",
            "phone": "8420862335",
            "room": "A-512"
      },
      {
            "name": "Dr. Pushpinder Singh Patheja",
            "school": "SCSE",
            "phone": "9893273243",
            "room": "G-09"
      },
      {
            "name": "Dr. Sandip Mal",
            "school": "SCSE",
            "phone": "7974537024",
            "room": "A-207"
      },
      {
            "name": "Dr. Kanchan Lata Kashyap",
            "school": "SCSE",
            "phone": "9826733258",
            "room": "B-310"
      },
      {
            "name": "Dr. Sountharrajan S",
            "school": "SCSE",
            "phone": "9786066776",
            "room": ""
      },
      {
            "name": "Dr. Shriram R",
            "school": "SCSE",
            "phone": "7358194673",
            "room": "PAT OFFICE"
      },
      {
            "name": "Dr. Baseera.A",
            "school": "SCSE",
            "phone": "9698960667",
            "room": "G-01"
      },
      {
            "name": "Dr. Shishir Kumar Shandilya",
            "school": "SCSE",
            "phone": "9009972032",
            "room": "AB-507"
      },
      {
            "name": "Ms. Suganya E",
            "school": "SCSE",
            "phone": "9884970535",
            "room": ""
      },
      {
            "name": "Dr. Praveen Lalwani",
            "school": "SCSE",
            "phone": "9826573350",
            "room": "A-101"
      },
      {
            "name": "Dr. Nilamadhab Mishra",
            "school": "SCSE",
            "phone": "7735627711",
            "room": "B-308"
      },
      {
            "name": "Dr. Pon Harshavardhanan",
            "school": "SCSE",
            "phone": "9840768153",
            "room": "A-202"
      },
      {
            "name": "Dr. Manas Kumar Mishra",
            "school": "SCSE",
            "phone": "9956250356",
            "room": ""
      },
      {
            "name": "Dr. Amudhavel J",
            "school": "SCSE",
            "phone": "9597788658",
            "room": ""
      },
      {
            "name": "Mr. Anand Motwani",
            "school": "SCSE",
            "phone": "8818965776",
            "room": "B-407"
      },
      {
            "name": "Dr. Chandan Kumar Behera",
            "school": "SCSE",
            "phone": "8847872575 / 9039490306",
            "room": "B-314"
      },
      {
            "name": "Dr. Ashwin M",
            "school": "SCSE",
            "phone": "9710970034",
            "room": ""
      },
      {
            "name": "Dr. Ashish Kumar Sahu",
            "school": "SCSE",
            "phone": "9506347438",
            "room": ""
      },
      {
            "name": "Dr. L Sathish Kumar",
            "school": "SCSE",
            "phone": "9597200240",
            "room": "B-402"
      },
      {
            "name": "Dr. V Pandimurugan",
            "school": "SCSE",
            "phone": "9976277455",
            "room": ""
      },
      {
            "name": "Dr. Subhash Chandra Patel",
            "school": "SCSE",
            "phone": "7905407837",
            "room": "A-404"
      },
      {
            "name": "Mr. Muneeswaran",
            "school": "SCSE",
            "phone": "9842541667",
            "room": ""
      },
      {
            "name": "Dr. Paras Jain",
            "school": "SCSE",
            "phone": "9963023330",
            "room": "G-07"
      },
      {
            "name": "Dr. Virendra Singh Kushwaha",
            "school": "SCSE",
            "phone": "7415869616",
            "room": "A-309"
      },
      {
            "name": "Dr. Venkat Prasad Padhy",
            "school": "SCSE",
            "phone": "8310597038",
            "room": "G-15"
      },
      {
            "name": "Dr. H Azath",
            "school": "SCSE",
            "phone": "9865164505",
            "room": "B-311"
      },
      {
            "name": "Dr. L. Shakeera",
            "school": "SCSE",
            "phone": "9444679387",
            "room": ""
      },
      {
            "name": "Dr. Sharmasth Vali Y",
            "school": "SCSE",
            "phone": "9444679387",
            "room": ""
      },
      {
            "name": "Dr. Rajasoundaran S",
            "school": "SCSE",
            "phone": "9025678818",
            "room": ""
      },
      {
            "name": "Dr. R.Thilagavathy",
            "school": "SCSE",
            "phone": "9894984025",
            "room": ""
      },
      {
            "name": "Dr. Nitish Andola",
            "school": "SCSE",
            "phone": "8218880567",
            "room": ""
      },
      {
            "name": "Dr. R.Rakesh",
            "school": "SCSE",
            "phone": "9840768026",
            "room": ""
      },
      {
            "name": "Dr. Alangudi Balaji",
            "school": "SCSE",
            "phone": "9894391980",
            "room": ""
      },
      {
            "name": "Dr. Hariharasitaraman. S",
            "school": "SCSE",
            "phone": "99402 95262",
            "room": "PAT OFFICE"
      },
      {
            "name": "Dr. Amit Mishra",
            "school": "SCSE",
            "phone": "8619430401",
            "room": ""
      },
      {
            "name": "Dr. Vikas Panthi",
            "school": "SCSE",
            "phone": "9778460751",
            "room": "A-324 / C-519"
      },
      {
            "name": "Dr. Nidhi Mishra",
            "school": "SCSE",
            "phone": "9887677357",
            "room": ""
      },
      {
            "name": "Dr. Saravanan",
            "school": "SCSE",
            "phone": "9865483413",
            "room": "A-249 / C-517"
      },
      {
            "name": "Dr. Durga Prasad",
            "school": "SCSE",
            "phone": "8008562322",
            "room": ""
      },
      {
            "name": "Dr. Aprna Tripathi",
            "school": "SCSE",
            "phone": "9415736072",
            "room": ""
      },
      {
            "name": "Dr. Suthir S",
            "school": "SCSE",
            "phone": "9944042932",
            "room": ""
      },
      {
            "name": "Dr. Trapti Sharma",
            "school": "SCSE",
            "phone": "9425630895",
            "room": "C-526"
      },
      {
            "name": "Dr. Kannan S",
            "school": "SCSE",
            "phone": "9976878278 / 7702672411",
            "room": "B-403 / C-528"
      },
      {
            "name": "Dr. A.V.R Mayuri",
            "school": "SCSE",
            "phone": "9441438843",
            "room": "B-313"
      },
      {
            "name": "Dr. Murugeswari.k",
            "school": "SCSE",
            "phone": "9994276824",
            "room": "A-403"
      },
      {
            "name": "Dr. Abha Trivedi",
            "school": "SCSE",
            "phone": "7839319383",
            "room": "C-530"
      },
      {
            "name": "Dr. D. Lakshmi",
            "school": "SCSE",
            "phone": "9945379089 / 86100 93319",
            "room": "G-08"
      },
      {
            "name": "Dr. Swagat Kumar",
            "school": "SCSE",
            "phone": "9437181775 / 7978166023",
            "room": "A-247"
      },
      {
            "name": "Dr. Ganeshan R",
            "school": "SCSE",
            "phone": "9789920281 / 8610285129",
            "room": "A-312"
      },
      {
            "name": "Mr. Manickavasagam",
            "school": "SCSE",
            "phone": "9600156423",
            "room": ""
      },
      {
            "name": "Dr. Ashok Patel",
            "school": "SCSE",
            "phone": "9770890583",
            "room": "A-326 / C-535"
      },
      {
            "name": "Dr. Balaji A",
            "school": "SCSE",
            "phone": "9444422518 / 9444433518",
            "room": "A-241"
      },
      {
            "name": "Dr. Rizwan Ur Rahman",
            "school": "SCSE",
            "phone": "9893526322",
            "room": "C-518"
      },
      {
            "name": "Dr. Poonkuntran",
            "school": "SCSE",
            "phone": "9894432890",
            "room": "AB-019 (C)"
      },
      {
            "name": "Dr. G. Elangovan",
            "school": "SCSE",
            "phone": "7904994756",
            "room": ""
      },
      {
            "name": "Mrs. Simi V.R",
            "school": "SCSE",
            "phone": "9567987449",
            "room": ""
      },
      {
            "name": "Mr. Hariharan Rajadurai",
            "school": "SCSE",
            "phone": "9791322178",
            "room": "B-301"
      },
      {
            "name": "Dr. Mohandas R",
            "school": "SCSE",
            "phone": "9840595406",
            "room": ""
      },
      {
            "name": "Mr. Ab Rouf Khan",
            "school": "SCSE",
            "phone": "8825073337",
            "room": ""
      },
      {
            "name": "Dr. J. Manikandan",
            "school": "SCSE",
            "phone": "7871174176",
            "room": "PAT OFFICE"
      },
      {
            "name": "Dr. M. Maragatharajan",
            "school": "SCSE",
            "phone": "9003613484",
            "room": "B-406"
      },
      {
            "name": "Ms. Rakhi",
            "school": "SCSE",
            "phone": "8750078320",
            "room": ""
      },
      {
            "name": "Dr. Shweta Saxena",
            "school": "SCSE",
            "phone": "9893954987",
            "room": "C-511"
      },
      {
            "name": "Mr. Ankush Jain",
            "school": "SCSE",
            "phone": "8949224010",
            "room": ""
      },
      {
            "name": "Mr. Surendra Nagar",
            "school": "SCSE",
            "phone": "8602783396",
            "room": ""
      },
      {
            "name": "Mr. Mahendra Pratap Yadav",
            "school": "SCSE",
            "phone": "9125933765",
            "room": ""
      },
      {
            "name": "Ms. Meenakshi Choudhary",
            "school": "SCSE",
            "phone": "7000176561",
            "room": ""
      },
      {
            "name": "Mr. Gyan Prakash Tiwary",
            "school": "SCSE",
            "phone": "9752791331",
            "room": ""
      },
      {
            "name": "Dr. Komarasamy G",
            "school": "SCSE",
            "phone": "9715614081",
            "room": "A-402"
      },
      {
            "name": "Mr. Suryakanta Panda",
            "school": "SCSE",
            "phone": "9439518626",
            "room": ""
      },
      {
            "name": "Mr. Kailash Wamanrao Kalare",
            "school": "SCSE",
            "phone": "8605050085",
            "room": ""
      },
      {
            "name": "Mrs. E. Nirmala",
            "school": "SCSE",
            "phone": "8778539987",
            "room": "B-412"
      },
      {
            "name": "Dr. Ribu Mathew",
            "school": "SEEE",
            "phone": "9003397713",
            "room": "G-05"
      },
      {
            "name": "Mr. Mayank Gupta",
            "school": "SEEE",
            "phone": "7722993939",
            "room": "ADMISSION OFFICE-03"
      },
      {
            "name": "Dr. Anirban Bhowmick",
            "school": "SEEE",
            "phone": "9547155428",
            "room": "PAT OFFICE"
      },
      {
            "name": "Dr. Nella Anveshkumar",
            "school": "SEEE",
            "phone": "9503132874",
            "room": "A-322"
      },
      {
            "name": "Dr. Pallabi Sarkar",
            "school": "SEEE",
            "phone": "6294524861",
            "room": "A-305"
      },
      {
            "name": "Dr. Maheswar R",
            "school": "SEEE",
            "phone": "9894512300",
            "room": ""
      },
      {
            "name": "Dr. Ankur Beohar",
            "school": "SEEE",
            "phone": "9893383443, 9425704533",
            "room": "A-244"
      },
      {
            "name": "Mr. Soumitra Keshari Nayak",
            "school": "SEEE",
            "phone": "9321923010",
            "room": "A-246"
      },
      {
            "name": "Dr. Rahul Kottath",
            "school": "SEEE",
            "phone": "8591515682",
            "room": ""
      },
      {
            "name": "Dr. Abhay Vidyarthi",
            "school": "SEEE",
            "phone": "6265754892",
            "room": "B-413"
      },
      {
            "name": "Dr. Susant Kumar Panigrahi",
            "school": "SEEE",
            "phone": "8249232450",
            "room": "A-310"
      },
      {
            "name": "Dr. Om Prakash Pahari",
            "school": "SEEE",
            "phone": "9583085832",
            "room": "A-316"
      },
      {
            "name": "Dr. V. Sivasankarn",
            "school": "SEEE",
            "phone": "9843856991",
            "room": "A-243"
      },
      {
            "name": "Dr. Baldev Swamy",
            "school": "SEEE",
            "phone": "9985175896",
            "room": ""
      },
      {
            "name": "Dr. Debashis Adhikari",
            "school": "SEEE",
            "phone": "9822347215",
            "room": "AB-019 (B)"
      },
      {
            "name": "Mr. Praveen Kumar Shukla",
            "school": "SEEE",
            "phone": "7999517129 9752100000",
            "room": ""
      },
      {
            "name": "Dr. Jino Ramson",
            "school": "SEEE",
            "phone": "9791327895",
            "room": ""
      },
      {
            "name": "Dr. Amit Kumar",
            "school": "SEEE",
            "phone": "870 846 2784",
            "room": ""
      },
      {
            "name": "Mr. Satyajit Mahapatra",
            "school": "SEEE",
            "phone": "8249354604, 9853348191",
            "room": ""
      },
      {
            "name": "Mr. Amit Kumar Singh",
            "school": "SEEE",
            "phone": "8840574075",
            "room": "C-502"
      },
      {
            "name": "Mr. P. Narendra Babu",
            "school": "SEEE",
            "phone": "6281571216, 9553773487",
            "room": "AB-410"
      },
      {
            "name": "Dr. Mohammed Irfan Alam",
            "school": "SMEC",
            "phone": "9869841985",
            "room": ""
      },
      {
            "name": "Mr. Ankush D Tharkar",
            "school": "SMEC",
            "phone": "8087181373",
            "room": "B-411"
      },
      {
            "name": "Dr. Prashant G K",
            "school": "SMEC",
            "phone": "9910010941",
            "room": "A-250"
      },
      {
            "name": "Dr. Rohit Sharma",
            "school": "SMEC",
            "phone": "9131960256",
            "room": "A-320"
      },
      {
            "name": "Dr. Pushpdant Jain",
            "school": "SMEC",
            "phone": "9437786562",
            "room": "A-412"
      },
      {
            "name": "Dr. Balaguru S",
            "school": "SMEC",
            "phone": "9444465649",
            "room": "A-210"
      },
      {
            "name": "Dr. Shivmanjree Gopaliya",
            "school": "SMEC",
            "phone": "9891354291",
            "room": "A-307"
      },
      {
            "name": "Dr. Ashish Tripathi",
            "school": "VITBS",
            "phone": "7579287442",
            "room": ""
      },
      {
            "name": "Dr. Bhakti Parashar",
            "school": "VITBS",
            "phone": "9826722177",
            "room": "A-304"
      },
      {
            "name": "Dr. Prince Jason",
            "school": "VITBS",
            "phone": "9445268898",
            "room": ""
      },
      {
            "name": "Dr. Manisha Singh",
            "school": "VITBS",
            "phone": "9425005177",
            "room": "B-415"
      },
      {
            "name": "Dr. Saravanan J",
            "school": "VITBS",
            "phone": "9047240141",
            "room": "A-405"
      },
      {
            "name": "Dr. Pankaj Kumar",
            "school": "VITBS",
            "phone": "9508237322",
            "room": "C-520"
      },
      {
            "name": "Dr. Hemlata Gangwar",
            "school": "VITBS",
            "phone": "9766001510",
            "room": "A-407"
      },
      {
            "name": "Dr. Sheetal Sharma",
            "school": "SOA",
            "phone": "8103555591",
            "room": "A-102"
      },
      {
            "name": "Mr. Ujjal Halder",
            "school": "SOA",
            "phone": "8981693828",
            "room": "C-533"
      },
      {
            "name": "Dr. A. Sirajudeen",
            "school": "",
            "phone": "9043787298",
            "room": "A-314 / G-05"
      },
      {
            "name": "Dr. Pradeep Kumar Mishra",
            "school": "",
            "phone": "9926170794 / 9926177094",
            "room": "A-317 / C-521"
      },
      {
            "name": "Dr. S. Periyanayagi",
            "school": "",
            "phone": "9994458455",
            "room": "C-529 / A-323"
      },
      {
            "name": "Dr. Shantanu Mandal",
            "school": "",
            "phone": "9233184705",
            "room": "LIBRARY / A-414"
      },
      {
            "name": "Dr. Saurabh Mishra",
            "school": "",
            "phone": "7394999590",
            "room": "LIBRARY / B-506"
      },
      {
            "name": "Dr. G. Vishnuvarthanan",
            "school": "",
            "phone": "9360654171",
            "room": "G-03"
      },
      {
            "name": "Dr. Dev brat Gupta",
            "school": "",
            "phone": "9079344563",
            "room": "G-10"
      },
      {
            "name": "Dr. Javed Khan Sheikh",
            "school": "",
            "phone": "9320017780",
            "room": "G-12"
      },
      {
            "name": "Dr. Nikhil Pateria",
            "school": "",
            "phone": "7999324362",
            "room": "G-13"
      },
      {
            "name": "Dr. G.R. Hemalakshmi",
            "school": "",
            "phone": "9500396629",
            "room": "G-14"
      },
      {
            "name": "Nagarajan I",
            "school": "",
            "phone": "9131128386",
            "room": "G-16"
      },
      {
            "name": "VIJAY KUMAR TRIVEDI",
            "school": "",
            "phone": "8098999684",
            "room": "G-17"
      },
      {
            "name": "Dr. Abha Sharma",
            "school": "",
            "phone": "8838270601",
            "room": "G-18"
      },
      {
            "name": "Dr. Dileep Kumar",
            "school": "",
            "phone": "9926639291",
            "room": "G-19"
      },
      {
            "name": "D.Harish Babu",
            "school": "",
            "phone": "9455222528",
            "room": "G-20"
      },
      {
            "name": "J.P.Shritharanyaa",
            "school": "",
            "phone": "9893948272",
            "room": "G-21"
      },
      {
            "name": "Dr. Buvaneswari",
            "school": "",
            "phone": "9885168010",
            "room": "G-22"
      },
      {
            "name": "I. Jasmine Selvakumari Jeya",
            "school": "",
            "phone": "9443381609",
            "room": "A-103"
      },
      {
            "name": "Ar. Poonam Upadhyay",
            "school": "",
            "phone": "8860125107",
            "room": "A-104"
      },
      {
            "name": "Dr. Suparna Patowary",
            "school": "",
            "phone": "7433819775",
            "room": "A-107"
      },
      {
            "name": "Dr. Arun Kumar K.",
            "school": "",
            "phone": "",
            "room": "A-108"
      },
      {
            "name": "Dr. Hemant Kumar Nashine",
            "school": "",
            "phone": "8770771319",
            "room": "A-109"
      },
      {
            "name": "Dr. Ranju Yadav",
            "school": "",
            "phone": "9406834330",
            "room": "A-111"
      },
      {
            "name": "Dr. Chandrabhan Seniya",
            "school": "",
            "phone": "9755213002",
            "room": "A-112"
      },
      {
            "name": "Dr. Faisal Rasheed Lone",
            "school": "",
            "phone": "7006910686",
            "room": "A-113"
      },
      {
            "name": "Dr. Sajjad Ahmed",
            "school": "",
            "phone": "7006483148",
            "room": "A-114"
      },
      {
            "name": "Sripriyan",
            "school": "",
            "phone": "8754089331",
            "room": "A-115"
      },
      {
            "name": "Mr. Abhishek Kumar Shukla",
            "school": "",
            "phone": "7470529298",
            "room": "A-116"
      },
      {
            "name": "Azra Nazir",
            "school": "",
            "phone": "7006543347",
            "room": "A-117"
      },
      {
            "name": "Ms Manorama Chouhan",
            "school": "",
            "phone": "7415659511",
            "room": "A-118"
      },
      {
            "name": "Arindam Sadhukhan",
            "school": "",
            "phone": "8804552592",
            "room": "A-119"
      },
      {
            "name": "Ajay Sharma",
            "school": "",
            "phone": "9203837010",
            "room": "A-120"
      },
      {
            "name": "Bhupendra Panchal",
            "school": "",
            "phone": "9770240818",
            "room": "A-121"
      },
      {
            "name": "Pranshu Pranjal",
            "school": "",
            "phone": "8979609032",
            "room": "A-122"
      },
      {
            "name": "Dr. Subash Chandra Bose",
            "school": "",
            "phone": "9445842201",
            "room": "A-205"
      },
      {
            "name": "Dr. Sasmita Padhy",
            "school": "",
            "phone": "9040946658",
            "room": "A-206"
      },
      {
            "name": "Dr. Preetam Suman",
            "school": "",
            "phone": "7376333523",
            "room": "A-208"
      },
      {
            "name": "Karishma Tiwari",
            "school": "",
            "phone": "7227881018",
            "room": "A-209"
      },
      {
            "name": "Dr Vinesh Kumar",
            "school": "",
            "phone": "9758648636",
            "room": "A-211"
      },
      {
            "name": "Dr. A Usha Ruby",
            "school": "",
            "phone": "7708465168",
            "room": "A-212"
      },
      {
            "name": "Dr. Ranjeeta Kumar",
            "school": "",
            "phone": "",
            "room": "A-213"
      },
      {
            "name": "Dr. M. Manimaran",
            "school": "",
            "phone": "",
            "room": "A-214"
      },
      {
            "name": "Dr. S. Devaraju",
            "school": "",
            "phone": "9788445867",
            "room": "A-215"
      },
      {
            "name": "Harish Chandra",
            "school": "",
            "phone": "7248659909",
            "room": "A-216"
      },
      {
            "name": "Dr. Dheresh Soni",
            "school": "",
            "phone": "8878743351",
            "room": "A-217"
      },
      {
            "name": "Dr. Gopal S Tandel",
            "school": "",
            "phone": "9893773358",
            "room": "A-218"
      },
      {
            "name": "Jaynthi J.",
            "school": "",
            "phone": "9646491907",
            "room": "A-219"
      },
      {
            "name": "Ujjwal Kumar Mishra",
            "school": "",
            "phone": "9852977391",
            "room": "A-220"
      },
      {
            "name": "MR. JAY PRAKASH MAURYA",
            "school": "",
            "phone": "7354549227",
            "room": "A-221"
      },
      {
            "name": "Chandrama Swain",
            "school": "",
            "phone": "8460934933",
            "room": "A-222"
      },
      {
            "name": "Dr. Abdul Rehman",
            "school": "",
            "phone": "",
            "room": "A-223"
      },
      {
            "name": "Dr. S.AANJANKUMAR",
            "school": "",
            "phone": "9786501012",
            "room": "A-224"
      },
      {
            "name": "Karthik Rao M C",
            "school": "",
            "phone": "9742739015",
            "room": "A-225"
      },
      {
            "name": "Dr. Vijay Kumar Patidar",
            "school": "",
            "phone": "",
            "room": "A-226"
      },
      {
            "name": "Dr. Rajdeep Ghosh",
            "school": "",
            "phone": "9085577988",
            "room": "A-227"
      },
      {
            "name": "Dr. Umakanta Meher",
            "school": "",
            "phone": "",
            "room": "A-228"
      },
      {
            "name": "Abhishek Shrivastava",
            "school": "",
            "phone": "8887820195",
            "room": "A-229"
      },
      {
            "name": "Mr. Ashish Kumar Kesarwany",
            "school": "",
            "phone": "",
            "room": "A-230"
      },
      {
            "name": "Bhawna Bagherwal",
            "school": "",
            "phone": "9111116600",
            "room": "A-230"
      },
      {
            "name": "Vijay Kumar Patel",
            "school": "",
            "phone": "9026050579",
            "room": "A-232"
      },
      {
            "name": "Suchismita Patra",
            "school": "",
            "phone": "9540610053",
            "room": "A-233"
      },
      {
            "name": "Rahul Kumar Chaturvedi",
            "school": "",
            "phone": "8858709096/8299748659",
            "room": "A-234"
      },
      {
            "name": "Dr. Shahana Gajala Qureshi",
            "school": "",
            "phone": "8770762947",
            "room": "A-235"
      },
      {
            "name": "Swati Chauhan",
            "school": "",
            "phone": "6398505154",
            "room": "A-236"
      },
      {
            "name": "Anil Kumar Shukla",
            "school": "",
            "phone": "9918094075",
            "room": "A-237"
      },
      {
            "name": "Dr. Juhi Yasmeen",
            "school": "",
            "phone": "8273788594",
            "room": "A-238"
      },
      {
            "name": "Dr. Vivek Parashar",
            "school": "",
            "phone": "",
            "room": "A-239"
      },
      {
            "name": "Dr. Kiran Pandey",
            "school": "",
            "phone": "9179948303",
            "room": "A-240"
      },
      {
            "name": "Dr. Siddharth S Chouhan",
            "school": "",
            "phone": "",
            "room": "A-242"
      },
      {
            "name": "Prashant Kumar Pandey",
            "school": "",
            "phone": "8178376418",
            "room": "A-303"
      },
      {
            "name": "Rajneesh Kumar Patel",
            "school": "",
            "phone": "8871235814",
            "room": "A-306"
      },
      {
            "name": "Dr. Sonal Gupta",
            "school": "",
            "phone": "",
            "room": "A-314"
      },
      {
            "name": "Dr. Anjali Mathur",
            "school": "",
            "phone": "9928986023",
            "room": "A-319"
      },
      {
            "name": "Dr. Monika Sankat",
            "school": "",
            "phone": "",
            "room": "B-305"
      },
      {
            "name": "Harshlata Vishwakarma",
            "school": "",
            "phone": "8349780109",
            "room": "B-306"
      },
      {
            "name": "Narottam Das Patel",
            "school": "",
            "phone": "9450095800",
            "room": "B-307"
      },
      {
            "name": "Dr. C. P. Koushik",
            "school": "",
            "phone": "9840403316",
            "room": "B-309"
      },
      {
            "name": "Dr. Ajeet Singh",
            "school": "",
            "phone": "9805075085",
            "room": "B-315"
      },
      {
            "name": "Abdul Rashid",
            "school": "",
            "phone": "8109171886",
            "room": "A-406"
      },
      {
            "name": "Dr. M. Suresh (Asso. Professor)",
            "school": "",
            "phone": "",
            "room": "A-408"
      },
      {
            "name": "Shiv Shankar Prasad Shukla",
            "school": "",
            "phone": "8349390186",
            "room": "A-409"
      },
      {
            "name": "Ajay Kumar Phulre",
            "school": "",
            "phone": "8770450967 9009218023",
            "room": "A-410"
      },
      {
            "name": "M.SURESH nirmala",
            "school": "",
            "phone": "9962212030",
            "room": "A-411"
      },
      {
            "name": "Jitendra Pratap Singh Mathur",
            "school": "",
            "phone": "9893536675",
            "room": "A-413"
      },
      {
            "name": "Dr. Ganeshan G.",
            "school": "",
            "phone": "",
            "room": "A-415"
      },
      {
            "name": "Devraj Vishnu",
            "school": "",
            "phone": "9475451245",
            "room": "B-404"
      },
      {
            "name": "Dr Ankur Jain",
            "school": "",
            "phone": "7415259169",
            "room": "B-405"
      },
      {
            "name": "Sonali Shrivastava",
            "school": "",
            "phone": "9045914940",
            "room": "B-409"
      },
      {
            "name": "Karthick S.",
            "school": "",
            "phone": "9514264651/8103981414",
            "room": "B-414"
      },
      {
            "name": "Dr. Nilesh Kunhare",
            "school": "",
            "phone": "9685251246",
            "room": "C-401"
      },
      {
            "name": "Joshi Abhishek Dilip",
            "school": "",
            "phone": "9421803544",
            "room": "C-402"
      },
      {
            "name": "Adarsh Patel",
            "school": "",
            "phone": "9399414598",
            "room": "C-403"
      },
      {
            "name": "Dr. Gaurav Soni",
            "school": "",
            "phone": "9826018671",
            "room": "C-404"
      },
      {
            "name": "Dr Saravanan S",
            "school": "",
            "phone": "9944059288",
            "room": "A-501"
      },
      {
            "name": "Ankit Pal",
            "school": "",
            "phone": "8586875502",
            "room": "A-502"
      },
      {
            "name": "Dr. Sandeep Sahu",
            "school": "",
            "phone": "9407337972",
            "room": "A-503"
      },
      {
            "name": "Dr. Raghavendra Mishra",
            "school": "",
            "phone": "8085102581",
            "room": "A-504"
      },
      {
            "name": "Arindam Ghosh",
            "school": "",
            "phone": "8328808499",
            "room": "A-505"
      },
      {
            "name": "Dipankar Sutradhar",
            "school": "",
            "phone": "7308126760",
            "room": "A-507"
      },
      {
            "name": "Dr. Jyoti Chauhan",
            "school": "",
            "phone": "8700502598",
            "room": "A-508"
      },
      {
            "name": "Humaira Fatima",
            "school": "",
            "phone": "7455838246/8307962979",
            "room": "A-509"
      },
      {
            "name": "Dr. Anju Shukla",
            "school": "",
            "phone": "9111211104",
            "room": "A-510"
      },
      {
            "name": "Dr. Manoj Kumar",
            "school": "",
            "phone": "8269576451",
            "room": "A-511"
      },
      {
            "name": "Animesh Bhandari",
            "school": "",
            "phone": "8257041061, 9007847469",
            "room": "A-513"
      },
      {
            "name": "Dr. Ravi Verma",
            "school": "",
            "phone": "8770995536",
            "room": "A-514"
      },
      {
            "name": "DR. RUDRA KALYAN NAYAK",
            "school": "",
            "phone": "9861366884",
            "room": "B-501"
      },
      {
            "name": "Dr. Dip Mukherjee",
            "school": "",
            "phone": "",
            "room": "B-502"
      },
      {
            "name": "Dr. Feroz Babu",
            "school": "",
            "phone": "",
            "room": "B-505"
      },
      {
            "name": "Dr. Shiju. E",
            "school": "",
            "phone": "",
            "room": "B-506"
      },
      {
            "name": "Ms. Geeta Singh",
            "school": "",
            "phone": "7680854848",
            "room": "B-507"
      },
      {
            "name": "Dr. S. K. Das",
            "school": "",
            "phone": "",
            "room": "B-508"
      },
      {
            "name": "Usama Khan",
            "school": "",
            "phone": "",
            "room": "B-509"
      },
      {
            "name": "Mr. Vipin Jain",
            "school": "",
            "phone": "",
            "room": "B-510"
      },
      {
            "name": "Dr. Suneet Joshi",
            "school": "",
            "phone": "7748946630",
            "room": "B-512"
      },
      {
            "name": "Dr. Shafiul Alom Ahmed",
            "school": "",
            "phone": "9706931206",
            "room": "B-513"
      },
      {
            "name": "Dr. Ram Kumar",
            "school": "",
            "phone": "9770045634",
            "room": "C-501"
      },
      {
            "name": "Dr. Sultan Alam",
            "school": "",
            "phone": "",
            "room": "C-504"
      },
      {
            "name": "Vijendra Singh Bramhe",
            "school": "",
            "phone": "8954675017",
            "room": "C-505"
      },
      {
            "name": "Ms. Nancy Kumari",
            "school": "",
            "phone": "7011745833",
            "room": "C-508"
      },
      {
            "name": "Dr. Hemraj S.L.",
            "school": "",
            "phone": "7387114521",
            "room": "C-509"
      },
      {
            "name": "Dr. Vinod Kumar Jatav",
            "school": "",
            "phone": "8239074693",
            "room": "C-510"
      },
      {
            "name": "Soma Saha",
            "school": "",
            "phone": "8269896171",
            "room": "C-512"
      },
      {
            "name": "Santosh Kumar Tripathy",
            "school": "",
            "phone": "8658297935",
            "room": "C-513"
      },
      {
            "name": "Mr. Sanat Jain",
            "school": "",
            "phone": "9893979695",
            "room": "C-514"
      },
      {
            "name": "Dr. G. PRABU KANNA",
            "school": "",
            "phone": "9791802829",
            "room": "C-516"
      },
      {
            "name": "Dr. Rajit Nair",
            "school": "",
            "phone": "9907694424, 7000760748",
            "room": "C-522"
      },
      {
            "name": "Dr. NITIN KUMAR MISHRA",
            "school": "",
            "phone": "9826449051",
            "room": "C-523"
      },
      {
            "name": "Deep Chandra Upadhyay",
            "school": "",
            "phone": "9119935285",
            "room": "C-524"
      },
      {
            "name": "Dr. Ashish Mohan Yadav",
            "school": "",
            "phone": "7999836793",
            "room": "C-527"
      },
      {
            "name": "Ashok Kumar Baral",
            "school": "",
            "phone": "9861999643",
            "room": "C-531"
      },
      {
            "name": "Dr. KR. SIVABALAN",
            "school": "",
            "phone": "9698766754",
            "room": "C-532"
      },
      {
            "name": "Garima Jain",
            "school": "",
            "phone": "9302920647",
            "room": "C-534"
      },
      {
            "name": "Udai Kumar",
            "school": "",
            "phone": "7651914458",
            "room": "C-537"
      },
      {
            "name": "Shilpa Suman",
            "school": "",
            "phone": "9693750319",
            "room": "C-538"
      },
      {
            "name": "PRATOSH KUMAR PAL",
            "school": "",
            "phone": "8989806880",
            "room": "C-539"
      },
      {
            "name": "Prasad Begde",
            "school": "",
            "phone": "8225048609",
            "room": "C-540"
      },
      {
            "name": "Dr. J. George Chellin Chandran",
            "school": "",
            "phone": "9384174987",
            "room": "AB-011"
      },
      {
            "name": "Dr. PRADYUMNA YADAV",
            "school": "",
            "phone": "8109961099/7024111639",
            "room": "AB-019 (A)"
      },
      {
            "name": "Mr. ANIL MEWADA (Secy. of Registrar)",
            "school": "",
            "phone": "9131094751",
            "room": "AB-019 (L)"
      },
      {
            "name": "Dr. S. Ananthakumaran",
            "school": "",
            "phone": "9842221962",
            "room": "PAT OFFICE"
      },
      {
            "name": "R.Sukumar",
            "school": "",
            "phone": "9962029293",
            "room": "PAT OFFICE"
      },
      {
            "name": "Rajendra Mahanandia",
            "school": "",
            "phone": "9438659192",
            "room": "PAT OFFICE"
      },
      {
            "name": "Dr. Abha Gupta",
            "school": "",
            "phone": "",
            "room": "AB-306"
      },
      {
            "name": "Dr. Juhi Kesarwani",
            "school": "",
            "phone": "",
            "room": "AB-306"
      },
      {
            "name": "Mr. RAVI KUMAR SINGH",
            "school": "",
            "phone": "",
            "room": "AB-310"
      },
      {
            "name": "Priyanka Mishra",
            "school": "",
            "phone": "9140871509",
            "room": "AB-406"
      },
      {
            "name": "Dr S.VAIRACHILAI",
            "school": "",
            "phone": "8106813402",
            "room": "AB-406"
      },
      {
            "name": "Dr Kamlesh Chandravanshi",
            "school": "",
            "phone": "9009217763",
            "room": "AB-410"
      },
      {
            "name": "Mr. Vikas Kumar Jain",
            "school": "",
            "phone": "9981008680",
            "room": "AB-506"
      },
      {
            "name": "Mr. Narendra Kumar",
            "school": "",
            "phone": "8968945650",
            "room": "AB-506"
      },
      {
            "name": "Dr. Anil Kumar Yadav",
            "school": "",
            "phone": "9479499566",
            "room": "AB-510"
      },
      {
            "name": "M.R. Thiyagu Priyadharsan",
            "school": "",
            "phone": "9994115629",
            "room": "AB-510"
      },
      {
            "name": "Dr. Sumit Som",
            "school": "",
            "phone": "",
            "room": "LIBRARY"
      },
      {
            "name": "Dr. Sanjay Pan",
            "school": "",
            "phone": "",
            "room": "LIBRARY"
      },
      {
            "name": "Dr. Sanjeev Nayak",
            "school": "",
            "phone": "",
            "room": "LIBRARY"
      },
      {
            "name": "Dr. Shweta Singh",
            "school": "",
            "phone": "",
            "room": "LIBRARY"
      },
      {
            "name": "Dr. Ravindra Prasad",
            "school": "",
            "phone": "",
            "room": "LIBRARY"
      },
      {
            "name": "Dr. Saurabh kumar morya",
            "school": "",
            "phone": "9532437348",
            "room": "LIBRARY"
      },
      {
            "name": "Dr. P.V.N. Kishor",
            "school": "",
            "phone": "9553773590",
            "room": "LIBRARY"
      },
      {
            "name": "Dr. Kashinath",
            "school": "SCSE",
            "phone": "9730951876",
            "room": ""
      },
      {
            "name": "Dr. Santosh Kumar Bahl",
            "school": "SASL",
            "phone": "9373410389",
            "room": ""
      },
      {
            "name": "Dr. Dipanjana Hazra",
            "school": "SASL",
            "phone": "9340355344",
            "room": ""
      },
      {
            "name": "Dr. Kiran Kumar Behra",
            "school": "SASL",
            "phone": "8267808230",
            "room": ""
      },
      {
            "name": "Dr. Gounder Thangamani Jayaram",
            "school": "SASL",
            "phone": "8110019705",
            "room": ""
      },
      {
            "name": "Dr. Hemanta Kalita",
            "school": "SASL",
            "phone": "8811039996",
            "room": ""
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
    return matchesName || matchesSchool || matchesRoom || matchesPhone;
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
