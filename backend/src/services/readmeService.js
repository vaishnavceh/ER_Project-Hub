function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function optionalLink(label, value) {
  return value ? `- ${label}: ${value}` : `- ${label}: Not provided`;
}

export function generateProjectReadme(data, { hasReportPdf }) {
  const projectTitle = titleFromSlug(data.projectName);

  return `# ${projectTitle}

## Team Members
${data.teamMembers}

## Project Details
- Batch: ${data.batch}
- Semester: ${data.semester}
- Subject: ${data.subject}
- Project type: ${data.projectType}
- Team folder: ${data.teamNumber}-${data.projectName}

## Project Description
${data.projectDescription}

## Problem Statement
Add the problem statement for this project.

## Tools Used for Creation
${data.toolsUsed}

## Technologies Used
${data.technologiesUsed}

## Sources or References Used
${data.sourcesUsed}

## Project Files
Uploaded project files are stored in the \`project-files/\` folder.

## Installation or Setup Instructions
Add setup instructions for this project.

## Steps to Run or Test
Add steps to run, simulate, build, or test this project.

## Screenshots, Photos, or Demo Output
Add screenshots, hardware photos, demo output, or simulation results if available.

## Project Report
- Report PDF uploaded: ${hasReportPdf ? "Yes, see `reports/project-report.pdf`." : "No PDF report uploaded."}
${optionalLink("Google Drive report link", data.googleDriveReportLink)}

## Working Video
${optionalLink("Working video link", data.workingVideoLink)}

## Presentation Details
Add presentation details if available.

## Future Improvements
Add future improvements if any.
`;
}

export function generateReportLinkMarkdown(data) {
  return `# Project Report Link

The project report is stored externally because it may be too large for this repository.

- Project: ${titleFromSlug(data.projectName)}
- Team: ${data.teamNumber}
- Report link: ${data.googleDriveReportLink}
`;
}

export function generateFolderIndexReadmes(data) {
  const batchPath = `batches/${data.batch}`;
  const semesterPath = `${batchPath}/${data.semester}`;
  const subjectPath = `${semesterPath}/${data.subject}`;

  return [
    {
      path: "batches/README.md",
      content: `# Batches

Student team projects are organized by batch, semester, subject, and team project folder.

Folder format:

\`\`\`text
batches/{batch}/{semester}/{subject}/{team-number}-{project-name}/
\`\`\`
`
    },
    {
      path: `${batchPath}/README.md`,
      content: `# ${data.batch}

Projects for ${data.batch}.

Next level: semester folders.
`
    },
    {
      path: `${semesterPath}/README.md`,
      content: `# ${data.semester}

Projects for ${data.batch}, ${data.semester}.

Next level: subject folders.
`
    },
    {
      path: `${subjectPath}/README.md`,
      content: `# ${data.subject}

Team projects for ${data.batch}, ${data.semester}, ${data.subject}.

Next level: team project folders.
`
    }
  ];
}

export function generatePullRequestBody(data, { hasReportPdf }) {
  return `## Project Upload Summary

- Batch: ${data.batch}
- Semester: ${data.semester}
- Subject: ${data.subject}
- Team: ${data.teamNumber}
- Project title: ${titleFromSlug(data.projectName)}
- Tools used: ${data.toolsUsed}
- Technologies used: ${data.technologiesUsed}
- Sources/references used: ${data.sourcesUsed}
- Report PDF uploaded: ${hasReportPdf ? "yes" : "no"}
- Google Drive report link: ${data.googleDriveReportLink ? "yes" : "no"}
- Working video link: ${data.workingVideoLink ? "yes" : "no"}
- Confirmation: The submitter confirmed that no passwords, API keys, tokens, or private data were intentionally uploaded.

Maintainers should review the generated README and uploaded files before merging.
`;
}

export function pullRequestTitle(data) {
  return `Add project: ${data.teamNumber}-${data.projectName} - ${data.batch} ${data.semester} ${data.subject}`;
}
