export const getCurrentTime = () => {
  let ISToffSet = 330; //IST is 5:30; i.e. 60*5+30 = 330 in minutes
  let offset = ISToffSet * 60 * 1000;
  let ISTTime = new Date(Date.now() + offset);
  return ISTTime;
}