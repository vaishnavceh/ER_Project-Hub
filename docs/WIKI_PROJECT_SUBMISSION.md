# Wiki: Project Submission

## Submission Page

The Upload Project page collects student project metadata, files, report links, and academic attribution. Students do not need Git commands or repository folder naming knowledge.

## Batch Dropdown

The batch field is a searchable dropdown. A student selects a visible year such as `2027`. The backend stores the repository value as `batch-2027`.

## Semester Dropdown

The semester field is a searchable dropdown with Semester 1 through Semester 8. A student selects `Semester 6`. The backend stores the repository value as `semester-6`.

## Guide Information

Guide name is required. Guide designation is optional.

```text
Guide Name: Dr. John Mathew
Department: Electrical & Electronics Engineering (EEE)
```

The guide department is auto-filled internally.

## Faculty Information

Faculty name and faculty designation are optional.

```text
Faculty Name: Jane Thomas
Department: Electrical & Electronics Engineering (EEE)
```

The faculty department is auto-filled internally.

## Validation Behavior

- Blocks missing project title, batch, semester, student information, guide name, GitHub repository link, and required project metadata.
- Validates GitHub repository URLs.
- Converts batch, semester, subject, and project title into standardized repository path values.
- Rejects malformed team numbers and unsafe upload filenames.
- Keeps department storage future-ready by using the `eee` department id with the resolved department name.

## Repository Structure

```text
batches/
  batch-2027/
    semester-1/
    semester-2/
    semester-3/
    semester-4/
    semester-5/
    semester-6/
      dbms/
        team-01-library-management/
    semester-7/
    semester-8/
```
