import * as hatenablog from "@src/hatenablog";

process.setMaxListeners(0);

export const exec = async (blogID: string, blogDomain: string) => {
  const entries = await hatenablog.entries(blogID, blogDomain);

  await Promise.all(
    entries.map(async entry => {
      hatenablog.mkdir(entry);

      let markdown = await hatenablog.parseHTMLToMarkdown(entry);
      markdown = await hatenablog.parseImageTag(entry, markdown);
      hatenablog.createMarkdown(entry, markdown);
      console.info(` \u001b[32m ${entry.title}`);
    })
  );

  console.info(" \u001b[32m Success");
};

const blogIDKeyValue = process.argv.join().match(/blogID=\S*/);
const blogDomainKeyValue = process.argv.join().match(/blogDomain=\S*/);
if (blogIDKeyValue && blogIDKeyValue.length === 1 && blogDomainKeyValue && blogDomainKeyValue.length === 1) {
  const blogID = blogIDKeyValue[0].replace("blogID=", "").replace(/,\S*/, "");
  const blogDomain = blogDomainKeyValue[0].replace("blogDomain=", "").replace(/,\S*/, "");

  console.info(` export blogID:${blogID}`);
  exec(blogID, blogDomain);
} else {
  console.error(' \u001b[31m please "npm run export blogID=igara blogDomain=hatenablog.com"');
}
