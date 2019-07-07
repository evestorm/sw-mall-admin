
/**
 * 判断值是否为空
 * @export
 * @param {*} value
 * @return {boolean} 返回 true or false
 */
export function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  )
}

/**
 * 格式化时间
 * @param {date} 时间对象
 * @return {string} 格式化字符串 2019/07/03 04:31:35
 */
export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * UTC转GMT+8
 * @param {string} time
 * @return {string} date
 */
export function eosFormatTime(time) {
  const dt = new Date(time)
  const date = [
    [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join('-'),
    [dt.getHours(), dt.getMinutes(), dt.getSeconds()].join(':')
  ].join(' ').replace(/(?=\b\d\b)/g, '0')
  return date
  // 👇GMT转UTC👇
  // new Date("2019-06-27 00:00:00").toISOString()
  // log 2019-06-26T16:00:00.000Z
}
