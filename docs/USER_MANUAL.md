# User Manual

## Upload Project

Use the Upload Project page to submit a team project. The page creates the correct repository path automatically after the form is submitted.

## Form Sections

### Academic Placement

- Select Batch from the dropdown.
- Select Semester from the dropdown.
- Enter the subject or course area.
- Enter the team number.
- Enter the project title.
- Add the GitHub repository link.

Example:

```text
Batch: 2027
Stored as: batch-2027

Semester: Semester 6
Stored as: semester-6
```

### Academic Supervision

- Guide Name is required.
- Guide Designation is optional.
- Faculty Name is optional.
- Faculty Designation is optional.

The department is stored automatically:

```text
Electrical & Electronics Engineering (EEE)
```

### Project Details

Add student information, project description, problem statement when available, tools used, technologies used, and sources or references.

### Files And Links

Upload at least one project file. The project report PDF is optional. Use Google Drive or working video links for large supporting material.

## Validation Examples

- Missing project title: `Project title is required.`
- Missing batch: `Select a valid batch.`
- Missing semester: `Select a valid semester.`
- Missing guide name: `Guide name is required.`
- Invalid GitHub URL: `Enter a valid GitHub repository URL, for example https://github.com/owner/project.`
- Missing files: `Please upload at least one project file.`

## After Submission

The platform creates an upload branch, opens a pull request, and shows the GitHub project path. If the pull request is accepted, the project appears in the repository browser after the workflow completes.
