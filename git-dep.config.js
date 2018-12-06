const sources = require('./sources.json');

const sourceDependencies = sources.reduce((acc, curr) => ({
  ...acc,
  [curr.id]: {
    repository: curr.repository,
    branch: 'master',
  },
}), {});

module.exports = {
  basePath: 'repositories',
  dependencies: {
    ...sourceDependencies,
    validator: {
      repository: 'https://github.com/uilab-vtt/knowledge-graph-input.git',
      branch: 'master',
    },
    builder: {
      repository: 'https://github.com/uilab-vtt/knowledge-graph-builder.git',
      branch: 'master',
    },
  }
};