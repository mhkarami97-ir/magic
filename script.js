const CACHE_EXPIRY_DAYS = 30;

function getCached(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const { data, timestamp } = JSON.parse(raw);
  const ageMs = Date.now() - timestamp;
  if (ageMs > CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000) {
    localStorage.removeItem(key);
    return null;
  }
  return data;
}

function setCache(key, data) {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}

function fetchData(theUrl) {
  const cacheKey = "fetch_" + theUrl;
  const cached = getCached(cacheKey);
  if (cached) return Promise.resolve(cached);

  let list = [];

  return fetch(theUrl)
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) throw new Error("Not an array");
      for (let item of data) {
        let url = item.download_url;
        let file = item.name;

        list.push({ url, file });
      }

      setCache(cacheKey, list);
      return list;
    })
    .catch((error) => {
      console.error(error);
      const stale = localStorage.getItem(cacheKey);
      if (stale) return JSON.parse(stale).data;
      return [];
    });
}

function fetchDataAsString(theUrl) {
  const cacheKey = "fetch_str_" + theUrl;
  const cached = getCached(cacheKey);
  if (cached) return Promise.resolve(cached);

  return fetch(theUrl)
    .then((data) => {
      if (!data.ok) throw new Error(data.status);
      return data.text();
    })
    .then((text) => {
      setCache(cacheKey, text);
      return text;
    })
    .catch((error) => {
      console.error(error);
      const stale = localStorage.getItem(cacheKey);
      if (stale) return JSON.parse(stale).data;
      return "";
    });
}

function randomItem(list) {
  if (!list || list.length === 0) {
    return null;
  } else {
    let index = Math.floor(Math.random() * list.length);

    return list[index];
  }
}

function getTitle(str) {
  let lines = str.split("\n");

  for (let line of lines) {
    if (line.startsWith("title")) {
      var tmp = line.split(":")[1];

      tmp = tmp.replaceAll('"', "").trim();

      return tmp;
    }
  }
}

function getCategory(str) {
  let lines = str.split("\n");
  let nextLine = false;
  for (let line of lines) {
    if (nextLine === true) {
      var tmp = line.split("-")[1];

      tmp = tmp.trim().toLowerCase();

      return tmp;
    }
    if (line.startsWith("categories")) {
      nextLine = true;
    }
  }
}

function removeBlankLine(str) {
  return str.replace(/(^[ \t]*\n)/gm, "");
}

function printData(data) {
  let template;

  if (
    data.name == "poem" ||
    data.name == "sentence" ||
    data.name == "experience" ||
    data.name == "tarfand"
  ) {
    template = `
  <div class="col1" ontouchstart="this.classList.toggle('hover');">
      <div class="container">
          <div class="front" style="background-color: #3e4646;background-image: url('./img/${
            data.name
          }.jpg')">
              <div class="inner">
                  <p>${data.name.toUpperCase()}</p>
                  <span>${data.persianTxt}</span>
              </div>
          </div>
          <div class="back">
              <div class="inner">
                  <p><a href="${data.siteUrl}">${data.text}</a></p>
                  <span>کلیک کن تا بیشتر ببینی</span>
              </div>
          </div>
      </div>
  </div>
  `;
  } else {
    template = `
  <div class="col" ontouchstart="this.classList.toggle('hover');">
      <div class="container">
          <div class="front" style="background-color: #3e4646;background-image: url('./img/${
            data.name
          }.jpg')">
              <div class="inner">
                  <p>${data.name.toUpperCase()}</p>
                  <span>${data.persianTxt}</span>
              </div>
          </div>
          <div class="back">
              <div class="inner">
                  <p><a href="${data.siteUrl}">${data.text}</a></p>
                  <span>کلیک کن تا بیشتر ببینی</span>
              </div>
          </div>
      </div>
  </div>
  `;
  }
  document.getElementById("main").innerHTML += template;
}

function load() {
  let urls = [
    {
      url: "https://gh-proxy.mhkarami97.ir/github-proxy/repos/mhkarami97-ir/travel/contents/_posts",
      name: "travel",
      persianTxt: "بیا با هم بریم سفر",
      id: 1,
    },
    {
      url: "https://gh-proxy.mhkarami97.ir/github-proxy/repos/mhkarami97-ir/video/contents/_posts",
      name: "video",
      persianTxt: "یه فیلم با هم ببینیم",
      id: 2,
    },
    {
      url: "https://gh-proxy.mhkarami97.ir/github-proxy/repos/mhkarami97-ir/book/contents/_posts",
      name: "book",
      persianTxt: "کتاب بهترین رفیق تنهایی آدمه",
      id: 3,
    },
    {
      url: "https://gh-proxy.mhkarami97.ir/github-proxy/repos/mhkarami97-ir/music/contents/_posts",
      name: "music",
      persianTxt: "خرم آن نغمه که مردم بسپارند به یاد",
      id: 4,
    },
    {
      url: "https://gh-proxy.mhkarami97.ir/github-proxy/repos/mhkarami97-ir/trip/contents/_posts",
      name: "trip",
      persianTxt: "مجازی سفر کن",
      id: 5,
    },
    {
      url: "https://gh-proxy.mhkarami97.ir/github-proxy/repos/mhkarami97-ir/trick/contents/_posts",
      name: "trick",
      persianTxt: "یه نکته کاربردی که ممکنه به‌دردت بخوره",
      id: 6,
    },
    {
      url: "https://gh-proxy.mhkarami97.ir/github-proxy/repos/mhkarami97-ir/blog/contents/_posts",
      name: "blog",
      persianTxt: "وقت یه درس تخصصی هستش",
      id: 7,
    },
    {
      url: "https://gh-proxy.mhkarami97.ir/github-proxy/repos/mhkarami97-ir/link/contents/_posts",
      name: "link",
      persianTxt: "بریم تو دنیای اینترنت غرق بشیم",
      id: 8,
    },
    {
      url: "https://gh-proxy.mhkarami97.ir/github-proxy/repos/mhkarami97-ir/poem/contents/_posts",
      name: "poem",
      persianTxt: "دو سه رکعت غزل شاد بخوانم هر روز",
      id: 9,
    },
    {
      url: "https://gh-proxy.mhkarami97.ir/github-proxy/repos/mhkarami97-ir/sentence/contents/_posts",
      name: "sentence",
      persianTxt: "بعضی وقتا یه جمله می‌تونه آدم رو عوض کنه",
      id: 10,
    },
    {
      url: "https://gh-proxy.mhkarami97.ir/github-proxy/repos/mhkarami97-ir/experience/contents/_posts",
      name: "experience",
      persianTxt: "خوش بود گر محک تجربه آید به میان",
      id: 11,
    },
    {
      url: "https://gh-proxy.mhkarami97.ir/github-proxy/repos/mhkarami97-ir/tarfand/contents/_posts",
      name: "tarfand",
      persianTxt: "آموزش تخصصی",
      id: 12,
    },
  ];

  let textData = ["sentence", "poem"];

  let resultData = [];
  let completed = 0;

  urls.forEach((data) => {
    let name = data.name;
    let persianTxt = data.persianTxt;
    let id = data.id;

    fetchData(data.url)
      .then((list) => {
        if (!list || list.length === 0) {
          completed++;
          if (completed === urls.length) renderResults();
          return;
        }
        let item = randomItem(list);
        let file = item.file;

        fetchDataAsString(item.url).then((dataAsString) => {
          let text;
          let siteUrl;
          let tmpName;
          let category;

          if (textData.includes(name)) {
            let infos = dataAsString.split("---")[2];
            text = removeBlankLine(infos);
          } else {
            let infos = dataAsString.split("---")[1];
            text = getTitle(infos);
          }

          text = text.replaceAll("'", "");

          switch (name) {
            case "travel":
            case "video":
            case "trip":
            case "blog":
            case "experience":
            case "tarfand":
            case "book":
            case "trick":
              tmpName = file.split("-")[3].split(".")[0];
              siteUrl = "https://" + name + ".mhkarami97.ir/posts/" + tmpName;
              break;

            case "music":
              tmpName = file.split(".")[0];
              tmpName = tmpName.substring(11);
              siteUrl = "https://" + name + ".mhkarami97.ir/" + tmpName;
              break;

            case "link":
              siteUrl = "https://" + text;
              break;

            default:
              siteUrl = "https://" + name + ".mhkarami97.ir";
              break;
          }

          resultData.push({
            name,
            text,
            persianTxt,
            siteUrl,
            id,
          });

          completed++;
          if (completed === urls.length) renderResults();
        });
      })
      .catch((error) => {
        console.error(error);
        completed++;
        if (completed === urls.length) renderResults();
      });
  });

  function renderResults() {
    resultData = resultData.sort(function (a, b) {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });

    document.getElementById("wait").style.display = "none";

    resultData.forEach((i) => {
      printData(i);
    });
  }
}

load();
