aosman:tabulate
=========================
Meteor Package that creates a reactive table from any given mongo collection

## Installation
```js
meteor add aosman:tabulate
```

## Usage
Create a publication and a method in your server as follows
```js
if(Meteor.isServer){
    Meteor.publish("pubName", function(query,options){
      return CollectionName.find(query,options);
    });
    Meteor.methods({
      CollectionNameCount:function(query,options){
        return CollectionName.find(query,options).fetch().length;
      }
    });
}
```
Note: Make sure your method name is the same as collection name adding Count to it.

add tabulate template to your html file as follows

```js
{{> tabulate options=options query=query}}
```
Create options object in your js file as follows
```js
Options = {
            collection: "CollectionName",
            publication: "pubName",
            columns: [
              { data: "fieldName",
                title: "Field Title",
                render: function(doc, col){
                  if(doc && col){
                    val = doc[col]
                    return accounting.formatMoney(val);
                  }
                  return true;
                },
                tmpl: "customTemplate",
                searchable: true,
              },
            ],
            extraFields: ["bill_id"],
          },
    ...
}
```
collection: collection name
publication: the name of the publication you created earlier.
columns: an array of objects holding the columns to be rendered in the table.
extraFields: (optional) any extra fields for subscription,

#Column structure
data: field name in schema
title: column title
render: (optional) used this if you want to render processed data
tmpl: (optional) create a custom template you want to render in the cell and assign it's name here
searchable: (optional) deafault is false 
