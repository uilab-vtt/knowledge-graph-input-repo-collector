# Data Validation Report

This is an automatically generated validation report from *[knowledge-graph-input-repo-collector](https://github.com/uilab-vtt/knowledge-graph-input-repo-collector)* application. 

Data was collected from the repositories and validated on the server at around <%= now %>.

## Target Files

Following files were collected and validated from the each repository.

<% filenames.forEach(filename => { %>
- <%= filename %>
<% }); %>

## Validation Results

Here are the valiation results for the source repositories. 

<% sourceErrors.forEach(({ source, error }) => { %>
### <%= source.id %> (<%= source.provider %>, <%= source.description %>)

<% if (error.length === 0) { %>

No error was found on the data files from this repository.

<% } else { %>

Following errors are found from the data files in the repository.

<% error.forEach(fileError => { %>

#### <%= fileError.filename %>

```
<%= fileError.error %>
```

<% }) %>

<% } %>

<% }); %>