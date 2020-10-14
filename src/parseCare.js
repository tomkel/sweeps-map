import pdfjsLib from 'pdfjs-dist/webpack'
import * as R from 'ramda'

const tap = (fn) => (arg) => {
  fn(arg)
  return arg
}

/*
 type textItem {
  str: string;
  transform: array;
}
x = item.transform[4]
y = item.transform[5]
0,0 is at bottom left corner

type myTextItem {
  str: string;
  x: number;
  y: number;
}

type viewport {
  viewbox: [0, 0, width, height]
}
*/


const hasLowercase = (address) => /[a-z]/.test(address)
const validAddress = (address) => /[A-Z](.*)?\d{5}/.test(address)

const getTextItemContent = (textItems) => textItems.map((textItem) => textItem.str.trim())

function parse(url) {
  const { promise: pdf } = pdfjsLib.getDocument(url)

  pdf.then((doc) => { window.doc = doc })

  pdf
    .then((doc) => Promise.all(
      Array(doc.numPages).fill().map((_, i) => doc.getPage(i + 1)),
    ))
    .then((pages) => Promise.all(pages.map((page) => page.getTextContent())))
    .then((contentArr) => contentArr.map(({ items }) => items))
    .then((textItemArrArr) => textItemArrArr.flatMap(getTextItemContent)
      .map(tap(console.log))
      .filter(R.complement(hasLowercase))
      .filter(validAddress))
    .then(tap(console.log))
    .catch((e) => console.error('ERROR!!', e))
}

export default parse
