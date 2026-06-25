# TODO - Mandatory Job Creation Validations

- [ ] Inspect current Job creation form in `src/features/jobs/JobsPage.tsx` to identify existing fields and submission behavior.
- [ ] Extend the form state (`JobForm`) with mandatory fields: Job Category, Work Mode, Experience Required, Salary Range, Key Responsibilities, Required Skills, Educational Qualifications, Number of Openings, Application Deadline.
- [ ] Add real-time validation for each mandatory field with clear inline error messages.
- [ ] Add pre-submission validation guard in `createJob` (never submit if invalid).
- [ ] Disable submit button until mandatory fields are satisfied.
- [ ] Add lightweight field-level guidance/tooltips under inputs.
- [ ] Update/adjust mismatch + JD quality widgets to incorporate new required fields if needed.
- [ ] Run `npm run lint` and `npm run dev` to verify no TypeScript/ESLint errors.

