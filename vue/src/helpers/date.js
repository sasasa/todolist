export const oneWeekLater = () => {
  const date = new Date()

  var dateGoal = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  dateGoal.setDate(dateGoal.getDate() + 7);

  return yyyymmdd(dateGoal)
}

export const oneWeekBefore = () => {
  const date = new Date()

  var dateGoal = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  dateGoal.setDate(dateGoal.getDate() - 7);

  return yyyymmdd(dateGoal)
}

const yyyymmdd = (date) => {
  const yyyy = date.getFullYear()
  const mm = ("0" + (date.getMonth() + 1)).slice(-2)
  const dd = ("0" + (date.getDate())).slice(-2)
  return `${yyyy}-${mm}-${dd}`
}

export const now = () => {
  return yyyymmdd(new Date())
}
