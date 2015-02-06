# Dustjs Helper - api

Allows you to do a basic GET request to any resource. 

## Usage

    {@api resource="http://www.test.com/test/?limit=1"}

        {! aditional template in here !}
        {! if it's an array it will be wrapped in an object. Iterate {#items} !}
    
    {/api}

Method is always GET. No headers or auth for now. It's in the wish list.