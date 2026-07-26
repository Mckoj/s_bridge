const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, '../../prisma/data/MOCK_DATA.json');
const outputDir = path.join(__dirname, '../../prisma/data');

if (!fs.existsSync(mockDataPath)) {
  console.error(`Mock data file not found at: ${mockDataPath}`);
  process.exit(1);
}

let mockData;
try {
  mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf-8'));
} catch (e) {
  console.error('Failed to parse JSON file:', e);
  process.exit(1);
}

const cleanStudents = [];
const cleanCompanies = [];
const cleanInternships = [];
const cleanApplications = [];
const cleanReports = [];

const PROGRAMMES = ['Computer Science', 'Software Engineering', 'Information Technology', 'Data Science', 'Computer Engineering'];
const INDUSTRIES = ['Technology', 'Financial Services', 'Healthcare', 'E-Commerce', 'Cybersecurity', 'Telecommunications'];
const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];
const JOB_TITLES = [
  { title: 'Software Engineer Intern', target: 'Computer Science, Software Engineering' },
  { title: 'Frontend Developer Intern', target: 'Computer Science, Information Technology' },
  { title: 'Backend Developer Intern', target: 'Software Engineering, Computer Engineering' },
  { title: 'Data Analyst Intern', target: 'Data Science, Statistics' },
  { title: 'UI/UX Design Intern', target: 'Information Technology, Multimedia Design' },
  { title: 'DevOps Engineer Intern', target: 'Computer Engineering, Software Engineering' }
];
const TYPES = ['REMOTE', 'HYBRID', 'ON_SITE'];
const DURATIONS = ['3 Months', '6 Months'];
const LISTING_STATUSES = ['OPEN', 'CLOSED'];
const APP_STATUSES = ['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];
const REPORT_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Keep track of used identifiers to ensure uniqueness
const usedStudentIds = new Set();
const usedIndexNumbers = new Set();

function generateUniqueStudentId() {
  let id;
  do {
    id = `ST-${10000 + Math.floor(Math.random() * 90000)}`;
  } while (usedStudentIds.has(id));
  usedStudentIds.add(id);
  return id;
}

function generateUniqueIndexNumber() {
  let index;
  do {
    index = `IDX-${10000 + Math.floor(Math.random() * 90000)}`;
  } while (usedIndexNumbers.has(index));
  usedIndexNumbers.add(index);
  return index;
}

mockData.forEach((row, i) => {
  const index = i + 1;

  // 1. Student
  const sId = generateUniqueStudentId();
  const indexNum = generateUniqueIndexNumber();
  cleanStudents.push({
    id: `student-uuid-${index}`,
    firstName: row['Student Profile: firstName'] || 'First',
    lastName: row['Student Profile: lastName'] || 'Last',
    studentId: sId,
    indexNumber: indexNum,
    phone: row['Student Profile: phone'] || '+1-555-0199',
    gpa: typeof row['Student Profile: gpa'] === 'number' ? row['Student Profile: gpa'] : 3.0,
    programme: randomElement(PROGRAMMES),
    experience: (row['Student Profile: experience'] && !row['Student Profile: experience'].includes('error:'))
      ? row['Student Profile: experience']
      : 'Eager to learn and contribute as an intern in software development.',
    cvUrl: row['Student Profile: cvUrl'] || `https://s-bridge-storage.s3.amazonaws.com/cvs/${sId}.pdf`,
    profilePicUrl: row['Student Profile: profilePicUrl'] || `https://robohash.org/${sId}.png?size=50x50&set=set1`
  });

  // 2. Company & Recruiter
  const cleanCompanyName = row['Company Profile: companyName'] || `Company_${index}`;
  const cleanDomain = cleanCompanyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  cleanCompanies.push({
    id: `company-uuid-${index}`,
    companyName: cleanCompanyName,
    industry: randomElement(INDUSTRIES),
    website: row['Company Profile: website'] && !row['Company Profile: website'].includes('error:') 
      ? row['Company Profile: website'] 
      : `https://www.${cleanDomain}`,
    size: randomElement(SIZES),
    address: row['Company Profile: address'] || '123 Tech Lane',
    logoUrl: row['Company Profile: logoUrl'] || 'http://dummyimage.com/200x100.png/dddddd/000000',
    description: `Leading organization specializing in innovative services.`,
    
    // Associated Recruiter fields
    recruiterId: `recruiter-uuid-${index}`,
    recruiterEmail: `recruiter_${index}@${cleanDomain}`,
    position: 'HR Recruiter'
  });

  // 3. Internship
  const job = randomElement(JOB_TITLES);
  cleanInternships.push({
    id: `internship-uuid-${index}`,
    recruiterId: `recruiter-uuid-${index}`,
    title: job.title,
    description: (row['Internship Listings: description'] && !row['Internship Listings: description'].includes('error:'))
      ? row['Internship Listings: description']
      : 'Exciting internship position to work on core engineering projects under senior mentorship.',
    location: row['Internship Listings: location'] || 'Remote',
    internshipType: randomElement(TYPES),
    salary: typeof row['Internship Listings: salary'] === 'number' ? Math.round(row['Internship Listings: salary']) : 1500,
    duration: randomElement(DURATIONS),
    status: randomElement(LISTING_STATUSES),
    targetProgrammes: job.target
  });

  // 4. Application
  cleanApplications.push({
    id: `application-uuid-${index}`,
    studentId: `student-uuid-${index}`,
    internshipId: `internship-uuid-${index}`,
    coverLetter: row['Applications: coverLetter'] || 'I am excited to apply for this internship opportunity.',
    resumeUrl: row['Applications: resumeUrl'] || `https://s-bridge-storage.s3.amazonaws.com/resumes/res_${index}.pdf`,
    matchScore: typeof row['Applications: matchScore'] === 'number' ? row['Applications: matchScore'] : 50.0,
    status: randomElement(APP_STATUSES)
  });

  // 5. Weekly Report
  const weekNum = Math.floor(Math.random() * 12) + 1;
  cleanReports.push({
    id: `report-uuid-${index}`,
    studentId: `student-uuid-${index}`,
    internshipId: `internship-uuid-${index}`,
    title: `Week ${weekNum} Progress Report`,
    fileUrl: row['Weekly Reports: fileUrl'] && !row['Weekly Reports: fileUrl'].includes('error:')
      ? row['Weekly Reports: fileUrl']
      : `https://s-bridge-storage.s3.amazonaws.com/reports/rep_${index}.pdf`,
    status: randomElement(REPORT_STATUSES),
    comment: row['Weekly Reports: comment'] || 'Submitted on time. Met all weekly milestones.'
  });
});

fs.writeFileSync(path.join(outputDir, 'students_clean.json'), JSON.stringify(cleanStudents, null, 2));
fs.writeFileSync(path.join(outputDir, 'companies_clean.json'), JSON.stringify(cleanCompanies, null, 2));
fs.writeFileSync(path.join(outputDir, 'internships_clean.json'), JSON.stringify(cleanInternships, null, 2));
fs.writeFileSync(path.join(outputDir, 'applications_clean.json'), JSON.stringify(cleanApplications, null, 2));
fs.writeFileSync(path.join(outputDir, 'reports_clean.json'), JSON.stringify(cleanReports, null, 2));

console.log('Mock data successfully cleaned and split into separate tables!');
