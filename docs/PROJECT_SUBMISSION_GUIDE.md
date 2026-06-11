# Project Submission Guide

## Workflow

1. Select Batch.
2. Select Semester.
3. Enter Project Details.
4. Add Guide Information.
5. Add Faculty Information when available.
6. Submit Project.

## Batch And Semester

Students select visible academic values. The platform stores repository folder values automatically.

```text
Batch:
2027

Automatically stored as:
batch-2027

Semester:
Semester 6

Automatically stored as:
semester-6
```

Do not manually create batch or semester folder names.

## Required Metadata

- Project title.
- Batch.
- Semester.
- Student information.
- Guide name.
- GitHub repository link.
- Project description.
- Tools used.
- Technologies used.
- Sources or references used.

## Guide Information

```text
Guide Name: Dr. John Mathew
Designation: Assistant Professor
Department: Electrical & Electronics Engineering (EEE)
```

The department value is stored internally and is not typed by the student.

## Faculty Information

```text
Faculty Name: Jane Thomas
Designation: Assistant Professor
Department: Electrical & Electronics Engineering (EEE)
```

Faculty information is optional. The faculty department value is stored internally when faculty metadata is included.

## Validation

- Empty required submissions are blocked.
- GitHub repository links must use a valid `github.com/{owner}/{repo}` URL.
- Team number must be `team-01` through `team-100`.
- Project title and subject are converted into repository-safe folder names.
- Unsafe uploaded filenames and executable/private-key extensions are blocked.
