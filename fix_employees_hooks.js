const fs = require('fs');
const path = require('path');

const replacements = [
  {
    file: 'src/hooks/employees/useGetSupervisorEmployee.ts',
    replaces: [
      {
        from: /catch \(err: any\) \{\s*setError\(err\.message \|\| "Failed to load supervisor"\);/g,
        to: `catch (err: unknown) {\n        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load supervisor");`
      }
    ]
  },
  {
    file: 'src/hooks/employees/useGetParentForEmployee.ts',
    replaces: [
      {
        from: /catch \(err: any\) \{\s*setError\(err\.message \|\| "Failed to load parent hierarchy"\);/g,
        to: `catch (err: unknown) {\n        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load parent hierarchy");`
      }
    ]
  },
  {
    file: 'src/hooks/employees/useGetEmployeeDetailsByUserId.ts',
    replaces: [
      {
        from: /catch \(err: any\) \{\s*setError\(err\.message \|\| "Failed to load employee details"\);/g,
        to: `catch (err: unknown) {\n        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load employee details");`
      }
    ]
  },
  {
    file: 'src/hooks/employees/useGetEmployeeBySubUnit.ts',
    replaces: [
      {
        from: /catch \(err: any\) \{\s*setError\(err\.message \|\| "Failed to load employees for sub-unit"\);/g,
        to: `catch (err: unknown) {\n        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load employees for sub-unit");`
      }
    ]
  },
  {
    file: 'src/hooks/employees/useGetEmployeeById.ts',
    replaces: [
      {
        from: /catch \(err: any\) \{\s*setError\(err\.message \|\| "Failed to load employee details"\);/g,
        to: `catch (err: unknown) {\n        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load employee details");`
      }
    ]
  },
  {
    file: 'src/hooks/employees/useGetDirectorBySubUnit.ts',
    replaces: [
      {
        from: /catch \(err: any\) \{\s*setError\(err\.message \|\| "Failed to load director for sub-unit"\);/g,
        to: `catch (err: unknown) {\n        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load director for sub-unit");`
      }
    ]
  },
  {
    file: 'src/hooks/employees/useGetAllEmployees.ts',
    replaces: [
      {
        from: /catch \(err: any\) \{\s*setError\(err\.message \|\| "Failed to load employees"\);/g,
        to: `catch (err: unknown) {\n        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load employees");`
      }
    ]
  },
  {
    file: 'src/hooks/employees/useEmployees.ts',
    replaces: [
      {
        from: /const params: any = \{/g,
        to: `const params: Record<string, string | number> = {`
      },
      {
        from: /catch \(err: any\) \{\s*setError\(err\.message \|\| "Failed to load employees"\);/g,
        to: `catch (err: unknown) {\n        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load employees");`
      }
    ]
  },
  {
    file: 'src/hooks/employees/useCreateUserAccount.ts',
    replaces: [
      {
        from: /payload: any\)/g,
        to: `payload: Record<string, unknown>)`
      },
      {
        from: /catch \(err: any\) \{\s*const errorMessage =\s*err\.response\?\.data\?\.message \|\| err\.message \|\| "Failed to create user account";/g,
        to: `catch (err: unknown) {\n      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n      const errorMessage =\n        errorObj.response?.data?.message || errorObj.message || "Failed to create user account";`
      }
    ]
  },
  {
    file: 'src/hooks/employees/useAddEmployee.ts',
    replaces: [
      {
        from: /catch \(error: any\) \{\s*const errMsg = error\.response\?\.data\?\.message \|\| "Failed to add employee";/g,
        to: `catch (err: unknown) {\n      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n      const errMsg = errorObj.response?.data?.message || errorObj.message || "Failed to add employee";`
      }
    ]
  },
  {
    file: 'src/hooks/employees/sub-units/useUpdateSubUnit.ts',
    replaces: [
      {
        from: /catch \(error: any\) \{\s*const errMsg =\s*error\.response\?\.data\?\.message \|\| "Failed to update sub-unit";/g,
        to: `catch (err: unknown) {\n      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n      const errMsg =\n        errorObj.response?.data?.message || errorObj.message || "Failed to update sub-unit";`
      }
    ]
  },
  {
    file: 'src/hooks/employees/sub-units/useSubUnits.ts',
    replaces: [
      {
        from: /catch \(err: any\) \{\s*setError\(err\.message \|\| "Failed to load sub-units"\);/g,
        to: `catch (err: unknown) {\n        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load sub-units");`
      }
    ]
  },
  {
    file: 'src/hooks/employees/sub-units/useGetSubUnitById.ts',
    replaces: [
      {
        from: /catch \(err: any\) \{\s*setError\(err\.message \|\| "Failed to load sub-unit"\);/g,
        to: `catch (err: unknown) {\n        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load sub-unit");`
      }
    ]
  },
  {
    file: 'src/hooks/employees/sub-units/useDeleteSubUnitById.ts',
    replaces: [
      {
        from: /catch \(error: any\) \{\s*const errMsg =\s*error\.response\?\.data\?\.message \|\| "Failed to delete sub-unit";/g,
        to: `catch (err: unknown) {\n      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n      const errMsg =\n        errorObj.response?.data?.message || errorObj.message || "Failed to delete sub-unit";`
      }
    ]
  },
  {
    file: 'src/hooks/employees/sub-units/useAddSubUnit.ts',
    replaces: [
      {
        from: /catch \(error: any\) \{\s*const errMsg = error\.response\?\.data\?\.message \|\| "Failed to add sub-unit";/g,
        to: `catch (err: unknown) {\n      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n      const errMsg = errorObj.response?.data?.message || errorObj.message || "Failed to add sub-unit";`
      }
    ]
  },
  {
    file: 'src/hooks/employees/job-titles/useJobTitles.ts',
    replaces: [
      {
        from: /catch \(err: any\) \{\s*setError\(err\.message \|\| "Failed to load job titles"\);/g,
        to: `catch (err: unknown) {\n        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load job titles");`
      }
    ]
  },
  {
    file: 'src/hooks/employees/job-titles/useGetJobTitleById.ts',
    replaces: [
      {
        from: /catch \(err: any\) \{\s*setError\(err\.message \|\| "Failed to load job title"\);/g,
        to: `catch (err: unknown) {\n        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load job title");`
      }
    ]
  },
  {
    file: 'src/hooks/employees/job-titles/useDeleteJobTitleById.ts',
    replaces: [
      {
        from: /const \[result, setResult\] = useState\<any\>\(null\);/g,
        to: `const [result, setResult] = useState<unknown>(null);`
      },
      {
        from: /catch \(err: any\) \{\s*const message =\s*err\.response\?\.data\?\.message \|\| "Failed to delete job title";/g,
        to: `catch (err: unknown) {\n      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n      const message =\n        errorObj.response?.data?.message || errorObj.message || "Failed to delete job title";`
      }
    ]
  },
  {
    file: 'src/hooks/employees/job-titles/useAddJobTitle.ts',
    replaces: [
      {
        from: /catch \(error: any\) \{\s*const errMsg = error\.response\?\.data\?\.message \|\| "Failed to add job title";/g,
        to: `catch (err: unknown) {\n      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n      const errMsg = errorObj.response?.data?.message || errorObj.message || "Failed to add job title";`
      }
    ]
  },
  {
    file: 'src/hooks/employees/employee-statuses/useGetEmployeeStatus.ts',
    replaces: [
      {
        from: /catch \(err: any\) \{\s*setError\(err\.message \|\| "Failed to load employee statuses"\);/g,
        to: `catch (err: unknown) {\n        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };\n        setError(errorObj.response?.data?.message || errorObj.message || "Failed to load employee statuses");`
      }
    ]
  }
];

let totalFixed = 0;

for (const req of replacements) {
  const filePath = path.join(process.cwd(), req.file);
  if (!fs.existsSync(filePath)) {
    console.log("File not found: " + filePath);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const rep of req.replaces) {
    content = content.replace(rep.from, rep.to);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Fixed: " + req.file);
    totalFixed++;
  } else {
    console.log("No changes made in: " + req.file);
  }
}

console.log("Total files fixed: " + totalFixed);
