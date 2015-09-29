document.addEventListener('DOMContentLoaded', () => {
  const hotArticlesEl = document.getElementById('hotArticles');
  const partialLiTemplate = `
    <li class="hotArticles__body__articles__item">
      <a
        href=":url"
        class="hotArticles__body__articles__item__link"
      >
        <div
          class="hotArticles__body__articles__item__link__image"
          style="background-image: url(:image)"
        ></div>
        <div class="hotArticles__body__articles__item__link__meta">
          <span class="hotArticles__body__articles__item__link__meta__title">
            <span>
              :title
            </span>

            <img
              src="http://b.hatena.ne.jp/entry/image/:url"
              alt="はてなブックマーク - :title"
              title="はてなブックマーク - :title"
            >
          </span>
        </div>
      </a>
    </li>
  `;

  const appendHotArticle = ({ title, url, images }) => {
    const partialHtml = partialLiTemplate
                          .replace(/\:title/g, title)
                          .replace(/\:url/g, url)
                          .replace(/\:image/g, images[0]);

    hotArticlesEl.innerHTML = hotArticlesEl.innerHTML + partialHtml;
  };

  google.load('feeds', '1', {
    callback() {
      const feed = new google.feeds.Feed(
        `http://b.hatena.ne.jp/entrylist?mode=rss&sort=count&url=http://axross.me/`
      );
      feed.setNumEntries(5);
      feed.load(result => {
        if (result.err) return console.error(err);

        result.feed.entries
          .map(entry => {
            return {
              title: entry.title,
              url: entry.link,
              images: entry.content.match(/https?:\/\/[^"]+\.(gif|jpg|png)/g),
              publishedAt: new Date(entry.publishedDate),
            };
          })
          .forEach(entry => appendHotArticle(entry));
      });
    },
  });
});
