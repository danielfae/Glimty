# Button
------

| Attribute              | Type        | Description                                            | 
| ---------------------- |:-----------:| :------------------------------------------------------| 
|`_id`                   | `String`    | unique                                                 |
|`type`                  | `String`    | postback                                               |
|`title`                 | `String`    | text inside button                                     |

***
##Endpoints summary

| HTTP Verb | URL                      | Description                                | 
| ----------|:------------------------:| :------------------------------------------|
|GET        | ```api/button```         | Returns a list of buttons.                 |
|GET        | ```api/button/:id```     | Returns the button with the specified id.  | 
|POST       | ```api/button/```        | Button registration.                       | 
|PUT        | ```api/button/:button``` | Updates button's attribute.                | 
|DEL        | ```api/button/:id```     | Permanently deletes button.                | 
