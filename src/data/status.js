// "Currently building" badge content, rendered in the Footer signoff.
// active is false until a real projectName is set — flip both at once,
// no other code needs to change. Keep it to one project at a time; this
// is meant to be a small, personal detail, not a running project log.
const status = {
  active: false,
  projectName: '',
};

export default status;
