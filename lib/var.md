# Dustjs Helper - var

Allows you to make something editable in /edit mode. In normal mode (view) it just outputs the dustjs data that is contained by that variable. Assumes the project is using [Lackey inline edit](https://www.npmjs.com/packages/lackey-inline-edit)

## Usage

This is the prefered method of using the helper. There is another syntax with the full name that can be useful when a page contains data from multiple entities.

    {@var name="[self].title" /}

Full name syntax:

    {@var name="{controllerName}.{itemId}.{property}" /}

Controller Name must match the name of the folder of the controller in plural form.
Item Id needs to be the Mongo Object Id. Using the slug may work on some situations but will bring problems in the long run.
Property will be the actual property name. A sub property can also be provided. 

For example: 
    
    {@var name="examples.54b7da60c7b40835433532f3.stats.today" /}

If we are inside /examples/54b7da60c7b40835433532f3 or the same page, but using the slug, we can use a short version:

    {@var name="[self].stats.today" /}



Dustjs variables can be used to create the name property:

    {@var name="examples.{id}.stats.today" /}

## Types

There is a property "type" that can be used to limit the type of data provided or to use a specific interface.

    {@var name="self.title" type="text" /}

The current supported types are:

- select
- text
- number
- boolean
- list
    