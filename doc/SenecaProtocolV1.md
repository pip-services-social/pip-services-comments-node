# Seneca Protocol (version 1) <br/> Comments Microservice

Comments microservice implements a Seneca compatible API. 
Seneca port and protocol can be specified in the microservice [configuration](Configuration.md/#api_seneca). 

```javascript
var seneca = require('seneca')();

seneca.client({
    connection: {
        type: 'tcp', // Microservice seneca protocol
        localhost: '0.0.0.0', // Microservice localhost
        port: 9002, // Microservice seneca port
    }
});
```

The microservice responds on the following requests:

```javascript
seneca.act(
    {
        role: 'comments',
        version: 1,
        cmd: ...cmd name....
        ... Arguments ...
    },
    function (err, result) {
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
- result: CommentV1 - retrieved comment, null if object wasn't found 

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

 