# HTTP Protocol (version 1) <br/> Comments Microservice

Comments microservice implements a HTTP compatible API, that can be accessed on configured port.
All input and output data is serialized in JSON format. Errors are returned in [standard format]().

* [CommentV1 class](#class1)
* [DataPage<CommentV1> class](#class2)
* [POST /comments/get_comments](#operation1)
* [POST /comments/get_comment_by_id](#operation2)
* [POST /comments/create_comment](#operation3)
* [POST /comments/update_comment](#operation4)
* [POST /comments/delete_comment_id](#operation5)

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
- data: [Comment] - array of retrieved Comment page
- count: int - total number of objects in retrieved resultset

## Operations

### <a name="operation1"></a> Method: 'POST', route '/comments/get_comments'

Retrieves a collection of comments according to specified criteria

**Request body:** 
- correlation_id: string - (optional) unique id that identifies distributed transaction
- filter: Object
  - tags: string - (optional) a comma-separated list of tags with topic names
  - status: string - (optional) comment editing status
  - author: string - (optional) author name in any language 
- paging: Object
  - skip: int - (optional) start of page (default: 0). Operation returns paged result
  - take: int - (optional) page length (max: 100). Operation returns paged result

**Response body:**
Array of Comment objects, DataPage<CommentV1> object is paging was requested or error

### <a name="operation2"></a> Method: 'POST', route '/comments/get\_comment\_by_id'

Retrieves a single comment specified by its unique id

**Request body:** 
- correlation_id: string - (optional) unique id that identifies distributed transaction
- comment_id: string - unique comment id

**Response body:**
Comment object, null if object wasn't found or error 

### <a name="operation3"></a> Method: 'POST', route '/comments/create_comment'

Creates a new comment

**Request body:**
- correlation_id: string - (optional) unique id that identifies distributed transaction
- comment: CommentV1 - Comment object to be created. If object id is not defined it is assigned automatically.

**Response body:**
Created Comment object or error

### <a name="operation4"></a> Method: 'POST', route '/comments/update_comment'

Updates comment specified by its unique id

**Request body:** 
- correlation_id: string - (optional) unique id that identifies distributed transaction
- comment: CommentV1 - Comment object with new values. Partial updates are supported

**Response body:**
Updated Comment object or error 
 
### <a name="operation5"></a> Method: 'POST', route '/comments/delete\_comment\_by_id'

Deletes comment specified by its unique id

**Request body:** 
- correlation_id: string - (optional) unique id that identifies distributed transaction
- comment_id: string - unique comment id

**Response body:**
Occured error or null for success
 
