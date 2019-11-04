import pdfjsLib from 'pdfjs-dist/webpack'
// import R from 'ramda'

const url = 'https://cdn.glitch.com/6be5b6e9-3e78-4f26-91f9-ac968b43d306%2FCARE%20Program%20Confirmation%20Sheet%2010.11.pdf'

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


const validAddress = (address) => /\d{5}$/.test(address)

const getTextItemContent = (textItems) => textItems.map((textItem) => textItem.str.trim())

const { promise: pdf } = pdfjsLib.getDocument(url)
pdf
  .then((doc) => Promise.all(
    Array(doc.numPages).fill().map((_, i) => doc.getPage(i + 1)),
  ))
  .then((pages) => Promise.all(pages.map((page) => page.getTextContent())))
  .then((contentArr) => contentArr.map(({ items }) => items))
  .then((textItemArrArr) => textItemArrArr.map(getTextItemContent).flat()
    .filter(validAddress))
  .then(tap(console.log))

// .then(tap((textItemArr) => fs.writeFileSync('care-10-11.json', JSON.stringify(textItemArr))))

  .catch((e) => console.error('ERROR!!', e))
