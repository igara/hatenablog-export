import * as fs from "fs";
import * as jsSHA from "jssha";
import * as puppeteer from "puppeteer";
import * as request from "request-promise";

type Entry = {
  blogID: string;
  title: string;
  url: string;
  createAt: string;
};

const directoryName = (entry: Entry) => `${entry.blogID}/${entry.createAt}-${entry.title.replace(/\//g, "／")}`;

export const mkdir = (entry: Entry) => {
  fs.mkdirSync(`./data/${directoryName(entry)}`, { recursive: true });
};

const getEntryLink = async (page: puppeteer.Page, blogID: string) =>
  await page.evaluate((blogID: string) => {
    const list = Array.from(document.querySelectorAll(".archive-entry-header"));
    return list.map((l) => {
      const link = l.querySelector(".entry-title-link");
      const url = link.getAttribute("href");
      const dateYear = l.querySelector(".date-year").textContent;
      const dateMonth = l.querySelector(".date-month").textContent;
      const dateDay = l.querySelector(".date-day").textContent;

      return {
        blogID,
        title: link.textContent,
        url,
        createAt: `${dateYear}-${dateMonth}-${dateDay} 00:00:00`,
      };
    });
  }, blogID);

const getNextFlag = async (page: puppeteer.Page) =>
  await page.evaluate(() => {
    const nextButtonElement = document.querySelector(".test-pager-next");
    return nextButtonElement !== null;
  });

export const entries = async (blogID: string, blogDomain: string) => {
  const blogUrl = `https://${blogID}.${blogDomain}`;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  let pageCount = 1;
  await page.setDefaultNavigationTimeout(0);
  await page.goto(`${blogUrl}/archive?page=${pageCount}`, { waitUntil: "networkidle0" });
  await page.waitFor(1000);

  let entries = await getEntryLink(page, blogID);
  let nextFlag = await getNextFlag(page);

  while (nextFlag) {
    pageCount += 1;
    await page.goto(`${blogUrl}/archive?page=${pageCount}`, { waitUntil: "networkidle0" });
    await page.waitFor(1000);

    entries = [...entries, ...(await getEntryLink(page, blogID))];
    nextFlag = await getNextFlag(page);
  }

  await page.close();
  await browser.close();
  return entries;
};

type ParseFunctions = {
  parseFigureTag: (element: Element) => string;
  parseIMGTag: (element: Element) => string;
  parsePTag: (element: Element, newlineFlag: boolean, functions: ParseFunctions) => string;
  parseSpanTag: (element: Element, functions: ParseFunctions) => string;
  parseATag: (element: Element) => string;
  parseIFRAMETag: (element: Element) => string;
  parseCiteTag: (element: Element, functions: ParseFunctions) => string;
  parsePreTag: (element: Element) => string;
  parseHTag: (element: Element) => string;
  parseULTag: (element: Element, indentLevel: number, functions: ParseFunctions) => string;
  parseLITag: (element: Element, indentLevel: number, functions: ParseFunctions) => string;
  parseHRTag: () => string;
  parseBlockquoteTag: (element: Element) => string;
};

const parseFigureTag = (element: Element) => {
  const imgElement = element.getElementsByTagName("img")[0];
  const figcaptionElement = element.getElementsByTagName("figcaption")[0];

  return `${imgElement.outerHTML}
${figcaptionElement.innerText}

`;
};

const parseIMGTag = (element: Element) => {
  const imgElement = element;

  return `${imgElement.outerHTML}
`;
};

const parseATag = (element: Element) => {
  const className = element.getAttribute("class");
  const text = element.textContent;
  if (className === "keyword") return text;

  const href = element.getAttribute("href");

  return `[${text}](${href})`;
};

const parseIFRAMETag = (element: Element) => {
  const title = element.getAttribute("title") ? element.getAttribute("title").replace(/\//g, "／") : "";
  const src = element.getAttribute("src");
  const ogpsrc = element.getAttribute("src").match(/url=\S+/);
  const url = ogpsrc ? unescape(ogpsrc[0].replace(/^url=/, "")) : src;

  const shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.update(title);
  return `[![${title}](iframe-${shaObj.getHash("HEX")}.png)](${url})
`;
};

const parseCiteTag = (element: Element, functions: ParseFunctions) => {
  const childNodes = Array.from(element.childNodes);

  return (
    childNodes.reduce((accumulator, node) => {
      if (node.nodeName === "A") {
        const aTagElement: Element = node as Element;
        accumulator += functions.parseATag(aTagElement);
      }
      return accumulator;
    }, "") +
    `
`
  );
};

const parseSpanTag = (element: Element, functions: ParseFunctions) => {
  const childNodes = Array.from(element.childNodes);

  return (
    childNodes.reduce((accumulator, node) => {
      if (node.nodeName === "IMG") {
        const imgTagElement: Element = node as Element;
        accumulator += functions.parseIMGTag(imgTagElement);
      }
      return accumulator;
    }, "") +
    `
`
  );
};

const parsePTag = (element: Element, newlineFlag: boolean, functions: ParseFunctions) => {
  const childNodes = Array.from(element.childNodes);

  return (
    childNodes.reduce((accumulator, node) => {
      if (node.nodeName === "#text") accumulator += node.textContent;
      if (node.nodeName === "A") {
        const aTagElement: Element = node as Element;
        accumulator += functions.parseATag(aTagElement);
      }
      if (node.nodeName === "IFRAME") {
        const iframeTagElement: Element = node as Element;
        accumulator += functions.parseIFRAMETag(iframeTagElement);
      }
      if (node.nodeName === "CITE") {
        const citeTagElement: Element = node as Element;
        accumulator += functions.parseCiteTag(citeTagElement, functions);
      }
      if (node.nodeName === "SPAN") {
        const spanTagElement: Element = node as Element;
        accumulator += functions.parseSpanTag(spanTagElement, functions);
      }
      if (node.nodeName === "B") {
        const bTagElement: Element = node as Element;
        accumulator += `**${bTagElement.textContent}**`;
      }
      if (node.nodeName === "I") {
        const iTagElement: Element = node as Element;
        accumulator += `*${iTagElement.textContent}*`;
      }
      if (node.nodeName === "CODE") accumulator += `${"```"}${node.textContent}${"```"}`;
      if (node.nodeName === "BR")
        accumulator += `  
`;

      return accumulator;
    }, "") +
    (newlineFlag
      ? `  
`
      : "")
  );
};

const parsePreTag = (element: Element) => {
  const childNodes = Array.from(element.childNodes);

  return (
    childNodes.reduce(
      (accumulator, node) => {
        if (node.nodeName === "#text") accumulator += node.textContent;
        if (node.nodeName === "CODE") accumulator += node.textContent;
        if (node.nodeName === "SPAN") {
          const spanTagElement: Element = node as Element;
          accumulator += spanTagElement.textContent;
        }
        return accumulator;
      },
      `
${"```"}
`,
    ) +
    `
${"```"}

`
  );
};

const parseBlockquoteTag = (element: Element) => {
  return `> ${element.textContent}`;
};

const parseHTag = (element: Element) => {
  const text = element.textContent;
  const tagName = element.tagName;

  const num = Number(tagName.match(/\d/g)[0]);
  let sharpString = "";
  for (let i = 1; i <= num; i++) {
    sharpString += "#";
  }

  return `${sharpString} ${text}

`;
};

const parseLITag = (element: Element, indentLevel: number, functions: ParseFunctions) => {
  const childNodes = Array.from(element.childNodes);
  let indentString = "";
  for (let i = 0; i < indentLevel; i++) {
    indentString += "  ";
  }

  return (
    childNodes.reduce((accumulator, node, index) => {
      if (index === 0) accumulator += `${indentString}- `;
      if (node.nodeName === "#text") accumulator += node.textContent.replace(/\n+$/, "\n");
      if (node.nodeName === "A") {
        const aTagElement: Element = node as Element;
        accumulator += functions.parseATag(aTagElement);
      }
      if (node.nodeName === "P") {
        const pTagElement: Element = node as Element;
        accumulator += functions.parsePTag(pTagElement, false, functions);
      }
      if (node.nodeName === "SPAN") {
        const spanTagElement: Element = node as Element;
        accumulator += indentString + "  ";
        accumulator += functions.parseSpanTag(spanTagElement, functions);
      }
      if (node.nodeName === "UL") {
        const ulTagElement: Element = node as Element;
        accumulator += functions.parseULTag(ulTagElement, indentLevel + 1, functions);
      }

      return accumulator.replace(/\n+$/, "\n");
    }, "") +
    `
`
  );
};

const parseULTag = (element: Element, indentLevel: number, functions: ParseFunctions) => {
  const childNodes = Array.from(element.childNodes);

  return childNodes.reduce((accumulator, node) => {
    if (node.nodeName === "LI") {
      const liTagElement: Element = node as Element;
      accumulator += functions.parseLITag(liTagElement, indentLevel, functions);
    }

    return accumulator.replace(/\n+$/, "\n");
  }, "");
};

const parseHRTag = () => {
  return `
---------------------------------------

`;
};

const parseDivTag = (element: Element, functions: ParseFunctions) => {
  const childNodes = Array.from(element.childNodes);

  return childNodes.reduce((accumulator, node) => {
    const nodeElement: Element = node as Element;

    if (nodeElement.className === "figure-image figure-image-fotolife")
      return accumulator + functions.parseFigureTag(nodeElement);
    if (nodeElement.tagName === "P") return accumulator + functions.parsePTag(nodeElement, true, functions);
    if (/^H\d$/.test(nodeElement.tagName)) return accumulator + functions.parseHTag(nodeElement);
    if (nodeElement.tagName === "UL") return accumulator + functions.parseULTag(nodeElement, 0, functions);
    if (nodeElement.tagName === "PRE") return accumulator + functions.parsePreTag(nodeElement);
    if (nodeElement.tagName === "HR") return accumulator + functions.parseHRTag();
    if (nodeElement.tagName === "BLOCKQUOTE") return accumulator + functions.parseBlockquoteTag(nodeElement);

    return accumulator;
  }, "");
};

export const parseHTMLToMarkdown = async (entry: Entry) => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 500,
      height: 150,
    },
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  await page.goto(entry.url, { waitUntil: "networkidle0" });
  await page.addScriptTag({ url: "https://cdnjs.cloudflare.com/ajax/libs/jsSHA/2.4.0/sha256.js" });
  await page.waitFor(2000);

  const parseFunctions = {
    parseFigureTag: parseFigureTag.toString(),
    parseIMGTag: parseIMGTag.toString(),
    parseSpanTag: parseSpanTag.toString(),
    parsePTag: parsePTag.toString(),
    parseATag: parseATag.toString(),
    parseIFRAMETag: parseIFRAMETag.toString(),
    parseCiteTag: parseCiteTag.toString(),
    parsePreTag: parsePreTag.toString(),
    parseHTag: parseHTag.toString(),
    parseULTag: parseULTag.toString(),
    parseLITag: parseLITag.toString(),
    parseHRTag: parseHRTag.toString(),
    parseBlockquoteTag: parseBlockquoteTag.toString(),
    parseDivTag: parseDivTag.toString(),
  };

  const dirName = directoryName(entry);

  const iframeTags = await page.$$(".entry-content iframe");
  if (iframeTags && iframeTags.length > 0) {
    for (let i = 0; i < iframeTags.length; i++) {
      const title = ((await (await iframeTags[i].getProperty("title")).jsonValue()) as string).replace(/\//g, "／");
      const url = (await (await iframeTags[i].getProperty("src")).jsonValue()) as string;

      if (url) {
        const screenshotPage = await browser.newPage();
        await screenshotPage.setDefaultNavigationTimeout(0);

        await screenshotPage.goto(url);
        await screenshotPage.waitFor(1000);

        const shaObj = new jsSHA("SHA-256", "TEXT");
        shaObj.update(title);
        await screenshotPage.screenshot({
          path: `./data/${dirName}/iframe-${shaObj.getHash("HEX")}.png`,
        });
        await screenshotPage.close();
      }
    }
  }

  const markdown = await page.evaluate((parseFunctions) => {
    const entryContentElement = document.querySelector(".hentry .entry-content");
    const entryContentChildren = Array.from(entryContentElement.children);

    const parseFigureTag = new Function(`return ${parseFunctions.parseFigureTag}.apply(null, arguments)`);
    const parseIMGTag = new Function(`return ${parseFunctions.parseIMGTag}.apply(null, arguments)`);
    const parseSpanTag = new Function(`return ${parseFunctions.parseSpanTag}.apply(null, arguments)`);
    const parsePTag = new Function(`return ${parseFunctions.parsePTag}.apply(null, arguments)`);
    const parseATag = new Function(`return ${parseFunctions.parseATag}.apply(null, arguments)`);
    const parseIFRAMETag = new Function(`return ${parseFunctions.parseIFRAMETag}.apply(null, arguments)`);
    const parseCiteTag = new Function(`return ${parseFunctions.parseCiteTag}.apply(null, arguments)`);
    const parsePreTag = new Function(`return ${parseFunctions.parsePreTag}.apply(null, arguments)`);
    const parseHTag = new Function(`return ${parseFunctions.parseHTag}.apply(null, arguments)`);
    const parseULTag = new Function(`return ${parseFunctions.parseULTag}.apply(null, arguments)`);
    const parseLITag = new Function(`return ${parseFunctions.parseLITag}.apply(null, arguments)`);
    const parseHRTag = new Function(`return ${parseFunctions.parseHRTag}.apply(null, arguments)`);
    const parseBlockquoteTag = new Function(`return ${parseFunctions.parseBlockquoteTag}.apply(null, arguments)`);
    const parseDivTag = new Function(`return ${parseFunctions.parseDivTag}.apply(null, arguments)`);

    const functions = {
      parseFigureTag,
      parseIMGTag,
      parseSpanTag,
      parsePTag,
      parseATag,
      parseIFRAMETag,
      parseCiteTag,
      parsePreTag,
      parseHTag,
      parseULTag,
      parseLITag,
      parseHRTag,
      parseBlockquoteTag,
    };

    return entryContentChildren.reduce((accumulator, element) => {
      if (element.className === "figure-image figure-image-fotolife") return accumulator + parseFigureTag(element);
      if (element.tagName === "P") return accumulator + parsePTag(element, true, functions);
      if (/^H\d$/.test(element.tagName)) return accumulator + parseHTag(element);
      if (element.tagName === "UL") return accumulator + parseULTag(element, 0, functions);
      if (element.tagName === "PRE") return accumulator + parsePreTag(element);
      if (element.tagName === "HR") return accumulator + parseHRTag();
      if (element.tagName === "BLOCKQUOTE") return accumulator + parseBlockquoteTag(element);
      if (element.tagName === "DIV") return accumulator + parseDivTag(element, functions);

      return accumulator;
    }, "");
  }, parseFunctions);

  await page.close();
  await browser.close();
  return markdown;
};

export const parseImageTag = async (entry: Entry, markdown: string) => {
  const imageTags = markdown.match(/<img .*>/g);
  if (!imageTags) return markdown;

  const dirName = directoryName(entry);

  const parsedImageTagMaps = await Promise.all(
    imageTags.map((imageTag, index) => {
      const imageUrl = imageTag.match(/src="\S*\.\S*"/)[0].replace(/(src="|")/g, "");
      const imageExtension = imageUrl.split(".").pop().replace(/\?.*/, "");
      const imageFileName = `${index}-img-tag.${imageExtension}`;

      request({
        url: imageUrl,
        method: "GET",
        encoding: null,
      }).then((image) => {
        fs.writeFileSync(`./data/${dirName}/${imageFileName}`, image, "binary");
      });

      return [imageTag, imageTag.replace(/src="\S*"/, `src="${imageFileName}"`)];
    }),
  );

  let newMarkdown = markdown;
  parsedImageTagMaps.forEach((imageTagMap) => {
    newMarkdown = newMarkdown.replace(imageTagMap[0], imageTagMap[1]);
  });
  return newMarkdown;
};

export const createMarkdown = (entry: Entry, markdown: string) => {
  const dirName = directoryName(entry);
  fs.writeFileSync(`./data/${dirName}/README.md`, markdown);
};
