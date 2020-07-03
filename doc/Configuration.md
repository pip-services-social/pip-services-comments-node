# Configuration Guide <br/> Comments Microservice

Configuration structure used by this module follows the 
[standard configuration](https://github.com/pip-services/pip-services/blob/master/usage/Configuration.md) 
structure.

Example **config.yaml** file:

```yaml
- descriptor: "pip-services-container:container-info:default:default:1.0"
  name: "pip-services-comments"
  description: "Comments microservice"

- descriptor: "pip-services-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "pip-services-comments:persistence:file:default:1.0"
  path: "./data/comments.json"

- descriptor: "pip-services-comments:controller:default:default:1.0"

- descriptor: "pip-services-comments:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 3000
```
