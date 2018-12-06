# Knowledge Graph Input Repository Collector

This project helps the user to collect input data for the project [knowledge-graph-builder](https://github.com/uilab-vtt/knowledge-graph-builder) from multiple repositories that follow the rule described in the repository [vtt-example-video-label-data](https://github.com/uilab-vtt/vtt-example-video-label-data).

## Config files

### sources.json

`sources.json` contains the information on source repositories to collect input data for knowledge graph builder from.

### source-filenames.json

`source-filenames.json` decides which files are going to be validated and used as a knowledge graph source data from all repositories.

## How to use

Install Node.js and Yarn first. When they are ready, run following command to get dependencies.

```bash
$ yarn install
```

After installing all dependencies, run following command to collect all required external repositories. Data source repositories are downloaded in this stage with other depedencies.

```bash
$ yarn fetch
```

Setup your validator and validate the source data with the following command.

```bash
$ yarn validate
```

This will create the [validation-report.md](https://github.com/uilab-vtt/knowledge-graph-input-repo-collector/blob/master/validation-report.md) file that lists the validation errors found from all source data collected.

# Acknowledgements

This work was supported by Institute for Information & communications Technology Promotion(IITP) grant funded by the Korea government(MSIT) (2017-0-01780, The technology development for event recognition/relational reasoning and learning knowledge based system for video understanding)
 