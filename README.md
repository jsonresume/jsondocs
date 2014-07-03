## JsonDocs

JsonDocs is a NPM module that generates minimalistic documentation for a given JSON schema. You can view an example [here](http://codepen.io/thomasdavis/pen/jBrya)

### Getting started

JsonDocs is a command line app that when passed a JSON schema file called `example.json` will output a new file called `example.json.html`

```
sudo npm install -g jsondocs
```

Then simply

```
jsondocs schema.json
```

You should now have some raw HTML which can be themed.

Use this [themed example output](http://codepen.io/thomasdavis/pen/jBrya) as a basis.

This is made for draft v4 and highly untested. If you like the concept please leave new issues and we can go from there.
