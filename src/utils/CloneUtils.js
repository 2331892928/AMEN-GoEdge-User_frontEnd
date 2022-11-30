/**
 * 深拷贝
 * @param obj
 * @returns {[]|{}}
 */

function deepClone (obj) {
  if (obj === null) {
    return
  }
  const newObj = obj.push ? [] : {} // 如果obj有push方法则 定义newObj为数组，否则为对象。
  for (const attr in obj) {
    if (typeof obj[attr] === 'object') {
      newObj[attr] = deepClone(obj[attr])
    } else {
      newObj[attr] = obj[attr]
    }
  }
  return newObj
}

// 获取对象的第一个元素
export function getFirst (obj) {
  for (const key in obj) {
    return obj[key]
  }
}
const isBase64 = (str) => {
  if (!str) return false
  var base64Str = /^([A-Za-z0-9\s+/]{4})*([A-Za-z0-9\s+/]{4}|[A-Za-z0-9\s+/]{3}=|[A-Za-z0-9\s+/]{2}==)$/
  return base64Str.test(str)
}
export const utf8to16 = (str) => {
  var out, i, len, c
  var char2, char3
  out = ''
  len = str.length
  i = 0
  while (i < len) {
    c = str.charCodeAt(i++)
    // console.log(c, c >> 4)
    switch (c >> 4) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1)
        break
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = str.charCodeAt(i++)
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
        break
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = str.charCodeAt(i++)
        char3 = str.charCodeAt(i++)
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0))
        break
    }
  }
  return out
}

export const utf16to8 = (str) => {
  var out, i, len, c
  out = ''
  len = str.length
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i)
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    }
  }
  return out
}
// 由于+转空格所以包一下encodeURIComponent
export const encodeUTF8 = (str) => {
  if (!str) return ''
  try {
    // 判断是不是base64格式，是的话直接返回，不是的话转成base64返回
    const decodeURIComponentStr = decodeURIComponent(str)
    if (isBase64(decodeURIComponentStr)) return encodeURIComponent(decodeURIComponentStr)
    else return encodeURIComponent(window.btoa(utf16to8(str)))
  } catch (error) {
    // console.log('catch error return', encodeURIComponent(window.btoa(utf16to8(str))))
    return encodeURIComponent(window.btoa(utf16to8(str)))
  }
}
// 读取文本文件内容
export async function readFile(file) {
  const reader = new FileReader()
  const promise = new Promise((resolve, reject) => {
    reader.onload = function () {
      resolve(reader.result)
    }
    reader.onerror = function (e) {
      reader.abort()
      reject(e)
    }
  })
  reader.readAsText(file, 'UTF-8') // 将文件读取为文本

  return promise
}

export default deepClone
