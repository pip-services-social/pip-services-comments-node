# AWS Lambda Protocol (version 1) <br/> Comments Microservice

Pip.Services Template microservice implements AWS Lambda compatible API. 

The entire microservice is wrapped into a single lambda function.
Selection of specific operation is done via special **cmd** parameter.
The rest parameters are passed to the operation.

The input and output parameters shall be serialized as JSON string.

The protocol is identical to the one used by [Seneca](./SenecaProtocolV1.md)   

First get reference to AWS SDK, set connection parameters and get reference to Lambda:

```javascript
var aws = require('aws-sdk')();

aws.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

var lambda = new aws.Lambda();
```

Then you can start calling Lambda function:

```javascript
var params = {
    cmd: ...operation name...,
    ... the rest params ...
};

lambda.invoke(
    {
        FunctionName: arn,
        InvocationType: 'RequestResponse',
        LogType: 'None',
        Payload: JSON.stringify(params)
    },
    function (err, response) {
        if (err) ...
        var result = JSON.parse(response.Payload);
        ...
    }
);
```

* [CommentV1 class](#class1)
* [DataPage<CommentV1> class](#class2)
* [cmd: 'get_comments'](#operation1)
* [cmd: 'get_comment_by_id'](#operation2)
* [cmd: 'create_comment'](#operation3)
* [cmd: 'update_comment'](#operation4)
* [cmd: 'delete_comment_by_id'](#operation5)

## Data types

### <a name="class1"></a> CommentV1 class

Represents an comment

**Properties:**
- id: string - unique comment id
- name: string - comment name
- description: string - comment description
- product: string - product name
- copyrights: string - copyrights
- min_ver: number - minimum version
- max_ver: number - maximum version

### <a name="class2"></a> DataPage<CommentV1> class

Represents a paged result with subset of requested comments

**Properties:**
- data: [CommentV1] - array of retrieved Comment page
- count: int - total number of objects in retrieved resultset

## Operations

### <a name="operation1"></a> Cmd: 'get_comments'

Retrieves a collection of comments according to specified criteria

**Arguments:** 
- correlation_id: string - (optional) unique id that identifies distributed transaction
- filter: object - filter parameters
  - tags: [string] - (optional) list tags with topic names
  - status: string - (optional) comment editing status
  - author: string - (optional) author name in any language 
- paging: object - paging parameters
  - skip: int - (optional) start of page (default: 0). Operation returns paged result
  - take: int - (optional) page length (max: 100). Operation returns paged result

**Returns:**
- err: Error - occured error or null for success
- result: DataPage<CommentV1> - retrieved comments in page format

### <a name="operation2"></a> Cmd: 'get\_comment\_by\_id'

Retrieves a single comment specified by its unique id

**Arguments:** 
- correlation_id: string - (optional) unique id that identifies distributed transaction
- comment_id: string - unique Comment object id

**Returns:**
- err: Error - occured error or null for success
- result: Comment - retrieved comment, null if object wasn't found 

### <a name="operation3"></a> Cmd: 'create_comment'

Creates a new comment

**Arguments:** 
- correlation_id: string - (optional) unique id that identifies distributed transaction
- comment: CommentV1 - Comment object to be created. If object id is not defined it is assigned automatically.

**Returns:**
- err: Error - occured error or null for success
- result: CommentV1 - created comment object

### <a name="operation4"></a> Cmd: 'update_comment'

Updates comment specified by its unique id

**Arguments:** 
- correlation_id: string - (optional) unique id that identifies distributed transaction
- comment_id: string - unique comment id
- comment: CommentV1 - comment object with new values. Partial updates are supported

**Returns:**
- err: Error - occured error or null for success
- result: CommentV1 - updated comment object 
 
### <a name="operation5"></a> Cmd: 'delete\_comment\_by_id'

Deletes comment specified by its unique id

**Arguments:** 
- correlation_id: string - (optional) unique id that identifies distributed transaction
- comment_id: string - unique comment id

**Returns:**
- err: Error - occured error or null for success

 