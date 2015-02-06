# Dustjs Helper - mongoose

allows you to query data from mongoose models.

## Usage

    {@mongoose model="group" find="{'title': 'ok'}" select="title level" sort="{'level': -1}" limit="3"}
        {#items}

            {! aditional template in here !}
        
        {/items}
    {/mongoose}

Notice the use of single quotes in the JSON attributes (find and sort). Dust only allows double quotes in it's attributes, so instead of escaping the quotes in the JSON data we used single quotes instead.