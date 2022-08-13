import * as childProcess from "child_process";
import * as fs from "fs";
import * as marked from "marked";

const exec = () => {
  const gitUrl = childProcess.execSync("git config --get remote.origin.url").toString();
  const repositoryName = gitUrl.replace(/(https:\/\/github.com\/|git@github.com:|.git)/g, "");

  const blogDirectoryNames = fs.readdirSync("data");
  blogDirectoryNames.forEach((blogDirectoryName) => {
    const blogItemDirectoryNames = fs.readdirSync(`data/${blogDirectoryName}`);
    blogItemDirectoryNames.forEach((blogItemDirectoryName) => {
      if (/^\./.test(blogItemDirectoryName)) return;

      const markdown = fs.readFileSync(`data/${blogDirectoryName}/${blogItemDirectoryName}/README.md`).toString();
      const renderer = new marked.Renderer();
      renderer.link = (href, _, text) => {
        if (/^#/.test(href)) return `<a href="${href}">${text}</a>`;
        return `<a target="_blank" rel="noopener noreferrer" href="${href}">${text}</a>`;
      };

      let body = marked.marked(markdown, {
        gfm: true,
        renderer,
      });
      body = body.replace(
        /src="/g,
        `src="https://raw.githubusercontent.com/${repositoryName}/master/data/${blogDirectoryName}/${blogItemDirectoryName}/`,
      );

      body = `<div class="markdown-body">
  ${body}
</div>`;

      fs.writeFileSync(`data/${blogDirectoryName}/${blogItemDirectoryName}/README.html`, body);
    });
  });
};

exec();
