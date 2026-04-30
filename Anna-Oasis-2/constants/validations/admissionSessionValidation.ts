import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  from: Yup.string().required('Required'),
  to: Yup.string()
    .required('Required')
    .test(
      'is-after-from',
      'To date must be after or equal to from date',
      function(value) {
        const { from } = this.parent;
        if (!value || !from) return true;
        return new Date(value) >= new Date(from);
      }
    ),
  semesters: Yup.array()
    .of(Yup.string().matches(/^[1-8]$/))
    .min(1, 'Select at least one semester')
    .required('Required'),
  academic_year: Yup.string()
    .required('Required')
    .matches(/^\d{4}-\d{4}$/, 'Format must be YYYY-YYYY')
    .test(
      'is-consecutive-years',
      'Second year must be next after first year',
      value => {
        if (!value) return false;
        const [start, end] = value.split('-').map(Number);
        return end === start + 1;
      }
    ),
})

export const initialValues = {
  from: '',
  to: '',
  semesters: [],
  academic_year: '',
}