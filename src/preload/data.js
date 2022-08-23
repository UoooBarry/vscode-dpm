const { listPackages, listTags } = require('../dpm');

const data = {
  supportedPackages: new Promise((resolve, reject) => {
    listPackages().then((out) => {
      const versions = out.split('\n').map((p) => p.trim()).filter((p) => p.length > 0);
      resolve(versions);
    }).catch((e) => {
      reject(e);
    });
  }),
  supportedTags: {},
};

/* Preload all the version supported */
data.supportedPackages.then((packages) => {
  packages.forEach((p) => {
    listTags(p).then((out) => {
      data.supportedTags[p] = out.split('\n').map((pa) => pa.trim()).filter((pf) => pf.length > 0);
    });
  });
});

module.exports = data;
